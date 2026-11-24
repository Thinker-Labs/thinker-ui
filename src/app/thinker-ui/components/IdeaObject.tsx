"use client";
import { useId, useState } from "react";
import s from "./idea.module.css";
/** A live, editable-by-props artifact. The reverse explains its data. */
export function IdeaObject({
  title,
  tags,
  progress,
}: {
  title: string;
  tags: string[];
  progress: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const id = useId();
  const percent = Math.max(0, Math.min(100, progress));
  return (
    <div
      className={`${s.object} ${flipped ? s.flipped : ""}`}
      onPointerMove={(e) => {
        if (e.pointerType === "touch") return;
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty(
          "--rx",
          `${((e.clientY - r.top) / r.height) * 8 - 4}deg`,
        );
        e.currentTarget.style.setProperty(
          "--ry",
          `${((e.clientX - r.left) / r.width) * -10 + 5}deg`,
        );
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.setProperty("--rx", "0deg");
        e.currentTarget.style.setProperty("--ry", "0deg");
      }}
    >
      <div className={s.shadow} aria-hidden="true" />
      <div className={s.paper}>
        <div className={s.paperEdge} aria-hidden="true" />
        <div className={s.top}>
          <span>From a thought</span>
          <span>{percent}% considered</span>
        </div>
        <div id={id} className={s.content}>
          {flipped ? (
            <>
              <p className={s.reverseTitle}>Nothing up our sleeve.</p>
              <dl>
                <div>
                  <dt>The words</dt>
                  <dd>Passed in as the title prop</dd>
                </div>
                <div>
                  <dt>The interests</dt>
                  <dd>
                    {tags.length ? tags.join(", ") : "Room for something new"}
                  </dd>
                </div>
                <div>
                  <dt>The progress</dt>
                  <dd>{percent}% from checked steps</dd>
                </div>
              </dl>
              <p className={s.local}>
                Local state. No generated image or network request.
              </p>
            </>
          ) : (
            <>
              <h3 tabIndex={0}>{title || "Room for a good idea."}</h3>
              <div className={s.sculpture} aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              <div className={s.tags}>
                {tags.length ? (
                  tags.map((t) => <span key={t}>{t}</span>)
                ) : (
                  <span>Still discovering</span>
                )}
              </div>
            </>
          )}
        </div>
        <button
          type="button"
          aria-expanded={flipped}
          aria-controls={id}
          onClick={() => setFlipped(!flipped)}
        >
          {flipped ? "Back to the thought" : "Turn it over"}
          <span aria-hidden="true">↻</span>
        </button>
      </div>
    </div>
  );
}
