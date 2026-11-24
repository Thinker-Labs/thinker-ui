"use client";
/* Framework-neutral copyable components use optimized caller-provided image URLs. */
/* eslint-disable @next/next/no-img-element */
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import s from "./media.module.css";
export type Scene = {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  position?: string;
};
/** Manually paced imagery. No autoplay, drag requirement or hidden captions. */
export function SceneGallery({
  items,
  value,
  onChange,
  label,
}: {
  items: Scene[];
  value: string;
  onChange: (id: string) => void;
  label: string;
}) {
  const selected = items.find((item) => item.id === value) || items[0];
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const index = items.indexOf(selected);
  if (!selected) return null;
  function select(next: number, focus = false) {
    const item = items[Math.max(0, Math.min(items.length - 1, next))];
    onChange(item.id);
    if (focus)
      requestAnimationFrame(() =>
        ref.current
          ?.querySelector<HTMLButtonElement>(
            `[data-scene-index="${items.indexOf(item)}"]`,
          )
          ?.focus(),
      );
  }
  return (
    <section className={s.gallery} aria-label={label}>
      <div className={s.sceneFrame}>
        <img
          loading="lazy"
          decoding="async"
          width={1200}
          height={800}
          key={selected.id}
          src={selected.src}
          alt={selected.alt}
          style={{ objectPosition: selected.position }}
          className={s.sceneImage}
        />
        <span className={s.frameIndex} aria-hidden="true">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(items.length).padStart(2, "0")}
        </span>
      </div>
      <div className={s.sceneMeta}>
        <div>
          <h3 id={id}>{selected.title}</h3>
          <p>{selected.description}</p>
        </div>
        <div className={s.sceneArrows}>
          <button
            type="button"
            aria-label="Previous scene"
            disabled={index === 0}
            onClick={() => select(index - 1)}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next scene"
            disabled={index === items.length - 1}
            onClick={() => select(index + 1)}
          >
            →
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className={s.thumbnails}
        role="group"
        aria-label="Choose a scene"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            select(index + 1, true);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            select(index - 1, true);
          } else if (e.key === "Home") {
            e.preventDefault();
            select(0, true);
          } else if (e.key === "End") {
            e.preventDefault();
            select(items.length - 1, true);
          }
        }}
      >
        {items.map((item, i) => (
          <button
            type="button"
            key={item.id}
            data-scene-index={i}
            aria-label={item.title}
            aria-pressed={item.id === selected.id}
            tabIndex={item.id === selected.id ? 0 : -1}
            onClick={() => select(i)}
          >
            <img
              loading="lazy"
              decoding="async"
              width={240}
              height={120}
              src={item.src}
              alt=""
              style={{ objectPosition: item.position }}
            />
            <span>{item.title}</span>
          </button>
        ))}
      </div>
      <span className={s.srOnly} role="status">
        Scene {index + 1} of {items.length}: {selected.title}
      </span>
    </section>
  );
}

/** A native modal viewer with explicit zoom controls and bounded image scrolling. */
export function FocusImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [zoom, setZoom] = useState(false);
  const id = useId();
  function close() {
    ref.current?.close();
    setZoom(false);
    trigger.current?.focus();
  }
  return (
    <figure className={s.focusImage}>
      <button
        type="button"
        ref={trigger}
        className={s.imageTrigger}
        aria-label="Open image viewer"
        onClick={() => ref.current?.showModal()}
      >
        <img
          loading="lazy"
          decoding="async"
          width={1200}
          height={800}
          src={src}
          alt={alt}
        />
        <span>
          Look closer <span aria-hidden="true">↗</span>
        </span>
      </button>
      <figcaption>{caption}</figcaption>
      <dialog
        ref={ref}
        className={s.viewer}
        aria-labelledby={id}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onKeyDown={(e) => {
          if (e.key !== "Tab") return;
          const buttons = [
            ...e.currentTarget.querySelectorAll<HTMLElement>(
              'button,[tabindex="0"]',
            ),
          ];
          if (e.shiftKey && document.activeElement === buttons[0]) {
            e.preventDefault();
            buttons.at(-1)?.focus();
          } else if (!e.shiftKey && document.activeElement === buttons.at(-1)) {
            e.preventDefault();
            buttons[0]?.focus();
          }
        }}
      >
        <div className={s.viewerTop}>
          <h3 id={id}>A closer look</h3>
          <div>
            <button
              type="button"
              aria-pressed={zoom}
              onClick={() => setZoom(!zoom)}
            >
              {zoom ? "Fit image" : "Zoom image"}
            </button>
            <button
              type="button"
              onClick={close}
              aria-label="Close image viewer"
            >
              ×
            </button>
          </div>
        </div>
        <div
          className={s.viewerCanvas}
          tabIndex={0}
          aria-label="Image detail, scroll when zoomed"
        >
          <img
            loading="lazy"
            decoding="async"
            width={1200}
            height={800}
            src={src}
            alt={alt}
            className={zoom ? s.zoomed : ""}
          />
        </div>
        <p>{caption}</p>
      </dialog>
    </figure>
  );
}

/** Pointer response decorates a normal button. Its label never follows the pointer. */
export function KineticButton({
  children,
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduced = useRef(false);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    function sync() {
      reduced.current = media.matches;
    }
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  function reset() {
    ref.current?.style.setProperty("--kinetic-x", "0px");
    ref.current?.style.setProperty("--kinetic-y", "0px");
    ref.current?.style.setProperty("--kinetic-rotate", "0deg");
  }
  return (
    <span className={s.kineticWrap}>
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={s.kineticButton}
        onClick={onClick}
        onPointerMove={(e) => {
          if (reduced.current || disabled || e.pointerType === "touch") return;
          const r = e.currentTarget.getBoundingClientRect();
          const x = Math.max(
            -8,
            Math.min(8, (e.clientX - r.left - r.width / 2) * 0.12),
          );
          const y = Math.max(
            -6,
            Math.min(6, (e.clientY - r.top - r.height / 2) * 0.15),
          );
          e.currentTarget.style.setProperty("--kinetic-x", `${x}px`);
          e.currentTarget.style.setProperty("--kinetic-y", `${y}px`);
          e.currentTarget.style.setProperty(
            "--kinetic-rotate",
            `${x * 0.25}deg`,
          );
        }}
        onPointerLeave={reset}
        onBlur={reset}
        style={
          {
            "--kinetic-x": "0px",
            "--kinetic-y": "0px",
            "--kinetic-rotate": "0deg",
          } as CSSProperties
        }
      >
        <span>{children}</span>
        <span className={s.kineticArrow} aria-hidden="true">
          ↗
        </span>
      </button>
    </span>
  );
}
