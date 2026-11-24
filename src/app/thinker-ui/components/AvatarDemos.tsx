"use client";
import { useEffect, useRef, useState } from "react";
import { ThinkerAvatar, type ThinkerAvatarState } from "./ThinkerAvatar";
import type { AvatarDefinition } from "@/vendor/open-bot-avatar";
import colors from "@/vendor/open-bot-avatar/gallery/colors.json";
import bull from "@/vendor/open-bot-avatar/gallery/bull.json";
import cat from "@/vendor/open-bot-avatar/gallery/cat.json";
import ghost from "@/vendor/open-bot-avatar/gallery/ghost.json";
import rocket from "@/vendor/open-bot-avatar/gallery/rocket.json";
import brain from "@/vendor/open-bot-avatar/gallery/brain.json";
import bunny from "@/vendor/open-bot-avatar/gallery/bunny.json";
import star from "@/vendor/open-bot-avatar/gallery/star.json";
import shield from "@/vendor/open-bot-avatar/gallery/shield.json";
import { thinkerCast, thinkerCastColors } from "./avatar-cast";
import styles from "./avatar.module.css";

const cast = [bull, cat, ghost, rocket, brain, bunny, star, shield, ...thinkerCast] as unknown as AvatarDefinition[];
const palette: Record<string, string> = { ...(colors as Record<string, string>), ...thinkerCastColors };

