"use client";
import { useEffect, useId, useRef, useState } from "react";
import s from "./patterns.module.css";
export function ChatComposer({
  value,
  onChange,
  onSubmit,
  busy = false,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  busy?: boolean;
}) {
  const id = useId();
  return (
    <form
      className={s.composer}
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim() && !busy) onSubmit(value.trim());
      }}
    >
      <label htmlFor={id}>A thought worth following.</label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Where should we start?"
        maxLength={1000}
        disabled={busy}
      />
      <div>
        <span>{value.length} / 1000</span>
        <button type="submit" disabled={!value.trim() || busy}>
          {busy ? "Waiting…" : "Send thought"} <span aria-hidden="true">↗</span>
        </button>
      </div>
    </form>
  );
}
export function PlanSteps({
  items,
  value,
  onChange,
}: {
  items: { id: string; label: string; description: string }[];
  value: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <fieldset className={s.plan}>
      <legend>A plan you can follow</legend>
      {items.map((item, i) => (
        <label key={item.id}>
          <input
            type="checkbox"
            checked={value.includes(item.id)}
            onChange={() =>
              onChange(
                value.includes(item.id)
                  ? value.filter((v) => v !== item.id)
                  : [...value, item.id],
              )
            }
          />
          <span className={s.stepNumber} aria-hidden="true">
            {value.includes(item.id) ? "✓" : i + 1}
          </span>
          <span>
            <strong>{item.label}</strong>
            <small>{item.description}</small>
          </span>
        </label>
      ))}
      <p aria-live="polite">
        {value.length} of {items.length} steps complete
      </p>
    </fieldset>
  );
}
export function AgentState({
  state,
  message,
  onPause,
  onResume,
}: {
  state: "working" | "paused" | "ready";
  message: string;
  onPause: () => void;
  onResume: () => void;
}) {
  return (
    <div className={s.agent}>
      <div
        className={`${s.orb} ${state === "working" ? s.working : ""}`}
        aria-hidden="true"
      >
        <span />
        <span />
        <span />
      </div>
      <div role="status">
        <strong>
          {state === "working"
            ? "Finding the shape."
            : state === "paused"
              ? "Taking a breath."
              : "Ready when you are."}
        </strong>
        <p>{message}</p>
      </div>
      {state !== "ready" && (
        <button
          type="button"
          onClick={state === "working" ? onPause : onResume}
        >
          {state === "working" ? "Pause" : "Resume"}
        </button>
      )}
    </div>
  );
}
export function CheckReceipt({
  title,
  checks,
  onInspect,
}: {
  title: string;
  checks: { label: string; passed: boolean }[];
  onInspect: () => void;
}) {
  return (
    <div className={s.receipt}>
      <div className={s.receiptHeader}>
        <span aria-hidden="true">✓</span>
        <p>Check receipt</p>
      </div>
      <h3>{title}</h3>
      <ul>
        {checks.map((c) => (
          <li key={c.label}>
            <span aria-hidden="true">{c.passed ? "✓" : "○"}</span>
            {c.label}
            <small>{c.passed ? "Passed" : "Needs review"}</small>
          </li>
        ))}
      </ul>
      <button type="button" onClick={onInspect}>
        Inspect the details <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}
export function CommandPalette({
  items,
  onSelect,
}: {
  items: { id: string; label: string; hint: string }[];
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const id = useId();
  const filtered = items.filter((i) =>
    (i.label + " " + i.hint).toLowerCase().includes(query.toLowerCase()),
  );
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div className={s.palette}>
      <label htmlFor={id}>Find your next move</label>
      <input
        id={id}
        type="search"
        value={query}
        placeholder="Search actions…"
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && filtered.length) {
            e.preventDefault();
            refs.current[0]?.focus();
          }
        }}
      />
      <div className={s.commands}>
        {filtered.map((item, i) => (
          <button
            type="button"
            key={item.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            onClick={() => onSelect(item.id)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                refs.current[
                  (i + (e.key === "ArrowDown" ? 1 : filtered.length - 1)) %
                    filtered.length
                ]?.focus();
              }
            }}
          >
            <span>
              {item.label}
              <small>{item.hint}</small>
            </span>
            <span aria-hidden="true">↗</span>
          </button>
        ))}
        {!filtered.length && <p>No matching actions.</p>}
      </div>
    </div>
  );
}
export function FileDropzone({
  file,
  onChange,
  accept = ".txt,.md",
  maxBytes = 102400,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  maxBytes?: number;
}) {
  const id = useId();
  const [error, setError] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  function choose(next: File | undefined) {
    if (!next) return;
    if (next.size > maxBytes) {
      setError(`Choose a file under ${Math.round(maxBytes / 1024)} KB.`);
      return;
    }
    // The input accept hint is not validation. Support the same extension and
    // MIME forms for both the picker and drag/drop. Server checks remain needed.
    const types = accept
      .split(",")
      .map((v) => v.trim().toLowerCase())
      .filter(Boolean);
    const mime = next.type.toLowerCase();
    const allowed =
      !types.length ||
      types.some((type) =>
        type.startsWith(".")
          ? next.name.toLowerCase().endsWith(type)
          : type.endsWith("/*")
            ? mime.startsWith(type.slice(0, -1))
            : mime === type,
      );
    if (!allowed) {
      setError(`Choose one of these types: ${accept}`);
      return;
    }
    setError("");
    onChange(next);
  }
  return (
    <div className={s.file}>
      <div
        className={s.drop}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          choose(e.dataTransfer.files[0]);
        }}
      >
        <span className={s.fileIcon} aria-hidden="true">
          ↥
        </span>
        <label htmlFor={id}>
          {file ? file.name : "Bring a little context."}
        </label>
        <p>
          {file
            ? `${Math.round(file.size / 1024)} KB · Selected locally`
            : `${accept} · Up to ${Math.round(maxBytes / 1024)} KB`}
        </p>
        <input
          ref={ref}
          id={id}
          type="file"
          accept={accept}
          aria-describedby={`${id}-status`}
          onClick={(event) => {
            event.currentTarget.value = "";
          }}
          onChange={(e) => choose(e.target.files?.[0])}
        />
      </div>
      {file && (
        <button
          type="button"
          onClick={() => {
            setError("");
            onChange(null);
            if (ref.current) ref.current.value = "";
          }}
        >
          Remove file
        </button>
      )}
      <p role="status" id={`${id}-status`}>
        {error || "Selection only. No upload or file reading."}
      </p>
    </div>
  );
}
export function FocusTimer({
  seconds,
  onChange,
}: {
  seconds: number;
  onChange: (seconds: number) => void;
}) {
  const [running, setRunning] = useState(false);
  const end = useRef(0);
  const frame = useRef<ReturnType<typeof setInterval> | null>(null);
  function stop() {
    if (frame.current) clearInterval(frame.current);
    frame.current = null;
    setRunning(false);
  }
  // A short local timer. It must not be used as a background reminder.
  const tick = useRef(onChange);
  useEffect(() => {
    tick.current = onChange;
  }, [onChange]);
  function start() {
    if (seconds <= 0 || frame.current) return;
    end.current = Date.now() + seconds * 1000;
    setRunning(true);
    frame.current = setInterval(() => {
      const left = Math.max(0, Math.ceil((end.current - Date.now()) / 1000));
      tick.current(left);
      if (left === 0) stop();
    }, 250);
  }
  // The timer owns its cleanup, including route and preview changes.
  useTimerCleanup(frame);
  return (
    <div className={s.timer}>
      <p>A moment of focus</p>
      <output aria-label="Time remaining">
        <span>
          {Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0")}
          <i aria-hidden="true">:</i>
        </span>
        <span>{(seconds % 60).toString().padStart(2, "0")}</span>
      </output>
      <div>
        <button
          type="button"
          onClick={running ? stop : start}
          disabled={!seconds}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          onClick={() => {
            stop();
            onChange(60);
          }}
        >
          Reset
        </button>
      </div>
      <small>Local timer. Keep this tab open.</small>
      <span role="status" className={s.sr}>
        {seconds === 0 ? "Focus time finished." : ""}
      </span>
    </div>
  );
}
function useTimerCleanup(
  ref: React.RefObject<ReturnType<typeof setInterval> | null>,
) {
  useEffect(
    () => () => {
      if (ref.current) clearInterval(ref.current);
    },
    [ref],
  );
}
export function RevealCard({
  title,
  summary,
  children,
}: {
  title: string;
  summary: string;
  children: React.ReactNode;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <div className={`${s.reveal} ${open ? s.revealed : ""}`}>
      <div className={s.revealArt} aria-hidden="true">
        <i />
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
        {open ? "A little less" : "Look closer"}{" "}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <div id={id} hidden={!open} className={s.revealContent}>
        {children}
      </div>
    </div>
  );
}
