import * as React from "react";

/* 章（Part）：图鉴的七个层次，每章一个标题 + 一段导语 + 若干元素卡。 */

function Part({ id, no, title, lede, children }) {
  return (
    <section className="lab-part" id={id}>
      <header className="lab-part__head">
        <span className="lab-part__no">{no}</span>
        <h2 className="lab-part__title">{title}</h2>
      </header>
      {lede ? <p className="lab-part__lede">{lede}</p> : null}
      {children}
    </section>
  );
}

export { Part };
