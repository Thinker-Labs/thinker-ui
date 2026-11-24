"use client";
import { useId, useRef, useState } from "react";
import s from "./data.module.css";

export type ChoiceItem = { id: string; label: string; detail?: string };
/** Search and native selection buttons, deliberately not an imitation combobox. */
export function SearchChoices({
  items,
  value,
  onChange,
  label,
}: {
  items: ChoiceItem[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  const [query, setQuery] = useState("");
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const results = items.filter((item) =>
    (item.label + " " + (item.detail || ""))
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <section className={s.searchChoices}>
      <label htmlFor={id}>{label}</label>
      <div className={s.searchField}>
        <span aria-hidden="true">⌕</span>
        <input
          id={id}
          type="search"
          placeholder="Find a material"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              ref.current?.querySelector<HTMLButtonElement>("button")?.focus();
            }
          }}
        />
      </div>
      <p className={s.resultCount} role="status">
        {results.length} {results.length === 1 ? "match" : "matches"}
      </p>
      <div
        ref={ref}
        className={s.choiceList}
        onKeyDown={(e) => {
          const buttons = [...e.currentTarget.querySelectorAll("button")];
          const index = buttons.indexOf(
            document.activeElement as HTMLButtonElement,
          );
          let next = index;
          if (e.key === "ArrowDown")
            next = Math.min(buttons.length - 1, index + 1);
          else if (e.key === "ArrowUp") next = Math.max(0, index - 1);
          else if (e.key === "Home") next = 0;
          else if (e.key === "End") next = buttons.length - 1;
          else return;
          e.preventDefault();
          buttons[next]?.focus();
        }}
      >
        {results.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={value === item.id}
            onClick={() => onChange(item.id)}
          >
            <span
              className={s.swatch}
              data-material={item.id}
              aria-hidden="true"
            />
            <span>
              <strong>{item.label}</strong>
              {item.detail && <small>{item.detail}</small>}
            </span>
            <span className={s.choiceCheck} aria-hidden="true">
              {value === item.id ? "✓" : "+"}
            </span>
          </button>
        ))}
        {!results.length && (
          <p className={s.noResults}>No material found. Try another word.</p>
        )}
      </div>
    </section>
  );
}

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
function stamp(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function dateFrom(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(2000, 0, 1, 12);
  date.setFullYear(y, m - 1, d);
  return date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
    ? date
    : null;
}
/** Date-only local values. Arrow keys move days/weeks, Home/End move to week edges. */
export function MaterialCalendar({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  const initial = dateFrom(value);
  const [observedValue, setObservedValue] = useState(value);
  const [month, setMonth] = useState(
    new Date(initial?.getFullYear() ?? 2000, initial?.getMonth() ?? 0, 1, 12),
  );
  const [focused, setFocused] = useState(value);
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  if (observedValue !== value) {
    setObservedValue(value);
    if (initial) {
      setMonth(new Date(initial.getFullYear(), initial.getMonth(), 1, 12));
      setFocused(value);
    }
  }
  if (!initial)
    return (
      <section className={s.calendar} aria-label={label}>
        <p role="status">Provide a valid date in YYYY-MM-DD format.</p>
      </section>
    );
  const year = month.getFullYear(),
    m = month.getMonth();
  const count = new Date(year, m + 1, 0).getDate();
  const offset = (new Date(year, m, 1).getDay() + 6) % 7;
  const title = month.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
  function focusDate(date: Date) {
    const next = stamp(date);
    setMonth(new Date(date.getFullYear(), date.getMonth(), 1, 12));
    setFocused(next);
    requestAnimationFrame(() =>
      ref.current
        ?.querySelector<HTMLButtonElement>(`[data-date="${next}"]`)
        ?.focus(),
    );
  }
  function changeMonth(delta: number) {
    const date = new Date(year, m + delta, 1, 12);
    setMonth(date);
    setFocused(stamp(date));
  }
  return (
    <section className={s.calendar} aria-label={label}>
      <div className={s.calendarTop}>
        <div>
          <span>{label}</span>
          <h3 id={titleId} aria-live="polite">
            {title}
          </h3>
        </div>
        <div>
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => changeMonth(-1)}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => changeMonth(1)}
          >
            →
          </button>
        </div>
      </div>
      <div
        className={s.calendarGrid}
        ref={ref}
        role="group"
        aria-labelledby={titleId}
      >
        {dayNames.map((day) => (
          <span className={s.weekday} key={day} aria-hidden="true">
            {day}
          </span>
        ))}
        {Array.from({ length: offset }, (_, i) => (
          <span key={`blank-${i}`} aria-hidden="true" />
        ))}
        {Array.from({ length: count }, (_, i) => {
          const date = new Date(year, m, i + 1, 12);
          const iso = stamp(date);
          return (
            <button
              key={iso}
              type="button"
              data-date={iso}
              tabIndex={focused === iso ? 0 : -1}
              aria-pressed={value === iso}
              aria-label={date.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              onFocus={() => setFocused(iso)}
              onClick={() => onChange(iso)}
              onKeyDown={(e) => {
                let delta = 0;
                if (e.key === "ArrowRight") delta = 1;
                else if (e.key === "ArrowLeft") delta = -1;
                else if (e.key === "ArrowDown") delta = 7;
                else if (e.key === "ArrowUp") delta = -7;
                else if (e.key === "Home") delta = -((date.getDay() + 6) % 7);
                else if (e.key === "End") delta = 6 - ((date.getDay() + 6) % 7);
                else if (e.key === "PageDown") {
                  e.preventDefault();
                  focusDate(
                    new Date(
                      year,
                      m + 1,
                      Math.min(i + 1, new Date(year, m + 2, 0).getDate()),
                      12,
                    ),
                  );
                  return;
                } else if (e.key === "PageUp") {
                  e.preventDefault();
                  focusDate(
                    new Date(
                      year,
                      m - 1,
                      Math.min(i + 1, new Date(year, m, 0).getDate()),
                      12,
                    ),
                  );
                  return;
                } else return;
                e.preventDefault();
                date.setDate(date.getDate() + delta);
                focusDate(date);
              }}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <p className={s.calendarSelection} role="status">
        Selected{" "}
        {initial.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>
    </section>
  );
}

export type TableRow = {
  id: string;
  name: string;
  category: string;
  progress: number;
};
/** Semantic table with explicit column sorting. Sample values belong to the caller. */
export function MaterialTable({
  rows,
  caption,
}: {
  rows: TableRow[];
  caption: string;
}) {
  const [sort, setSort] = useState<{
    key: "name" | "progress";
    direction: "ascending" | "descending";
  }>({ key: "name", direction: "ascending" });
  const sorted = [...rows].sort((a, b) => {
    const delta =
      sort.key === "name"
        ? a.name.localeCompare(b.name)
        : a.progress - b.progress;
    return sort.direction === "ascending" ? delta : -delta;
  });
  function toggle(key: "name" | "progress") {
    setSort({
      key,
      direction:
        sort.key === key && sort.direction === "ascending"
          ? "descending"
          : "ascending",
    });
  }
  return (
    <div
      className={s.tableWrap}
      tabIndex={0}
      role="region"
      aria-label={caption}
    >
      <table className={s.table}>
        <caption>
          {caption}
          <span>Illustrative local data</span>
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              aria-sort={sort.key === "name" ? sort.direction : "none"}
            >
              <button type="button" onClick={() => toggle("name")}>
                Idea{" "}
                <span aria-hidden="true">
                  {sort.key === "name"
                    ? sort.direction === "ascending"
                      ? "↑"
                      : "↓"
                    : "↕"}
                </span>
              </button>
            </th>
            <th scope="col">Material</th>
            <th
              scope="col"
              aria-sort={sort.key === "progress" ? sort.direction : "none"}
            >
              <button type="button" onClick={() => toggle("progress")}>
                Progress{" "}
                <span aria-hidden="true">
                  {sort.key === "progress"
                    ? sort.direction === "ascending"
                      ? "↑"
                      : "↓"
                    : "↕"}
                </span>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.id}>
              <th scope="row">{row.name}</th>
              <td>{row.category}</td>
              <td>
                <span className={s.progressValue}>
                  <i
                    style={
                      {
                        "--progress": `${Math.min(100, Math.max(0, row.progress))}%`,
                      } as React.CSSProperties
                    }
                    aria-hidden="true"
                  />
                  {row.progress}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && <p className={s.noResults}>No ideas to show yet.</p>}
    </div>
  );
}
