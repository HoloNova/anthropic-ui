// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import {
  sw,
  sh,
  sb,
  sW,
  sm,
  sp,
  sM,
  sk,
  sv,
  sj,
  sS,
  sN,
  sA,
  sT,
  sL,
} from "./model-metrics.jsx";
import {
  o0,
  o2,
  o1,
  o4,
  o5,
  o6,
  o3,
  o8,
  o7,
  o9,
  re,
  rt,
  ra,
  rl,
  rs,
  ro,
  rc,
  ri,
  rn,
  rd,
  rr,
  rh,
  ru,
  rp,
  rm,
} from "./outcome-specs.jsx";
import { eA } from "./scenario-presets.jsx";
import { ed } from "./scenario-inputs-2.jsx";
let rf = [
  {
    id: "gdp",
    title: "The size of the economy",
    unit: "US GDP, trillions of 2025 dollars",
    tab: "growth",
    hero: true,
    height: 260,
    build: ({ inputs, scenario }) => {
      let a,
        s = sw(inputs, sh),
        l = sb(inputs, scenario),
        o = 2 + s.actual[s.actual.length - 1].v,
        r = (l.ai[l.ai.length - 1].v / l.base[l.base.length - 1].v - 1) * 100,
        n = o0(l.base),
        i = o0(l.ai),
        d = o0(l.potential),
        c = n[n.length - 1].v,
        u = i[i.length - 1].v,
        h = d[d.length - 1].v - u;
      return {
        series: [
          {
            id: "baseline",
            label: "Without AI",
            color: "var(--chart-refline)",
            points: n,
            dash: true,
            lineLabel: "Without AI",
            lineLabelBelow: true,
            fillTo: "ai",
            fillColor: "var(--chart-accent)",
          },
          {
            id: "ai",
            label: "With AI",
            color: "var(--chart-accent)",
            points: i,
            endLabel: true,
          },
        ],
        description: [
          {
            text: "AI adds growth two ways: doing ordinary work more cheaply, and making new ideas cheaper to find. The gain is capability times saving times use, so it is only large when all three are. Here the economy reaches ",
          },
          {
            text: `about $${u.toFixed(1)} trillion by 2030 instead of $${c.toFixed(1)} trillion`,
            emph: true,
          },
          {
            text: `, ${r.toFixed(0)}% larger than it would have been without AI: `,
          },
          {
            text:
              ((a = s.avg),
              o2.find(([e]) => a < e)?.[1] ?? o2[o2.length - 1][1]),
            emph: true,
          },
          {
            text: ". At this pace the economy doubles about every ",
          },
          {
            text: `${sW(o)} years`,
            emph: true,
          },
          {
            text: ` instead of ${sW(2)}.`,
          },
        ],
        takeaway: [
          {
            text: "The gain is capability times saving times use, so it is only large when all three are. Here the economy is ",
          },
          {
            text: `${r.toFixed(0)}% larger by 2030`,
            emph: true,
          },
          {
            text: ` than without AI, doubling every ${sW(o)} years instead of ${sW(2)}.`,
          },
          ...(h >= 0.5
            ? [
                {
                  text: ` People still searching are not producing: that costs about $${h.toFixed(+(h < 10))} trillion of it here.`,
                },
              ]
            : []),
        ],
        chart: {
          guides: o1(),
          includeZero: false,
          yFormat: (e) => `$${e.toFixed(0)}T`,
          yFootroom: 0.06,
        },
      };
    },
  },
  {
    id: "taskflow",
    title: "How much of the work runs through AI",
    unit: "% of all tasks",
    tab: "growth",
    wide: true,
    height: 200,
    build: ({ inputs }) => {
      let t = (t) => eA(inputs.labor.phi, t),
        a = o4(inputs),
        s = o5.map((a) => ({
          t: a,
          v: o6(inputs, a) * t(a) * 100,
        })),
        l = Number(o3(100 * o6(inputs, 2030))),
        o = Number(o3(o6(inputs, 2030) * t(2030) * 100)),
        r = Number(o3(l - o)),
        n = Number(o3(100 - l));
      return {
        series: [
          {
            id: "touched",
            label: "Runs through AI",
            color: "var(--chart-accent)",
            points: a,
            fillTo: "automated",
            endLabel: true,
            endLabelUnit: "%",
          },
          {
            id: "automated",
            label: "AI alone",
            color: "var(--chart-ink)",
            secondary: true,
            points: s,
            lineLabel: "AI alone",
            lineLabelUnit: "%",
            lineLabelBelow: true,
          },
        ],
        description: [
          {
            text: "Follow the tasks. By 2030, ",
          },
          {
            text: `about ${o3(l)}% of all work runs through AI`,
            emph: true,
          },
          {
            text: `: ${o3(r)} points of it done by people working with AI, ${o3(o)} points by AI alone, with no one on the task. The other ${o3(n)}% stays in human hands. `,
          },
          {
            text: "History says automation also creates work that does not exist yet; the model carries that as its reinstatement dial, and this chart cannot draw the slice.",
          },
        ],
        takeaway: [
          {
            text: "Capability times adoption sets the top line; autonomy sets how much of it AI does alone. The ribbon between is people working with AI: ",
          },
          {
            text: `${o3(r)} points of the ${o3(l)}% by 2030`,
            emph: true,
          },
          {
            text: `, ${o3(o)} with no one on the task.`,
          },
        ],
        chart: {
          yFormat: o3,
          guides: o8(),
        },
      };
    },
  },
  {
    id: "after2030",
    title: "GDP growth per year",
    unit: "% a year",
    tab: "growth",
    height: 200,
    build: ({ inputs, scenario }) => {
      let a = sw(inputs, sh),
        s = (e, t) => e.find((e) => e.t === t).v,
        l = s(a.production, 2030),
        o = s(a.research, 2030),
        r = l + o,
        n = 2 + s(a.actual, 2030),
        i = 2 + s(a.total, 2030) - n,
        d = sw(inputs, sm),
        c = s(d.production, 2035),
        u = 2 + s(d.actual, 2035),
        h = c < l,
        m = sb(inputs, scenario),
        p = (m.ai[m.ai.length - 1].v / 100) * sp,
        f = (m.base[m.base.length - 1].v / 100) * sp,
        g = (p / f - 1) * 100,
        x = g < 10 ? g.toFixed(1) : g.toFixed(0),
        _ =
          g >= 0.5
            ? [
                {
                  text: " Five years of that adds up: by 2030 the economy is ",
                },
                {
                  text: `$${p.toFixed(1)} trillion instead of $${f.toFixed(1)} trillion, ${x}% larger`,
                  emph: true,
                },
                {
                  text: " than it would have been without AI. The rest of this report measures 2030 against that same world without AI.",
                },
              ]
            : [
                {
                  text: " Five years of that adds up to an economy ",
                },
                {
                  text: "under half a percent larger",
                  emph: true,
                },
                {
                  text: " than it would have been without AI by 2030. The rest of this report measures 2030 against that same world without AI.",
                },
              ],
        y =
          o >= 0.05
            ? [
                {
                  text: ` Of that, +${o.toFixed(1)} points come from the research a bigger economy funds: small so far, and the part that keeps compounding.`,
                },
              ]
            : [
                {
                  text: " Nearly all of it comes from cheaper ordinary work; the ideas channel adds under a tenth of a point so far.",
                },
              ],
        w =
          i >= 0.3
            ? [
                {
                  text: ` The thin line is what growth would be if nobody were between jobs: the people the shift leaves searching hold it ${i.toFixed(1)} points lower in 2030.`,
                },
              ]
            : [],
        b = h
          ? [
              {
                text: " Cheaper work is a one-time boost, so once adoption is complete growth ",
              },
              {
                text: `eases back toward ${u.toFixed(1)}% by 2035`,
                emph: true,
              },
              {
                text: ".",
              },
            ]
          : [
              {
                text: " On these settings the gain on each task is still deepening after 2030, so growth ",
              },
              {
                text: `is still about ${u.toFixed(1)}% in 2035`,
                emph: true,
              },
              {
                text: ".",
              },
            ];
      return {
        series: [
          {
            id: "baseline",
            label: "Without AI",
            color: "var(--chart-refline)",
            points: a.actual.map((e) => ({
              t: e.t,
              v: 2,
            })),
            dash: true,
            lineLabel: "Without AI",
            lineLabelUnit: "%",
            lineLabelBelow: true,
          },
          ...(i >= 0.3
            ? [
                {
                  id: "potential",
                  label: "Nobody between jobs",
                  color: "var(--chart-ink)",
                  secondary: true,
                  points: o7(a.total),
                  lineLabel: "Nobody between jobs",
                  lineLabelUnit: "%",
                },
              ]
            : []),
          {
            id: "ai",
            label: "With AI",
            color: "var(--chart-accent)",
            points: o7(a.actual),
            endLabel: true,
            endLabelUnit: "%",
            endLabelCaption: "YoY growth",
            fillTo: "baseline",
          },
        ],
        description: [
          {
            text: "The economy has grown about 2.0% a year since the war. Here AI lifts that to ",
          },
          {
            text: `${n.toFixed(1)}% a year by 2030`,
            emph: true,
          },
          {
            text:
              r >= 0.05
                ? `, +${r.toFixed(1)} points on top of the old pace.`
                : ", a fraction of a point above the old pace.",
          },
          ...y,
          ...w,
          ...b,
          ..._,
        ],
        takeaway: [
          {
            text: "AI adds growth two ways: cheaper ordinary work, a one-time boost, and cheaper research, which compounds. Here growth reaches ",
          },
          {
            text: `${n.toFixed(1)}% a year by 2030`,
            emph: true,
          },
          {
            text: h
              ? `, then eases toward ${u.toFixed(1)}% as adoption completes.`
              : `, and is still about ${u.toFixed(1)}% in 2035.`,
          },
        ],
        chart: {
          xDomain: [2025, 2030],
          guides: o9(),
          yHeadroom: 0.3,
          yFootroom: 0.06,
        },
      };
    },
  },
  {
    id: "research",
    title: "Growth from faster research",
    unit: "points of growth a year added by faster research",
    tab: "growth",
    height: 200,
    build: ({ inputs }) => {
      let t = sw(inputs, sh).research,
        a = t.find((e) => 2030 === e.t).v,
        s = sw(inputs, sm).research.find((e) => 2035 === e.t).v,
        l = (e) => `+${e.toFixed(e < 0.095 ? 2 : 1)}`;
      return {
        series: [
          {
            id: "research",
            label: "From faster research",
            color: "var(--chart-accent)",
            points: t,
            endLabel: true,
            endLabelText: l(a),
          },
        ],
        description: [
          {
            text: "A bigger economy funds more research, and that adds ",
          },
          {
            text: `${l(a)} points of growth a year by 2030`,
            emph: true,
          },
          {
            text: `, and about ${l(s)} by 2035: small inside the window and larger every year after it, because ideas compound where cheaper work does not.`,
          },
        ],
        takeaway: [
          {
            text: "Cheaper work is a one-time lift; the research a larger economy pays for buys more ideas every year after. Small by 2030, this is the part that keeps growing: about ",
          },
          {
            text: `${l(s)} points a year by 2035`,
            emph: true,
          },
          {
            text: ".",
          },
        ],
        chart: {
          yFormat: (e) => `${e > 1e-9 ? "+" : ""}${re(e)}`,
          xDomain: [2025, 2030],
          guides: rt(),
        },
      };
    },
  },
  {
    id: "laborshare",
    title: "Workers’ share of every dollar",
    unit: "cents per dollar",
    tab: "labor",
    hero: true,
    height: 200,
    build: ({ inputs }) => {
      let t = sM(inputs),
        a = t[t.length - 1].v,
        s = ra - a,
        l = sk(inputs),
        o = sv(inputs),
        r = l[l.length - 1].v,
        n = o[o.length - 1].v,
        i =
          r < 0.5
            ? {
                text: "Pay ends up about where it would have been without AI, and output per worker too.",
              }
            : {
                text: `By 2030 output per worker is ${rl(n)}% higher than it would have been without AI and pay ${rl(r)}% higher; the difference is the pay for tasks handed fully to AI, which no longer arrives as anyone’s wages.`,
              };
      return {
        series: [
          {
            id: "today",
            label: "Today’s split",
            color: "var(--chart-refline)",
            points: t.map((e) => ({
              t: e.t,
              v: ra,
            })),
            dash: true,
            lineLabel: "Without AI",
            fillTo: "share",
            fillColor: "var(--chart-accent)",
          },
          {
            id: "share",
            label: "To workers",
            color: "var(--chart-accent)",
            points: t,
            endLabel: true,
          },
        ],
        description: [
          {
            text: `Of every dollar the economy produces, about ${Math.round(ra)} cents reach workers as pay today. `,
          },
          s < 1
            ? {
                text: "Here that split barely moves by 2030.",
                emph: true,
              }
            : {
                text: `Here it slips to ${Math.round(a)} cents by 2030.`,
                emph: true,
              },
          {
            text: " ",
          },
          i,
        ],
        takeaway: [
          {
            text: "Every task handed fully to AI stops arriving as a worker’s pay; new work created for people brings some back. ",
          },
          s < 1
            ? {
                text: `Here workers keep about ${Math.round(a)}\xa2`,
                emph: true,
              }
            : {
                text: `Here workers’ share slips from ${Math.round(ra)}\xa2 to ${Math.round(a)}\xa2`,
                emph: true,
              },
          {
            text:
              r >= 0.5
                ? ` of every dollar, with pay itself ${rl(r)}% higher than without AI.`
                : " of every dollar.",
          },
        ],
        chart: {
          includeZero: false,
          yInclude: [45, 62],
          guides: rs(),
          yFormat: (e) => `${e.toFixed(0)}\xa2`,
        },
      };
    },
  },
  {
    id: "wages",
    title: "Pay and output per worker",
    unit: "% above the path without AI",
    tab: "labor",
    height: 200,
    build: ({ inputs }) => {
      let t = sk(inputs),
        a = sv(inputs),
        s = sM(inputs),
        l = t[t.length - 1].v,
        o = a[a.length - 1].v,
        r = Math.round(100 * ed),
        n = Math.round(s[s.length - 1].v),
        i = r - n;
      return {
        series: [
          {
            id: "productivity",
            label: "Output per worker",
            color: "var(--chart-ink)",
            secondary: true,
            points: a,
            fillTo: "wage",
            fillColor: "var(--chart-accent)",
          },
          {
            id: "wage",
            label: "Pay",
            color: "var(--chart-accent)",
            points: t,
            endLabel: true,
            endLabelUnit: "%",
          },
        ],
        description: [
          {
            text: "When AI makes work cheaper, workers produce more per hour, and in this model pay rises with those gains. Work handed fully to AI no longer pays a wage, so output keeps growing while a smaller share of it reaches workers. ",
          },
          ...(i < 1
            ? [
                {
                  text: "Here pay keeps up",
                  emph: true,
                },
                {
                  text: `: workers still get about ${r} cents of every dollar`,
                },
              ]
            : i < 5
              ? [
                  {
                    text: "Here the economy grows faster than pay",
                    emph: true,
                  },
                  {
                    text: `, so workers’ share slips from ${r} to ${n} cents of every dollar`,
                  },
                ]
              : [
                  {
                    text: "Here output pulls far ahead of pay",
                    emph: true,
                  },
                  {
                    text: `, and workers’ share falls from ${r} to ${n} cents of every dollar`,
                  },
                ]),
          {
            text: ".",
          },
        ],
        takeaway: [
          {
            text: "Pay rises with what an hour of work produces (the thin line); the wedge between them is the pay for tasks AI now does alone, which stops reaching workers. Here ",
          },
          {
            text: `pay ends 2030 ${l.toFixed(0)}% above where it would have been without AI, output per worker ${o.toFixed(0)}% above`,
            emph: true,
          },
          {
            text: ".",
          },
        ],
        chart: {
          yFormat: (e) => `${e > 1e-9 ? "+" : ""}${re(e)}`,
          guides: ro(),
          gap:
            i < 1
              ? undefined
              : {
                  between: ["productivity", "wage"],
                  label: ["Tasks AI does alone"],
                },
        },
      };
    },
  },
  {
    id: "employment",
    title: "Jobs by occupation group",
    unit: "% change in each group’s employment since 2024",
    tab: "labor",
    height: 200,
    build: ({ inputs }) => {
      let t = sj(inputs),
        a = rc(t.exposed),
        s = rc(t.exposedTarget),
        l = rc(t.other),
        o = rc(sS(inputs)),
        r = rc(sN(inputs)),
        n = rc(sA(inputs)),
        i = a > -0.5,
        d = a - s;
      return {
        series: [
          {
            id: "zero",
            label: "Without AI",
            color: "var(--chart-refline)",
            points: t.exposed.map((e) => ({
              t: e.t,
              v: 0,
            })),
            dash: true,
            lineLabel: "Without AI",
            noHover: true,
          },
          {
            id: "other",
            label: "Everything else",
            color: "var(--chart-ink)",
            secondary: true,
            points: t.other,
            lineLabel: "Everything else",
            lineLabelUnit: "%",
          },
          {
            id: "target",
            label: "Where exposed work is heading",
            color: "var(--chart-accent)",
            secondary: true,
            dash: true,
            points: t.exposedTarget,
          },
          {
            id: "exposed",
            label: "Exposed occupations",
            color: "var(--chart-accent)",
            points: t.exposed,
            endLabel: true,
            endLabelUnit: "%",
            endLabelCaption: "exposed jobs",
            fillTo: "target",
          },
        ],
        description: [
          {
            text: `In this model AI reaches one kind of work, the exposed occupations (mostly cognitive work, ${t.exposedPer100} in 100 workers), and none of the rest. `,
          },
          i
            ? {
                text: "Here their employment barely moves by 2030",
                emph: true,
              }
            : {
                text: `Here they employ ${ri(a)}% fewer people in 2030 than in 2024`,
                emph: true,
              },
          {
            text: i
              ? ", and neither does anyone else’s."
              : `, while everything else employs ${ri(l)}% more: about ${rn(o)} in every 100 workers have to end up in a different kind of work than they would have. The dashed line is where the exposed occupations are being pushed to; ${d > 0.25 ? `in 2030 they are still ${rn(d)} points above it, so the shedding is not over. ` : "by 2030 they have all but caught up with it. "}In 2030 itself about ${rn(n)} in 100 workers are let go because of it and ${rn(r)} in 100 change groups.`,
          },
        ],
        takeaway: [
          {
            text: "AI’s reach falls on the exposed occupations, so jobs leave them and appear everywhere else. ",
          },
          i
            ? {
                text: "Here neither group moves much",
                emph: true,
              }
            : {
                text: `Exposed ${rd(a)}%, everything else ${rd(l)}% by 2030`,
                emph: true,
              },
          {
            text: i
              ? "."
              : `; ${rn(o)} in 100 workers change kinds of work, ${rn(n)} in 100 through a layoff in 2030 alone.`,
          },
        ],
        chart: {
          includeZero: true,
          yInclude: [-2, 2],
          yFormat: rd,
          guides: rr(),
          yHeadroom: 0.2,
          yFootroom: 0.08,
        },
      };
    },
  },
  {
    id: "unemployment",
    title: "The unemployment rate",
    unit: "% of the labor force",
    tab: "labor",
    height: 200,
    build: ({ inputs }) => {
      let t = sT(inputs),
        a = t.rate[t.rate.length - 1].v,
        s = t.ai[t.ai.length - 1].v,
        l = Math.floor(t.peak.t + 1e-9),
        o = s < 0.15,
        r = !o && l > 2030 && t.peak.v > 1.1 * s;
      return {
        series: [
          {
            id: "normal",
            label: "Normal",
            color: "var(--chart-refline)",
            points: t.rate.map((e) => ({
              t: e.t,
              v: t.normal,
            })),
            dash: true,
            lineLabel: "Normal",
            lineLabelUnit: "%",
            lineLabelBelow: true,
          },
          {
            id: "rate",
            label: "Unemployment rate",
            color: "var(--chart-accent)",
            points: t.rate,
            endLabel: true,
            endLabelUnit: "%",
            fillTo: "normal",
          },
        ],
        description: [
          {
            text: `Unemployment runs about ${rh(t.normal)}% in normal times, and everything the model adds to it is people between jobs because of the shift above. `,
          },
          o
            ? {
                text: "Here it does not move",
                emph: true,
              }
            : {
                text: `Here it is ${rh(a)}% in 2030, ${rh(s)} points above normal`,
                emph: true,
              },
          {
            text: o
              ? ": the shift is small enough to happen inside the usual coming and going."
              : `, about ${((e) => {
                  let t = (e / 100) * 170;
                  if (t >= 0.95)
                    return `${t.toFixed(+(t < 10))} million people`;
                  let a = 50 * Math.round(20 * t);
                  return a > 0 ? `${a},000 people` : "under 50,000 people";
                })(
                  s,
                )}${r ? `, and it is still rising when the chart stops: it peaks at ${rh(t.peak.v)} points above normal in ${l}` : ""}. The least settled numbers in the model: they turn on how open the way across is and how fast employers let people go, your last answer.`,
          },
        ],
        takeaway: [
          {
            text: "People the exposed occupations shed wait in the pool until something else hires them. ",
          },
          o
            ? {
                text: "Here the rate stays at normal",
                emph: true,
              }
            : {
                text: `Here it is ${rh(s)} points above normal in 2030${r ? `, ${rh(t.peak.v)} at its ${l} peak` : ""}`,
                emph: true,
              },
          {
            text: ". The least settled numbers in the model.",
          },
        ],
        chart: {
          includeZero: false,
          yInclude: [3, 5],
          guides: ru(),
          gap: o
            ? undefined
            : {
                between: ["normal", "rate"],
                label: [`AI adds ${rh(s)} pts`],
              },
          yHeadroom: 0.2,
        },
      };
    },
  },
  {
    id: "ugroups",
    title: "Unemployment rate by group",
    unit: "% of each group’s own workers",
    tab: "labor",
    height: 200,
    build: ({ inputs }) => {
      let t = sL(inputs),
        a = sT(inputs).ai,
        s = t.affected[t.affected.length - 1].v,
        l = t.other[t.other.length - 1].v,
        o = a[a.length - 1].v,
        r = s - t.normalAffected < 0.3;
      return {
        series: [
          {
            id: "normal",
            label: "Normal for exposed work",
            color: "var(--chart-refline)",
            points: t.affected.map((e) => ({
              t: e.t,
              v: t.normalAffected,
            })),
            dash: true,
            lineLabel: "Normal for exposed work",
            lineLabelUnit: "%",
            lineLabelBelow: true,
          },
          {
            id: "other",
            label: "Everything else",
            color: "var(--chart-ink)",
            secondary: true,
            points: t.other,
            lineLabel: "Everything else",
            lineLabelUnit: "%",
          },
          {
            id: "exposed",
            label: "Exposed work",
            color: "var(--chart-accent)",
            points: t.affected,
            endLabel: true,
            endLabelUnit: "%",
            fillTo: "normal",
          },
        ],
        description: [
          {
            text: `Each group against its own normal: about ${rp(t.normalAffected)}% of exposed workers are usually between jobs, about ${rp(t.normalOther)}% of everyone else. `,
          },
          r
            ? {
                text: "Here neither rate leaves its normal.",
                emph: true,
              }
            : {
                text: `Here unemployment among exposed workers reaches ${rp(s)}% by 2030 while everyone else’s falls to ${rp(l)}%`,
                emph: true,
              },
          {
            text: r
              ? ""
              : `: the people the exposed occupations shed queue for the other occupations’ openings, which is also what pulls the other group’s rate down. Nationally that nets to +${rp(o)} points.`,
          },
        ],
        takeaway: [
          {
            text: "AI’s reach falls on the exposed occupations; the displaced go looking in the rest, where the new demand is. ",
          },
          r
            ? {
                text: "Here both rates stay at their normals",
                emph: true,
              }
            : {
                text: `Exposed work ${rp(s)}%, everything else ${rp(l)}%`,
                emph: true,
              },
          {
            text: r ? "." : `, +${rp(o)} points nationally.`,
          },
        ],
        chart: {
          includeZero: false,
          yInclude: [1, 8],
          guides: rm(),
        },
      };
    },
  },
];
export { rf };
