"use client";
import { useId, useRef, useState } from "react";
import styles from "./menu.module.css";
export type MenuItem = {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
};
export function MaterialMenu({
  items,
  value,
  onChange,
  title = "Workspace",
}: {
  items: MenuItem[];
  value: string;
  onChange: (value: string) => void;
  title?: string;
}) {
  const [open, setOpen] = useState(true);
  const panelId = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <div
      className={styles.menu}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
      >
        {title}
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className={open ? styles.open : ""}
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
      </button>
      <div
        id={panelId}
        hidden={!open}
        className={styles.options}
        role="group"
        aria-label={`${title} choices`}
      >
        {items.map((item) => (
          <button
            type="button"
            key={item.id}
            className={styles.option}
            aria-pressed={value === item.id}
            onClick={() => onChange(item.id)}
          >
            {item.icon && (
              <span className={styles.icon} aria-hidden="true">
                {item.icon}
              </span>
            )}
            <span>
              <span className={styles.name}>{item.label}</span>
              {item.description && (
                <span className={styles.description}>{item.description}</span>
              )}
            </span>
            {value === item.id && (
              <svg
                aria-hidden="true"
                className={styles.check}
                viewBox="0 0 16 16"
              >
                <path d="m3 8 3 3 7-7" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
