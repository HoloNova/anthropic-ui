# 部署到 VPS（ui.campuslink.vip）

一台 Ubuntu 24.04 的机器，nginx 跑在 Docker 里，证书用宿主机上的 certbot 以 webroot 方式签发。

## 服务器上的布局

| 位置 | 作用 |
|---|---|
| `/var/www/ui.campuslink.vip` | 站点根目录，`npm run build` 的产物 |
| `/opt/nginx-docker/compose.yml` | nginx 容器的定义（`nginx:stable`，占用 80/443，网络 `campuslink_campusnet`） |
| `/opt/nginx-docker/nginx.conf` | 全局配置，**逐条 include** `conf.d/` 下的站点文件 |
| `/opt/nginx-docker/conf.d/ui` | 本站的 server 块，内容与本目录的 `ui.campuslink.vip.conf` 一致 |
| `/etc/letsencrypt/live/ui.campuslink.vip/` | 证书（ECDSA，webroot 方式，自动续期） |
| `/var/www/letsencrypt-webroot` | ACME 验证目录，certbot 与 nginx 共用 |

nginx 容器的挂载（`compose.yml`）：

```yaml
      - ./conf.d/ui:/etc/nginx/conf.d/ui:ro
      - /var/www/ui.campuslink.vip:/var/www/ui.campuslink.vip:ro
```

`nginx.conf` 的 `http` 块里要有这一行（该文件不写 `conf.d/*.conf`）：

```nginx
    include /etc/nginx/conf.d/ui;
```

## 首次部署（已完成，此处留档）

```sh
# 1) 上传产物
tar -czf ui-dist.tar.gz -C dist .
scp ui-dist.tar.gz vps:/tmp/
ssh vps 'sudo mkdir -p /var/www/ui.campuslink.vip && sudo tar -xzf /tmp/ui-dist.tar.gz -C /var/www/ui.campuslink.vip && sudo chown -R root:root /var/www/ui.campuslink.vip && sudo chmod -R a+rX /var/www/ui.campuslink.vip'

# 2) 放 server 块（先只留 80 那一段），加 include 与挂载，重建容器
sudo cp deploy/nginx/ui.campuslink.vip.conf /opt/nginx-docker/conf.d/ui
sudo docker compose -f /opt/nginx-docker/compose.yml up -d

# 3) 签证书（复用既有 ACME 账户；--deploy-hook 让续期后自动热加载容器）
sudo certbot certonly --webroot -w /var/www/letsencrypt-webroot -d ui.campuslink.vip \
  --account 59652c3919ced2799943c7c48a92fcfb \
  --non-interactive --agree-tos --key-type ecdsa \
  --deploy-hook "docker exec nginx nginx -s reload"
```

证书签下来之后，把 conf 里 443 那一段补上，再 `sudo docker exec nginx nginx -s reload`。
仓库里的 `ui.campuslink.vip.conf` 已经是补好的完整版本，直接覆盖即可。

## 日常更新

```sh
npm run deploy:vps      # 构建 → 打包上传 → 原子替换站点目录 → 公网自检
```

脚本做三件事：本地 `npm run build`、把 `dist/` 传到服务器并解包到
`/var/www/ui.campuslink.vip.new`、用两次 `mv` 替换旧目录（旧目录保留为
`.old`，成功后删除）。替换前后都用 curl 检查 `/`、`/origin/`、`/component/`、
`/component.md` 的状态码。

## 改配置时

```sh
# 改 deploy/nginx/ui.campuslink.vip.conf，然后
scp deploy/nginx/ui.campuslink.vip.conf vps:/tmp/
ssh vps 'sudo cp /tmp/ui.campuslink.vip.conf /opt/nginx-docker/conf.d/ui && sudo docker exec nginx nginx -t && sudo docker exec nginx nginx -s reload'
```

先 `nginx -t` 再 reload；配置写错时容器会在重启后进入 restart 循环，
其它站点也会一起挂掉（本项目第一次部署就踩过一次：heredoc 传输把两行注释
和 `server {` 挤成一行，导致 `listen` 出现在 http 上下文）。

干跑校验（不动线上容器，适合改动较大时）：

```sh
ssh vps 'sudo docker run --rm --network campuslink_campusnet \
  -v /opt/nginx-docker/nginx.conf:/etc/nginx/nginx.conf:ro \
  -v /opt/nginx-docker/conf.d/campuslink:/etc/nginx/conf.d/campuslink:ro \
  -v /opt/nginx-docker/conf.d/default.conf:/etc/nginx/conf.d/default.conf:ro \
  -v /opt/nginx-docker/conf.d/txt-tran:/etc/nginx/conf.d/txt-tran:ro \
  -v /opt/nginx-docker/conf.d/join:/etc/nginx/conf.d/join:ro \
  -v /opt/nginx-docker/conf.d/ui:/etc/nginx/conf.d/ui:ro \
  -v /etc/letsencrypt:/etc/letsencrypt:ro \
  -v /var/www/txt-tran:/var/www/txt-tran:ro \
  -v /var/www/letsencrypt-webroot:/var/www/letsencrypt-webroot:ro \
  -v /var/www/ui.campuslink.vip:/var/www/ui.campuslink.vip:ro \
  nginx:stable nginx -t'
```

`--network campuslink_campusnet` 不能省：同机的 `campuslink` 站点在配置里引用了
容器名做上游，网络不对会报 `host not found in upstream`。

## 回滚

```sh
# 站点内容
ssh vps 'sudo rm -rf /var/www/ui.campuslink.vip && sudo mv /var/www/ui.campuslink.vip.old /var/www/ui.campuslink.vip'

# nginx 配置（部署时留下的备份）
ssh vps 'sudo ls /opt/nginx-docker/nginx.conf.bak-* /opt/nginx-docker/compose.yml.bak-*'
ssh vps 'sudo cp /opt/nginx-docker/nginx.conf.bak-<时间戳> /opt/nginx-docker/nginx.conf && sudo docker compose -f /opt/nginx-docker/compose.yml up -d'
```

## 已知的坑

- **heredoc 不要用管道喂给 `bash -s`**：脚本从 stdin 读入时，heredoc 的开头几行会被
  吞掉或挤成一行，写出来的配置文件就是坏的。改成 `scp` 传文件、`bash /tmp/x.sh` 执行。
- **`docker compose up -d` 会重建容器**：其它站点会中断几秒，改动前先备份配置。
- **其它站点的续期钩子（已修）**：`qr.campuslink.vip` 原来写的是 `systemctl reload nginx`，
  但宿主机没有系统 nginx；`join` 与 `campuslink` 没有钩子。续期后容器不热加载的话会继续用旧证书，
  直到容器重启。现在四个证书（含本站）统一为 `renew_hook = docker exec nginx nginx -s reload`，
  续期配置的备份在 `/etc/letsencrypt/renewal.bak-<时间戳>`。
- **certbot 定时器**：`certbot.timer`（systemd）与 `/etc/cron.d/certbot` 同时存在，都是幂等的，不用动。
