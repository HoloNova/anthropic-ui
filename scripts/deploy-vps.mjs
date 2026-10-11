/*
 * 部署到 VPS（默认 ui.campuslink.vip）。
 *
 *   npm run deploy:vps              # 构建 → 打包上传 → 同步 → 公网自检
 *   npm run deploy:vps -- --skip-build
 *
 * 站点根目录是 nginx 容器的 bind mount（/var/www/ui.campuslink.vip:ro），
 * 所以不能整目录替换：mv 换掉的是 inode，容器里看到的还是旧目录。
 * 必须在同一目录内同步内容，服务器上有 rsync，用 rsync -a --delete 完成。
 *
 * 远端脚本一律 scp 上去再 bash 执行 —— 用管道喂给 bash -s 时 heredoc 会被吞行。
 *
 * 环境变量：
 *   DEPLOY_HOST    默认 vps（~/.ssh/config 里的别名）
 *   DEPLOY_DOMAIN  默认 ui.campuslink.vip
 *   DEPLOY_ROOT    默认 /var/www/ui.campuslink.vip
 */
import { execFile } from "node:child_process";
import { mkdtemp, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);

const HOST = process.env.DEPLOY_HOST ?? "vps";
const DOMAIN = process.env.DEPLOY_DOMAIN ?? "ui.campuslink.vip";
const ROOT = process.env.DEPLOY_ROOT ?? "/var/www/ui.campuslink.vip";
const STAGE = "/tmp/ui-dist";
const ARCHIVE = "/tmp/ui-dist.tar.gz";
const REMOTE_SCRIPT = "/tmp/ui-deploy.sh";
const SKIP_BUILD = process.argv.includes("--skip-build");

const CHECKS = [
  ["/", 200, "text/html"],
  ["/origin/", 200, "text/html"],
  ["/component/", 200, "text/html"],
  ["/component.md", 200, "text/markdown; charset=utf-8"],
  ["/nope", 404, null],
];

function step(text) {
  console.log(`\n=== ${text} ===`);
}

async function sh(command, args, options = {}) {
  const { stdout, stderr } = await run(command, args, {
    maxBuffer: 32 * 1024 * 1024,
    ...options,
  });
  if (stderr?.trim()) process.stderr.write(stderr);
  return stdout;
}

/* Windows 上 npm 是 .cmd：Node 18.20+ 起不允许不带 shell 直接 spawn 批处理文件。 */
const npmRun = (script) =>
  process.platform === "win32"
    ? sh("npm", ["run", script, "--silent"], { shell: true })
    : sh("npm", ["run", script, "--silent"]);

/* 远端脚本：解包到暂存目录，再用 rsync 同步进站点根目录。 */
const remoteScript = `set -euo pipefail
sudo rm -rf ${STAGE}
sudo mkdir -p ${STAGE} ${ROOT}
sudo tar -xzf ${ARCHIVE} -C ${STAGE}
sudo chown -R root:root ${STAGE}
sudo chmod -R a+rX ${STAGE}
sudo rsync -a --delete --delay-updates ${STAGE}/ ${ROOT}/
sudo rm -rf ${STAGE} ${ARCHIVE}
echo "站点文件数：$(sudo find ${ROOT} -type f | wc -l)"
`;

async function main() {
  if (!SKIP_BUILD) {
    step("本地构建");
    process.stdout.write(await npmRun("build"));
  }

  const dist = path.resolve("dist");
  const distStat = await stat(dist).catch(() => null);
  if (!distStat?.isDirectory()) throw new Error("没有 dist/，先跑一次 npm run build");

  const workdir = await mkdtemp(path.join(tmpdir(), "ui-deploy-"));
  const archive = path.join(workdir, "ui-dist.tar.gz");
  const script = path.join(workdir, "ui-deploy.sh");

  try {
    step("打包 dist/");
    await sh("tar", ["-czf", archive, "-C", dist, "."]);
    const { size } = await stat(archive);
    console.log(`${(size / 1024).toFixed(1)} KB`);

    step(`上传到 ${HOST}`);
    await writeFile(script, remoteScript);
    await sh("scp", ["-q", archive, script, `${HOST}:/tmp/`]);

    step(`同步到 ${ROOT}`);
    console.log(await sh("ssh", [HOST, `bash ${REMOTE_SCRIPT}`]));
    await sh("ssh", [HOST, `rm -f ${REMOTE_SCRIPT}`]);

    step("公网自检");
    let failed = 0;
    for (const [pathname, wantStatus, wantType] of CHECKS) {
      const response = await fetch(`https://${DOMAIN}${pathname}`, { redirect: "manual" });
      const type = response.headers.get("content-type") ?? "";
      const ok = response.status === wantStatus && (!wantType || type.startsWith(wantType));
      if (!ok) failed += 1;
      console.log(`${ok ? "PASS" : "FAIL"} ${pathname} → ${response.status} ${type}`);
    }

    const markdown = await fetch(`https://${DOMAIN}/component.md`).then((response) => response.text());
    const markdownOk = markdown.startsWith("# 手绘水彩渲染引擎拆解");
    if (!markdownOk) failed += 1;
    console.log(`${markdownOk ? "PASS" : "FAIL"} /component.md 内容与编码（${markdown.length} 字符）`);

    if (failed) {
      console.error(`\n${failed} 项自检未通过，请检查 /opt/nginx-docker/conf.d/ui 与容器日志：`);
      console.error(`  ssh ${HOST} 'sudo docker logs nginx --tail 50'`);
      process.exitCode = 1;
      return;
    }
    console.log(`\n部署完成：https://${DOMAIN}`);
  } finally {
    await rm(workdir, { recursive: true, force: true });
  }
}

await main();
