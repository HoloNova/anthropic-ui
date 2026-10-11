// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import economicFuturesStyles from "../styles/EconomicFutures.classes.js";
import {
  getStableViewportHeight,
  subscribeViewportHeight,
  TECHNICAL_REPORT_URL,
  EXTERNAL_LINK_PROPS,
} from "./viewport.jsx";
import { MarkerFilters, SectionLaborShare } from "./SectionLaborShare.jsx";
import { Hero } from "./SectionHero.jsx";
import { SectionProse } from "./SectionProse.jsx";
import { DropCap, PullQuote } from "./DropCap.jsx";
import { ScrollProgress } from "./ScrollProgress.jsx";
import { SectionTaskBundle } from "./SectionTaskBundle.jsx";
import { SectionThreeFutures } from "./SectionThreeFutures.jsx";
import { SectionQuiz } from "./SectionQuiz.jsx";
import { SectionBeliefs } from "./SectionBeliefs.jsx";
import { SectionScenarioSquares } from "./SectionScenarioSquares.jsx";
import { SectionReallocation } from "./SectionReallocation.jsx";
import { SectionUnemployment } from "./SectionUnemployment.jsx";
import { SectionWages } from "./SectionWages.jsx";
import { SectionWaterfall } from "./SectionWaterfall.jsx";
/* 页面入口。只组合恢复的各章节，共享自定义情景与问卷答案。 */
function EconomicFutures({ survey }) {
  let [userScenario, setUserScenario] = React.useState(null),
    [answers, setAnswers] = React.useState(null),
    pageRef = React.useRef(null);
  React.useEffect(() => {
    let e = pageRef.current;
    if (!e) return;
    let t = (t) => e.style.setProperty("--stage-h", `${t}px`);
    t(getStableViewportHeight());
    return subscribeViewportHeight(t);
  }, [pageRef]);
  return (
    <div
      ref={pageRef}
      className={economicFuturesStyles.page}
      data-theme={"ivory"}
    >
      <MarkerFilters />
      <Hero />
      <SectionProse opening={true} reveal={true}>
        <p>
          <DropCap letter={"W"} />
          {
            "e study how AI is reshaping the economy because we’re committed to ensuring that this transition is beneficial for society, including workers. By providing better visibility into our possible economic future,"
          }{" "}
          <a
            href={
              "https://www-cdn.anthropic.com/files/4zrzovbb/website/9ea607a5dd67c168093829b701f3a0a6d21156d5.pdf"
            }
            target={"_blank"}
            rel={"noopener noreferrer"}
          >
            {"we can take steps"}
          </a>{" "}
          {"to make sure that everyone benefits from it."}
        </p>
        <p>
          {"While our"}{" "}
          <a
            href={"https://www.anthropic.com/economic-index"}
            target={"_blank"}
            rel={"noopener noreferrer"}
          >
            {"Economic Index"}
          </a>{" "}
          {
            "measures how AI is being used across the economy right now, this scenario explorer is about looking ahead. Based on our technical report,"
          }{" "}
          <a href={TECHNICAL_REPORT_URL} {...EXTERNAL_LINK_PROPS}>
            <cite>{"Economic Scenarios for Transformative AI"}</cite>
          </a>{" "}
          {
            "(Korinek et al., 2026), this explorer gives you a chance to find out what the economy might look like as AI continues to get more capable."
          }
        </p>
        <p>
          {
            "In scenarios ranging from business as usual to an economy where AI increases growth to about twice the normal rate, unemployment stays within the historical range and wages remain flat or rise depending on the industry. But in scenarios where growth is faster than anything in economic history, there are adverse impacts on wages and job prospects for knowledge workers. In those scenarios, society is far wealthier, so the challenge is making sure that the gains are broadly shared."
          }
        </p>
        <p>
          {
            "As you scroll down, you’ll see an overview of how AI affects the economy. Then, you can plug in your expectations for how capable AI will be, and how extensively it will be used across the economy in the future. The model will show you what the economy in 2030 might look like if your predictions come true—and how your predictions compare to others."
          }
        </p>
      </SectionProse>
      <ScrollProgress>
        <SectionTaskBundle />
      </ScrollProgress>
      <SectionProse>
        <p>
          {
            "The answer depends on how AI affects all the tasks that make up the economy, the new tasks it creates, and how fast AI takes on this work. Will AI lead to more task augmentation or automation? How much more productive will it make us? How quickly will it be adopted by workers and companies? The answers to these questions have direct effects on GDP, the labor market, and the share of the pie taken home by workers."
          }
        </p>
      </SectionProse>
      <ScrollProgress>
        <SectionThreeFutures user={userScenario} />
      </ScrollProgress>
      <SectionQuiz
        onComplete={(e, t) => {
          setUserScenario(e);
          setAnswers(t);
        }}
        onSkip={() => {
          setUserScenario(null);
          setAnswers(null);
        }}
      />
      <SectionBeliefs
        answers={answers}
        survey={survey}
        className={economicFuturesStyles.deferrable}
      />
      <SectionProse flushBottom={true}>
        <h3>
          {
            "You predicted one possible future for the economy. Here’s what that future could look like."
          }
        </h3>
      </SectionProse>
      <SectionScenarioSquares
        user={userScenario}
        flushTop={true}
        className={economicFuturesStyles.deferrable}
      />
      <SectionProse beforeHeading={true}>
        <p>
          {
            "But growth isn’t the only economic dynamic we care about. What would these potential futures mean for how much of this growth workers receive in their paychecks, or how many people have to find new jobs?"
          }
        </p>
        <p>
          {
            "This model isn’t a complete map of reality, but it shows us some interesting findings. The country’s GDP will grow, but a larger share of that prosperity might go to the resources and technology used to create more wealth (capital) compared to workers, even if society as a whole is much wealthier."
          }
        </p>
        <p>
          {
            "And in most scenarios, job reallocation and unemployment both stay within ranges history has seen before, with one exception. In the extreme scenario, if we see recursive self-improvement and rapid adoption, unemployment could spike to historic levels."
          }
        </p>
      </SectionProse>
      <SectionReallocation
        user={userScenario}
        flushTop={true}
        className={economicFuturesStyles.deferrable}
      />
      <SectionProse>
        <p>
          {
            "Switching to a new occupation is difficult for a few reasons: workers may not want to change occupations. They may need to learn new skills. And even when they do, it’s not easy to get a new job. In the extreme scenario, as large swathes of knowledge work are automated more quickly, affected workers may be unemployed for a prolonged period."
          }
        </p>
      </SectionProse>
      <SectionUnemployment user={userScenario} headless={true} />
      <SectionWages
        user={userScenario}
        className={economicFuturesStyles.deferrable}
      />
      <SectionLaborShare
        user={userScenario}
        className={economicFuturesStyles.deferrable}
      />
      <SectionProse flushBottom={true}>
        <PullQuote>{"The future is not predetermined."}</PullQuote>
        <p>
          {
            "Ultimately, what the economy looks like in 2030 depends on many factors, like what AI can do, and how companies and workers choose to adopt it. It also depends on how the financial benefit of this technology is shared."
          }
        </p>
        <p>
          {
            "Like any economic model, this one has limits. For example, we did not include scenarios where humanity develops hyper-capable robots. The model draws on our research and external review, and we’ll keep adding to it as the evidence develops."
          }
        </p>
        <p>
          {"This model, alongside our full research portfolio, will inform"}{" "}
          <a
            href={"https://www.anthropic.com/economic-futures"}
            target={"_blank"}
            rel={"noopener noreferrer"}
          >
            {"the research Anthropic funds"}
          </a>
          {
            " to identify effective interventions for labor market disruptions. It’ll also inform the"
          }{" "}
          <a
            href={
              "https://www-cdn.anthropic.com/files/4zrzovbb/website/9ea607a5dd67c168093829b701f3a0a6d21156d5.pdf"
            }
            target={"_blank"}
            rel={"noopener noreferrer"}
          >
            {"policy ideas we propose"}
          </a>
          {
            ", with the goal of ensuring that the economic benefits of AI are broadly shared across society, both in the US and around the world."
          }
        </p>
      </SectionProse>
      <SectionWaterfall />
      <SectionProse flushTop={true} closing={true}>
        <p className={economicFuturesStyles["endnote-head"]}>
          <span className={economicFuturesStyles["endnote-head-lead"]}>
            {"Disclaimer and thanks to reviewers"}
          </span>
          <br />
          {"v1.0 of the Econ Scenario Explorer, September 2026"}
        </p>
        <p>
          {
            "The economic scenario explorer is currently Version 1.0. Like every model, it is a stark simplification of a complex reality: it isolates a few key forces and omits many others that may become relevant and important in the coming years. For example, it leaves out policy responses, business cycles, potential aggregate demand or financial market disruptions, and possible catastrophic risks. The scenario explorer is a work in progress, and we expect it to evolve both as we invest more time and as economic research itself develops."
          }
        </p>
        <p>
          {
            "We are grateful to the economists who read an early draft of the technical report that lays out the framework behind the explorer,"
          }{" "}
          <a href={TECHNICAL_REPORT_URL} {...EXTERNAL_LINK_PROPS}>
            <cite>{"Economic Scenarios for Transformative AI"}</cite>
          </a>
          {
            ", and gave us detailed comments: Daron Acemoglu, Lukas Althoff, David Autor, Tom Cunningham, Lukas Freund, Joe Hazell, Ben Jones, Pete Klenow, Danial Lashkari, Kurt Mitman, Ben Moll, Emi Nakamura, Pascual Restrepo, David Romer, Jón Steinsson, Chris Tonetti, Ludo Visschers, and David Wiczer. Their feedback was generous and candid, and it has already improved our model. Two examples: several reviewers noted that advances in AI may raise the returns to capital, so that more of the gains flow to the owners of capital; and several noted that the wages of workers in the occupations AI affects most may diverge from those in occupations it barely affects. Both channels are now part of the scenarios. External reviewers were not asked to endorse our conclusions, and any remaining errors are ours."
          }
        </p>
        <p>
          {
            "Other criticisms are still open, and we plan to address many of them in future versions. Reviewers pointed out that the model does not follow individual workers, so it can only paint a very coarse picture of the costs of job displacement. Some questioned whether occupations exposed to AI will shrink at all rather than grow. Some felt the most extreme scenario is better read as a thought experiment than a scenario, while others felt the most modest one understates what is already visible in the data. Several asked us to be clearer that the model does not include the aggregate demand effects driven by the data center buildout. And more than one reviewer argued that we may be underestimating how much AI could accelerate technological progress itself. We agree that many of these are limitations of the current model. The scenario explorer should be viewed as a tool for thinking about what different technological developments would imply for the economy—actual outcomes may differ materially."
          }
        </p>
        <p>
          {
            "Anton Korinek, Chad Jones, Szymon Sacher, Tess Cotter, and Peter McCrory developed the economic model and co-authored the companion technical report. Santi Ruiz wrote this piece with them, with editorial support from Sarah Pollack and Adam Farina. Kelsey Nanan designed and built the interactive experience, with visual design and art direction by Nikki Makagiansar and Monika Tuchowska; Kyle Turman and Szymon Sacher built the scenario explorer and led the translation of the model into interactive form; Fayaz Ashraf and Ryan Heller contributed engineering, and Kim Withee and Maria Gonzalez supported production. Szymon Sacher and Tess Cotter designed and fielded the accompanying surveys with Morning Consult, with support from Ben Fowler. Peter McCrory, Anton Korinek, and Charles Yang coordinated the project, and Jack Clark provided direction throughout. Miriam Chaum, Jack Clark, Saffron Huang, Maxim Massenkoff, and Peter McCrory helped originate this effort. Jim Baker, Shan Carter, Johannes Hermle, Zoë Hitzig, and Eva Lyubich provided feedback."
          }
        </p>
      </SectionProse>
    </div>
  );
}
export { EconomicFutures };
