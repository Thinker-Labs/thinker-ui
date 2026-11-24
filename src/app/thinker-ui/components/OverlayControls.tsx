"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import s from "./overlays.module.css";

/** Native modal top layer handles focus trapping, Escape and background inertness. */
export function MaterialDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  side = "center",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  side?: "center" | "right";
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.querySelector<HTMLElement>("[data-initial-focus]")?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`${s.dialog} ${side === "right" ? s.drawer : ""}`}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const nodes = [
          ...event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex="0"]',
          ),
        ].filter((node) => !node.hidden && node.getClientRects().length > 0);
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (!first) {
          event.preventDefault();
          return;
        }
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
      onCancel={() => onOpenChange(false)}
      onClose={() => onOpenChange(false)}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const r = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < r.left ||
            event.clientX > r.right ||
            event.clientY < r.top ||
            event.clientY > r.bottom
          )
            onOpenChange(false);
        }
      }}
    >
      <div className={s.modalTop}>
        <span className={s.modalGlyph} aria-hidden="true">
          {side === "right" ? "▤" : "◒"}
        </span>
        <button
          type="button"
          className={s.close}
          aria-label="Close dialog"
          onClick={() => onOpenChange(false)}
        >
          ×
        </button>
      </div>
      <h2 id={titleId}>{title}</h2>
      {description && (
        <p id={descriptionId} className={s.description}>
          {description}
        </p>
      )}
      <div className={s.modalBody}>{children}</div>
    </dialog>
  );
}

/** Local confirmation is deliberately separate from any destructive integration. */
export function ConfirmAction({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
}) {
  return (
    <MaterialDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
    >
      <div className={s.confirmActions}>
        <button
          type="button"
          data-initial-focus
          autoFocus
          onClick={() => onOpenChange(false)}
        >
          Keep it
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onOpenChange(false);
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </MaterialDialog>
  );
}

/** Native popover light-dismiss and Escape. Content stays in normal Tab order. */
export function MaterialPopover({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div className={s.popoverWrap}>
      <button type="button" popoverTarget={id} className={s.trigger}>
        {label}
        <span aria-hidden="true">↗</span>
      </button>
      <div popover="auto" id={id} className={s.popover}>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}

/** Tooltip supplements an already named control; never hides required instructions. */
export function QuietTooltip({
  label,
  tip,
  children,
}: {
  label: string;
  tip: string;
  children: ReactNode;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const tooltip = useRef<HTMLSpanElement>(null);
  const hover = useRef(false);
  const leave = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [position, setPosition] = useState({ left: 20, top: 20 });
  const place = useCallback(() => {
    const r = trigger.current?.getBoundingClientRect();
    const box = tooltip.current?.getBoundingClientRect();
    if (!r || !box) return;
    setPosition({
      left: Math.max(
        12,
        Math.min(
          window.innerWidth - box.width - 12,
          r.left + r.width / 2 - box.width / 2,
        ),
      ),
      top:
        r.top >= box.height + 20
          ? r.top - box.height - 10
          : Math.min(window.innerHeight - box.height - 12, r.bottom + 10),
    });
  }, []);
  function show() {
    if (leave.current) clearTimeout(leave.current);
    place();
    setOpen(true);
  }
  function enter() {
    hover.current = true;
    show();
  }
  function exit() {
    hover.current = false;
    leave.current = setTimeout(() => {
      if (!hover.current && document.activeElement !== trigger.current)
        setOpen(false);
    }, 150);
  }
  useEffect(
    () => () => {
      if (leave.current) clearTimeout(leave.current);
    },
    [],
  );
  useEffect(() => {
    if (!open) return;
    function dismiss(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", dismiss);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, place]);
  return (
    <span
      className={s.tooltipWrap}
      onPointerEnter={enter}
      onPointerLeave={exit}
    >
      <button
        type="button"
        ref={trigger}
        className={s.tooltipButton}
        aria-label={label}
        aria-describedby={id}
        onFocus={show}
        onBlur={() => {
          if (!hover.current) setOpen(false);
        }}
        onClick={show}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
      >
        {children}
      </button>
      <span
        role="tooltip"
        ref={tooltip}
        onPointerEnter={enter}
        onPointerLeave={exit}
        id={id}
        style={position}
        className={`${s.tooltip} ${open ? s.tooltipOpen : ""}`}
      >
        {tip}
      </span>
    </span>
  );
}
