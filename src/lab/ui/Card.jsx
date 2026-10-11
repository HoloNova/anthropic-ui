import * as React from "react";
import { ControlsPanel } from "./Controls.jsx";
import { ConceptText, InlineCode } from "./ConceptHint.jsx";
import { splitNoteCode } from "./note-code.mjs";

/* 画布与参数均在模块正文中，随页面正常滚动。 */

const NoteContent = React.memo(function NoteContent({ value }) {
  if (typeof value !== "string") return value;
  return splitNoteCode(value).map((part, index) => part.code
    ? <InlineCode key={index}>{part.text}</InlineCode>
    : <ConceptText key={index}>{part.text}</ConceptText>);
});

function NotesColumn({ title, items, warn }) {
  if (!items || !items.length) return null;
  return (
    <div className="lab-notes__col">
      <h4>{title}</h4>
      <ul>
        {items.map((item, index) => (
          <li key={index} data-warn={warn ? "true" : undefined}>
            <NoteContent value={typeof item === "string" || React.isValidElement(item) ? item : item.text} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Notes({ keys, dont }) {
  if (!keys && !dont) return null;
  return (
    <div className="lab-notes">
      <NotesColumn title="要点" items={keys} />
      <NotesColumn title="坑" items={dont} warn />
    </div>
  );
}

function Chip({ children, tone }) {
  return (
    <span className="lab-chip" data-tone={tone}>
      {children}
    </span>
  );
}

function DemoShell({ canvas, knobs, wide }) {
  return (
    <div className="lab-split" data-wide={wide ? "true" : undefined}>
      <div className="lab-demo-surface">{canvas}</div>
      {knobs ? <ControlsPanel>{knobs}</ControlsPanel> : null}
    </div>
  );
}

function Card({ id, index, title, tags, summary, demo, notes, footer }) {
  return (
    <article className="lab-card" id={id}>
      <header className="lab-card__head">
        <span className="lab-card__idx">{index}</span>
        <h3 className="lab-card__title"><ConceptText>{title}</ConceptText></h3>
        {tags && tags.length ? (
          <div className="lab-card__tags">
            {tags.map((tag) =>
              typeof tag === "string" ? (
                <Chip key={tag}>{tag}</Chip>
              ) : (
                <Chip key={tag.label} tone={tag.tone}>
                  {tag.label}
                </Chip>
              ),
            )}
          </div>
        ) : null}
      </header>
      {summary ? <p className="lab-card__summary"><ConceptText>{summary}</ConceptText></p> : null}
      {demo ? <div className="lab-card__body">{demo}</div> : null}
      {notes ? (
        <details className="lab-explanation">
          <summary>原理与注意事项</summary>
          <Notes {...notes} />
        </details>
      ) : null}
      {footer ? <div className="lab-card__foot">{footer}</div> : null}
    </article>
  );
}

export { Card, Notes, NotesColumn, Chip, DemoShell };
