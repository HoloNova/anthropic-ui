// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import sectionHeroStyles from "../styles/SectionHero.classes.js";
import { useIsVisible } from "./layout-hooks.jsx";
import { HeroChart } from "./HeroChart.jsx";
import { TECHNICAL_REPORT_URL, EXTERNAL_LINK_PROPS } from "./viewport.jsx";
import {
  ExternalArrow,
  EXPLORER_ANCHOR_ID,
  DownArrow,
} from "./SectionBeliefs.jsx";
function SectionHero({ className }) {
  let graphicRef = React.useRef(null),
    contentRef = React.useRef(null),
    [contentLeft, setContentLeft] = React.useState(null);
  React.useEffect(() => {
    let e = graphicRef.current,
      s = contentRef.current;
    if (!e || !s) return;
    let o = () => {
      let t = e.getBoundingClientRect(),
        a = s.getBoundingClientRect(),
        o =
          a.top < t.bottom - 8 && a.bottom > t.top + 8
            ? Math.round(a.left - t.left)
            : Math.round(t.width);
      setContentLeft((e) => (e === o ? e : o));
    };
    o();
    let r = new ResizeObserver(o);
    r.observe(e);
    r.observe(s);
    return () => r.disconnect();
  }, []);
  let heroRef = React.useRef(null),
    hintRef = React.useRef(null),
    hintVisible = useIsVisible(hintRef),
    scrollTo = (e) => {
      let t = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: e,
        behavior: t ? "instant" : "smooth",
      });
    },
    scrollPastHero = () => {
      let e = heroRef.current;
      scrollTo(
        e
          ? e.getBoundingClientRect().bottom + window.scrollY
          : window.scrollY + window.innerHeight,
      );
    };
  return (
    <section
      ref={heroRef}
      className={
        className
          ? `${sectionHeroStyles.hero} ${className}`
          : sectionHeroStyles.hero
      }
    >
      <div className={sectionHeroStyles.stage}>
        <div className={sectionHeroStyles.graphic} ref={graphicRef}>
          <HeroChart contentX={contentLeft} />
        </div>
        <div className={sectionHeroStyles.content} ref={contentRef}>
          <div className={sectionHeroStyles.copy}>
            <h1 className={sectionHeroStyles.headline}>
              {"What will our economic future look like?"}
            </h1>
            <p className={sectionHeroStyles.standfirst}>
              {
                "We don’t know yet how AI will reshape the economy. Will it lead to unprecedented growth? Widespread unemployment? Neither, or something else? How can we tell?"
              }
            </p>
            <p className={sectionHeroStyles.standfirst}>
              {
                "Anthropic’s Economics team built a model of how AI might affect jobs, growth, and unemployment in the US in coming years. Read about possible economic futures and make your own predictions about AI capabilities to see the economy they imply."
              }
            </p>
          </div>
          <div className={sectionHeroStyles.actions}>
            <a
              className={sectionHeroStyles.btn}
              href={TECHNICAL_REPORT_URL}
              {...EXTERNAL_LINK_PROPS}
            >
              {"Read technical report"}
              <ExternalArrow />
            </a>
            <button
              type={"button"}
              className={sectionHeroStyles.btn}
              onClick={() => {
                let e = document.getElementById(EXPLORER_ANCHOR_ID);
                if (!e) return scrollPastHero();
                scrollTo(window.scrollY + e.getBoundingClientRect().top);
              }}
            >
              {"Jump to explorer"}
              <DownArrow />
            </button>
          </div>
        </div>
        <button
          type={"button"}
          className={sectionHeroStyles.scrollHint}
          ref={hintRef}
          data-still={hintVisible ? undefined : "true"}
          onClick={scrollPastHero}
        >
          {"Read blog"}
          <DownArrow />
        </button>
      </div>
    </section>
  );
}
function Hero({ className }) {
  return <SectionHero className={className} />;
}
export { SectionHero, Hero };
