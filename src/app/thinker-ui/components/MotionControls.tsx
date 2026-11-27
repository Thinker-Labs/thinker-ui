"use client";
import { useId, useState, type ReactNode } from "react";
import s from "./motion.module.css";
export type DeckItem = {
  id: string;
  title: string;
  description: string;
  label?: string;
};
/** Controlled selection. Buttons and arrow keys work without pointer gestures. */
export function ThoughtDeck({
  items,
  value,
  onChange,
}: {
  items: DeckItem[];
  value: string;
  onChange: (id: string) => void;
}) {
  const index = Math.max(
    0,
    items.findIndex((x) => x.id === value),
  );
  if (!items.length) return null;
  return (
    <div
      className={s.deck}
      role="group"
      aria-label="Thought deck"
      onKeyDown={(e) => {
        if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
          e.preventDefault();
          const target =
            items[
              e.key === "Home"
                ? 0
                : e.key === "End"
                  ? items.length - 1
                  : (index + (e.key === "ArrowRight" ? 1 : -1) + items.length) %
                    items.length
            ].id;
          onChange(target);
          const group = e.currentTarget;
          requestAnimationFrame(() =>
            group
              .querySelector<HTMLButtonElement>("button[aria-pressed=true]")
              ?.focus(),
          );
        }
      }}
    >
      <div className={s.stack}>
        {items.map((item, i) => (
          <button
            type="button"
            key={item.id}
            aria-label={item.title}
            aria-pressed={i === index}
            tabIndex={i === index ? 0 : -1}
            className={s.card}
            style={
              {
                "--offset": (i - index + items.length) % items.length,
              } as React.CSSProperties
            }
            onClick={() => onChange(item.id)}
          >
            <span>{item.label || `Thought ${i + 1}`}</span>
            <strong>{item.title}</strong>
            <span>{item.description}</span>
            <span className={s.cardNumber}>
              {String(i + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>
      <div className={s.deckControls}>
        <button
          type="button"
          aria-label="Previous thought"
          onClick={() =>
            onChange(items[(index - 1 + items.length) % items.length].id)
          }
        >
          ←
        </button>
        <span aria-live="polite">
          {index + 1} / {items.length}
        </span>
        <button
          type="button"
          aria-label="Next thought"
          onClick={() => onChange(items[(index + 1) % items.length].id)}
        >
          →
        </button>
      </div>
    </div>
  );
}
/** Native range comparison, no drag-only interaction. */
export function MaterialCompare({
  value,
  onChange,
  beforeLabel,
  afterLabel,
  before,
  after,
}: {
  value: number;
  onChange: (value: number) => void;
  beforeLabel: string;
  afterLabel: string;
  before: ReactNode;
  after: ReactNode;
}) {
  const id = useId();
  const percent = Math.min(100, Math.max(0, value));
  return (
    <div className={s.compare}>
      <div className={s.compareStage}>
        <div className={s.before}>{before}</div>
        <div
          className={s.after}
          style={{ clipPath: `inset(0 0 0 ${100 - percent}%)` }}
        >
          {after}
        </div>
        <span
          className={s.seam}
          style={
            { "--reveal-position": `${100 - percent}%` } as React.CSSProperties
          }
          aria-hidden="true"
        >
          <i>↔</i>
        </span>
      </div>
      <div className={s.compareLabels}>
        <span>{beforeLabel}</span>
        <span>{afterLabel}</span>
      </div>
      <label htmlFor={id}>
        Reveal {afterLabel}
        <output>{percent}%</output>
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={percent}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
/** Explicit expanded state, no hover dependency or background operation. */
export function DetailSurface({
  title,
  summary,
  children,
}: {
  title: string;
  summary: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className={`${s.detailSurface} ${open ? s.detailOpen : ""}`}>
      <div className={s.detailSculpture} aria-hidden="true">
        <i />
        <i />
      </div>
      <h3>{title}</h3>
      <p>{summary}</p>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
      >
        {open ? "Keep it simple" : "Find the detail"}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <div id={id} hidden={!open} className={s.detailBody}>
        {children}
      </div>
    </div>
  );
}
