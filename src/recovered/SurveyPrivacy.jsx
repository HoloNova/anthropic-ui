// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
import * as React from "react";
import consentNoticeStyles from "../styles/ConsentNotice.classes.js";
let ORIGINAL_PRIVACY_NOTICE =
  "When you submit your survey, we collect the responses you provide, metadata about your participation (such as timestamps or device and connection information), and your country-level location. We don't collect your name or contact details, and your responses aren't linked to your account. We use responses to conduct research on public expectations about AI's economic impact, and we may publish and share aggregated or de-identified findings and responses from our research. See Anthropic's Privacy Policy for more information.";
function SurveyPrivacy({
  requireAck = false,
  onAckChange,
  collapsible = false,
  className,
}) {
  let [l, o] = React.useState(false),
    [r, n] = React.useState(false),
    i = React.useId(),
    [d, h] = ORIGINAL_PRIVACY_NOTICE.split("Anthropic's Privacy Policy"),
    m =
      undefined === h ? (
        ORIGINAL_PRIVACY_NOTICE
      ) : (
        <React.Fragment>
          {d}
          <a
            className={consentNoticeStyles.link}
            href={"/legal/privacy"}
            target={"_blank"}
            rel={"noopener noreferrer"}
          >
            {"Anthropic’s Privacy Policy"}
          </a>
          {h}
        </React.Fragment>
      ),
    p = <p className={consentNoticeStyles.copy}>{m}</p>;
  return (
    <div
      className={
        className
          ? `${consentNoticeStyles.notice} ${className}`
          : consentNoticeStyles.notice
      }
    >
      {collapsible ? (
        <div className={consentNoticeStyles.details} data-open={r}>
          <button
            type={"button"}
            className={consentNoticeStyles.summary}
            aria-expanded={r}
            aria-controls={`${i}-policy`}
            onClick={() => n((e) => !e)}
          >
            <span className={consentNoticeStyles.summaryLabel}>
              {"See our privacy policy"}
            </span>
            <svg
              className={consentNoticeStyles.chevron}
              width={"12"}
              height={"12"}
              viewBox={"0 0 12 12"}
              aria-hidden={true}
            >
              <path
                d={"M2.5 4.5 L6 8 L9.5 4.5"}
                fill={"none"}
                stroke={"currentColor"}
                strokeWidth={"1.5"}
                strokeLinecap={"round"}
                strokeLinejoin={"round"}
              />
            </svg>
          </button>
          <div id={`${i}-policy`} className={consentNoticeStyles.reveal}>
            <div className={consentNoticeStyles.revealInner}>{p}</div>
          </div>
        </div>
      ) : (
        p
      )}
      {requireAck && (
        <label className={consentNoticeStyles.ack} htmlFor={i}>
          <input
            id={i}
            type={"checkbox"}
            checked={l}
            onChange={(e) => {
              o(e.target.checked);
              onAckChange?.(e.target.checked);
            }}
          />
          <span>
            {"I understand and want my answers included in the research."}
          </span>
        </label>
      )}
    </div>
  );
}
let ox = (e) => Math.min(100, Math.max(0, Math.round(100 * e)));
export { ORIGINAL_PRIVACY_NOTICE, SurveyPrivacy, ox };
