"use client";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./agentic-motion.module.css";

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

export function ScrollReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${inView ? styles.revealIn : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function CountUp({
  value,
  label,
  duration = 900,
}: {
  value: number;
  label?: string;
  duration?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration]);
  return (
    <span ref={ref} className={styles.count}>
      <span className={styles.countValue}>{shown.toLocaleString()}</span>
      {label && <span className={styles.countLabel}>{label}</span>}
    </span>
  );
}

export function TextSwap({
  items,
  interval = 2200,
}: {
  items: string[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (items.length < 2) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      interval
    );
    return () => clearInterval(timer);
  }, [items.length, interval]);
  return (
    <span className={styles.swap} aria-live="polite">
      <span key={index} className={styles.swapWord}>
        {items[index]}
      </span>
    </span>
  );
}

export function SuccessCheck({
  on,
  label = "Done",
}: {
  on: boolean;
  label?: string;
}) {
  return (
    <span
      className={`${styles.check} ${on ? styles.checkOn : ""}`}
      role="status"
      aria-label={on ? label : undefined}
    >
      <svg viewBox="0 0 24 24" className={styles.checkSvg} aria-hidden="true">
        <circle cx="12" cy="12" r="10" className={styles.checkRing} />
        <path d="M7.5 12.5l3 3 6-7" className={styles.checkMark} />
      </svg>
      <span className={styles.checkLabel}>{on ? label : "Waiting"}</span>
    </span>
  );
}

export function ShakeOnError({
  signal,
  children,
}: {
  signal: number;
  children: React.ReactNode;
}) {
  const [shaking, setShaking] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setShaking(true);
    const timer = setTimeout(() => setShaking(false), 500);
    return () => clearTimeout(timer);
  }, [signal]);
  return (
    <div className={`${styles.shake} ${shaking ? styles.shakeOn : ""}`}>
      {children}
    </div>
  );
}

export function CardFan({
  items,
}: {
  items: { title: string; subtitle: string }[];
}) {
  const tones = [styles.fanStone, styles.fanLinen, styles.fanClay, styles.fanGraphite];
  return (
    <div className={styles.fan} tabIndex={0} aria-label="A stack of cards. Focus or hover to fan them out.">
      {items.slice(0, 4).map((item, index) => (
        <div
          key={item.title}
          className={`${styles.fanCard} ${tones[index % tones.length]}`}
          style={{ "--i": index } as React.CSSProperties}
        >
          <span className={styles.fanTitle}>{item.title}</span>
          <span className={styles.fanSubtitle}>{item.subtitle}</span>
        </div>
      ))}
    </div>
  );
}

export function SlidingTabs({
  items,
  value,
  onChange,
  label,
}: {
  items: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  const index = Math.max(0, items.indexOf(value));
  return (
    <span className={styles.sliding} role="group" aria-label={label}>
      <span
        className={styles.slidingPill}
        style={{
          width: `${100 / items.length}%`,
          transform: `translateX(${index * 100}%)`,
        }}
        aria-hidden="true"
      />
      {items.map((item) => (
        <button
          key={item}
          type="button"
          className={styles.slidingTab}
          aria-pressed={item === value}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </span>
  );
}

export function MarqueeRow({
  items,
  duration = 24,
}: {
  items: string[];
  duration?: number;
}) {
  const id = useId();
  return (
    <div className={styles.marquee} aria-label={items.join(", ")}>
      <div
        className={styles.marqueeTrack}
        style={{ animationDuration: `${duration}s` }}
      >
        {[0, 1].map((half) => (
          <span key={half} className={styles.marqueeHalf} aria-hidden={half === 1 || undefined} id={half === 0 ? id : undefined}>
            {items.map((item) => (
              <span key={`${half}-${item}`} className={styles.marqueeItem}>
                {item}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SkeletonReveal({
  loading,
  children,
  lines = 3,
}: {
  loading: boolean;
  children: React.ReactNode;
  lines?: number;
}) {
  return (
    <div className={styles.skeleton} aria-busy={loading}>
      <div
        className={`${styles.skeletonLayer} ${loading ? styles.skeletonShow : styles.skeletonHide}`}
        aria-hidden={!loading}
      >
        {Array.from({ length: lines }, (_, i) => (
          <span key={i} className={styles.skeletonLine} style={{ width: `${92 - i * 18}%` }} />
        ))}
        {loading && <span className={styles.skeletonStatus} role="status">Loading</span>}
      </div>
      <div className={`${styles.skeletonContent} ${loading ? styles.skeletonAway : styles.skeletonHere}`}>
        {children}
      </div>
    </div>
  );
}