/* 16px line icons, one per state. They use currentColor so they follow the theme. */
function Icon({ id }: { id: ThinkerAvatarState | "material" }) {
  const common = { width: 15, height: 15, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (id) {
    case "idle": return <svg {...common}><circle cx="8" cy="8" r="5.2" /><path d="M6 9.2c1 1 3 1 4 0" /></svg>;
    case "thinking": return <svg {...common}><circle cx="3.5" cy="8" r=".8" fill="currentColor" /><circle cx="8" cy="8" r=".8" fill="currentColor" /><circle cx="12.5" cy="8" r=".8" fill="currentColor" /></svg>;
    case "working": return <svg {...common}><path d="M9 1.8 3.6 9h4l-1 5.2L12.4 7h-4z" /></svg>;
    case "waiting": return <svg {...common}><circle cx="8" cy="8" r="5.6" /><path d="M8 4.8V8l2.2 1.4" /></svg>;
    case "blocked": return <svg {...common}><path d="M8 2.2 14 13H2z" /><path d="M8 6.6v3" /><path d="M8 11.6v.1" /></svg>;
    case "done": return <svg {...common}><circle cx="8" cy="8" r="5.6" /><path d="m5.6 8.2 1.8 1.8 3.2-3.6" /></svg>;
    default: return <svg {...common}><path d="M3 5h10M3 8h10M3 11h6" /></svg>;
  }
}
const stages = ["Read", "Run tools", "Ask", "Finish"];
const stageOf = [0, 1, 2, 1, 3];
const swatches = ["#f2384b", "#f8a01c", "#1fbf68", "#1f7cf2", "#8b5cf6", "#ec4899"];
const states: { id: ThinkerAvatarState; label: string; line: string }[] = [
  { id: "idle", label: "Idle", line: "Ready when you are." },
  { id: "thinking", label: "Thinking", line: "Reading your request." },
  { id: "working", label: "Working", line: "Running tools." },
  { id: "waiting", label: "Waiting", line: "Needs your answer." },
  { id: "blocked", label: "Blocked", line: "Something failed. Retry?" },
  { id: "done", label: "Done", line: "Finished. Nothing left open." },
];
const script: [ThinkerAvatarState, number][] = [["thinking", 1600], ["working", 2600], ["waiting", 1800], ["working", 1600], ["done", 2600]];

export function AvatarDemo() {
  const [index, setIndex] = useState(0);
  const [state, setState] = useState<ThinkerAvatarState>("idle");
  const [happy, setHappy] = useState(false);
  const [color, setColor] = useState<string | undefined>(undefined);
  const [running, setRunning] = useState(false);
  const [pop, setPop] = useState(0);
  const [material, setMaterial] = useState<"fluffy" | "flat">("fluffy");
  const [step, setStep] = useState(-1);
  const timers = useRef<number[]>([]);
  const character = cast[index];
  const base = palette[character.id];
  const stop = () => { timers.current.forEach(clearTimeout); timers.current = []; setRunning(false); setStep(-1); };
  useEffect(() => stop, []);
  function run() {
    stop(); setRunning(true); setHappy(false); setStep(0);
    let at = 0;
    script.forEach(([next, ms], i) => {
      timers.current.push(window.setTimeout(() => { setState(next); setStep(stageOf[i]); if (next === "done") setHappy(true); }, at));
      at += ms;
      if (i === script.length - 1) timers.current.push(window.setTimeout(() => { setRunning(false); setHappy(false); setState("idle"); setStep(-1); }, at));
    });
  }
  function pet() { setPop(n => n + 1); setHappy(true); window.setTimeout(() => setHappy(false), 1400); }
  const line = states.find(s => s.id === state)?.line ?? "";
  return (
    <div className={styles.panel}>
      <div className={styles.stage}>
        <span className={styles.chip} data-state={state}><Icon id={state} />{states.find(x => x.id === state)?.label}</span>
        <div className={styles.figure} data-state={state}>
        <button key={`${state === "done" || state === "blocked" ? state : "x"}-${pop}`} type="button" className={`${styles.pet} ${state === "done" ? styles.hop : state === "blocked" ? styles.shake : pop ? styles.squish : ""}`} onClick={pet} aria-label={`Pet ${character.name}`}>
          <ThinkerAvatar definition={character} state={state} mood={happy ? "happy" : "neutral"} color={color ?? base} size={232} material={material} />
        </button>
        <span className={styles.shadow} aria-hidden="true" />
        </div>
        <p className={styles.status} aria-live="polite"><span>{character.name}</span> {line}</p>
        {step >= 0 ? (
          <ol className={styles.steps} aria-label="Task progress">
            {stages.map((label, i) => <li key={label} data-on={i <= step} data-now={i === step}>{label}</li>)}
          </ol>
        ) : <p className={styles.hint}>Move the pointer. Tap to pet.</p>}
      </div>
      <div className={styles.controls}>
        <div className={styles.group} role="group" aria-label="Character">
          {cast.map((c, i) => (
            <button key={c.id} type="button" className={styles.thumb} aria-pressed={i === index} aria-label={c.name} title={c.name} onClick={() => { setIndex(i); setColor(undefined); }}>
              <ThinkerAvatar definition={c} material="flat" still followPointer={false} color={palette[c.id]} size={56} label="" />
            </button>
          ))}
        </div>
        <div className={styles.group} role="group" aria-label="State">
          {states.map(s => <button key={s.id} type="button" className={styles.seg} aria-pressed={state === s.id} onClick={() => { stop(); setState(s.id); }}><Icon id={s.id} />{s.label}</button>)}
        </div>
        <div className={styles.group} role="group" aria-label="Material">
          {(["fluffy", "flat"] as const).map(m => <button key={m} type="button" className={styles.seg} aria-pressed={material === m} onClick={() => setMaterial(m)}>{m === "fluffy" ? "Fluffy" : "Flat"}</button>)}
        </div>
        <div className={styles.group} role="group" aria-label="Color">
          {swatches.map(c => <button key={c} type="button" className={styles.dot} style={{ background: c }} aria-pressed={(color ?? base) === c} aria-label={`Color ${c}`} onClick={() => setColor(c)} />)}
        </div>
        <button type="button" className={styles.run} onClick={running ? stop : run}>{running ? "Stop task" : "Run a task"}</button>
      </div>
    </div>
  );
}
