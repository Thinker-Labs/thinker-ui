"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./seats.module.css";

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const LEFT = [1, 2, 3, 4, 5, 6];
const RIGHT = [7, 8, 9, 10, 11, 12];
const TAKEN = new Set([
  "A2", "A3", "A9", "B5", "B6", "B8", "C3", "C4", "C8", "C9",
  "D1", "D11", "D12", "E4", "E5", "E10", "E11", "F2", "F7", "F8",
  "G3", "G4", "G5", "G6", "H7", "H8", "H9", "H10",
]);

/* Enclosed-room 3D preview, modeled on the Codrops cinema seat preview architecture:
   a real box room, a camera that travels to the chosen seat and aims at the screen. */
const ROOM = { x: 684, y: 330, z: 1262 };
const PERSP = 660;
const SEAT_U = 38;
const FRONT_GAP = 560;
const ROW_BACK = 46;
const ROW_UP = 6;
const SEAT_H = 58;
const SCR = { w: 616, h: 286, top: 16 };
const OVERHEAD = { tx: 0, ty: ROOM.y / 3.5, tz: 0, rx: -15, ry: 0 };

function lineEq(oMin: number, oMax: number, iMin: number, iMax: number, v: number) {
  return oMin + ((oMax - oMin) * (v - iMin)) / (iMax - iMin);
}

function rowZ(i: number) {
  return -(ROOM.z - FRONT_GAP - i * ROW_BACK);
}

function seatView(seat: string) {
  const i = ROWS.indexOf(seat[0]);
  const n = Number(seat.slice(1));
  const z = rowZ(i);
  const col = n <= 6 ? n - 1 : n + 1; // aisle spans two seat units
  const seatCenterX = 2 * SEAT_U + col * SEAT_U + SEAT_U / 2;
  const tx = ROOM.x / 2 - seatCenterX;
  const ty = ROOM.y / 2 - (ROOM.y - ROW_UP * i) + SEAT_H + 20;
  const tz = Math.abs(z) + 6;
  const screenCenterY = SCR.top + SCR.h / 2;
  const aimY = screenCenterY + 48; // aim below the screen center so the rows ahead fill the lower frame
  const rx =
    (Math.atan2(ROOM.y / 2 - ty - aimY, Math.sqrt(tx * tx + (ROOM.z - tz) * (ROOM.z - tz))) * 180) /
    Math.PI;
  const firstRowZ = ROOM.z - FRONT_GAP;
  const lastRowZ = firstRowZ - (ROWS.length - 1) * ROW_BACK;
  const ry1 = lineEq(0, 20, 0, ROOM.x / 2, tx);
  const ry2 = lineEq(0, 50, 0, ROOM.x / 2, tx);
  const ry = lineEq(ry1, ry2, lastRowZ, firstRowZ, Math.abs(z));
  return { tx, ty, tz, rx, ry };
}

function TheaterView({
  seat,
  title,
  screenImg,
  onExit,
  onBook,
  booked,
  exiting,
}: {
  seat: string;
  title: string;
  screenImg?: string;
  onExit: () => void;
  onBook: () => void;
  booked: boolean;
  exiting: boolean;
}) {
  const base = seatView(seat);
  const [phase, setPhase] = useState<"enter" | "seat" | "exit">("enter");
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [scale, setScale] = useState(0.76);
  const theaterRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const el = theaterRef.current;
    if (!el) return;
    const fit = () => setScale(Math.min(el.clientWidth / ROOM.x, el.clientHeight / ROOM.y));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setPhase("seat")));
    return () => cancelAnimationFrame(raf);
  }, []);
  useEffect(() => {
    if (exiting) setPhase("exit");
  }, [exiting]);
  function onPointerDown(e: React.PointerEvent) {
    drag.current = { x: e.clientX - look.x, y: e.clientY - look.y };
    setDragging(true);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    setLook({
      x: Math.max(-160, Math.min(160, e.clientX - drag.current.x)),
      y: Math.max(-70, Math.min(70, e.clientY - drag.current.y)),
    });
  }
  function onPointerUp() {
    drag.current = null;
    setDragging(false);
  }
  const view =
    phase === "seat"
      ? { ...base, rx: base.rx - (look.y / 70) * 10, ry: base.ry + (look.x / 160) * 15 }
      : OVERHEAD;
  const tf = `translate3d(0,0,${PERSP}px) rotate3d(1,0,0,${view.rx}deg) rotate3d(0,1,0,${view.ry}deg) translate3d(${view.tx}px,${view.ty}px,${view.tz}px)`;
  const seat3 = (r: string, n: number) => {
    const id = `${r}${n}`;
    return (
      <span
        key={id}
        className={`${styles.t3seat} ${TAKEN.has(id) ? styles.t3seatTaken : ""}`}
      />
    );
  };
  return (
    <div
      ref={theaterRef}
      className={styles.theater}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      role="group"
      aria-label={`Preview from seat ${seat}. Drag to look around.`}
    >
      <div className={styles.t3view} style={{ transform: `scale3d(${scale}, ${scale}, 1)` }}>
      <div className={styles.cube3} style={{ transform: tf, transition: dragging ? "none" : undefined }}>
        <div className={`${styles.t3face} ${styles.t3back}`}>
          <div className={styles.t3screen}>
            {screenImg ? <img className={styles.t3screenImg} src={screenImg} alt="" draggable={false} /> : null}
            <div className={styles.t3caption}>
              <span className={styles.t3title}>{title}</span>
              <span className={styles.t3sub}>Official trailer</span>
            </div>
            <div className={styles.t3sheen} />
          </div>
        </div>
        <div className={`${styles.t3face} ${styles.t3left}`}>
          <span className={styles.t3strip} />
          <span className={styles.t3exit}>Exit</span>
        </div>
        <div className={`${styles.t3face} ${styles.t3right}`}>
          <span className={styles.t3strip} />
          <span className={styles.t3exit}>Exit</span>
        </div>
        <div className={`${styles.t3face} ${styles.t3floor}`} />
        <div className={`${styles.t3face} ${styles.t3ceil}`} />
        <div className={styles.t3rows}>
          {ROWS.map((r, i) => (
            <div key={r} className={styles.t3row} style={{ transform: `translate3d(0, ${-ROW_UP * i}px, ${rowZ(i)}px)` }}>
              {LEFT.map((n) => seat3(r, n))}
              <span className={styles.t3aisle} />
              {RIGHT.map((n) => seat3(r, n))}
            </div>
          ))}
        </div>
      </div>
      </div>
      <div className={styles.tVignette} />
      <div className={styles.tChips}>
        {[...LEFT, ...RIGHT].map((n) => {
          const id = `${seat[0]}${n}`;
          const mine = id === seat;
          return (
            <span
              key={id}
              className={`${styles.tChip} ${mine ? styles.tChipYou : ""} ${TAKEN.has(id) ? styles.tChipTaken : ""}`}
            >
              {mine ? n : ""}
            </span>
          );
        })}
      </div>
      <div className={styles.tBar}>
        <button type="button" className={styles.tBack} onClick={onExit}>
          <span aria-hidden="true">▦</span> Seats
        </button>
        <button
          type="button"
          className={`${styles.book} ${booked ? styles.bookDone : ""}`}
          onClick={onBook}
          disabled={booked}
        >
          {booked ? "Booked, see you there" : "Book seats"}
        </button>
      </div>
    </div>
  );
}

export function SeatPicker({
  title,
  session,
  poster,
  screenImg,
  tickets,
  onTicketsChange,
  value,
  onChange,
  onBook,
}: {
  title: string;
  session: string;
  poster?: string;
  screenImg?: string;
  tickets: number;
  onTicketsChange: (tickets: number) => void;
  value: string[];
  onChange: (seats: string[]) => void;
  onBook?: (seats: string[]) => void;
}) {
  const [preview, setPreview] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [booked, setBooked] = useState(false);
  function toggle(seat: string) {
    if (TAKEN.has(seat)) return;
    if (value.includes(seat)) {
      onChange(value.filter((s) => s !== seat));
      return;
    }
    if (value.length >= tickets) {
      onChange([...value.slice(1), seat]);
      return;
    }
    onChange([...value, seat]);
  }
  function closePreview() {
    setExiting(true);
    setTimeout(() => {
      setPreview(false);
      setExiting(false);
    }, 1000);
  }
  function book() {
    setBooked(true);
    onBook?.(value);
    setTimeout(() => {
      setBooked(false);
      closePreview();
    }, 2400);
  }
  const focusSeat = value[value.length - 1];
  const sorted = [...value].sort((a, b) => a[0].localeCompare(b[0]) || Number(a.slice(1)) - Number(b.slice(1)));
  const rows = [...new Set(sorted.map((s) => s[0]))];
  const summary =
    value.length === 0
      ? "Choose your seats"
      : rows.length === 1
        ? `Row ${rows[0]} · Seats ${sorted.map((s) => s.slice(1)).join(", ")}`
        : `Seats ${sorted.join(" · ")}`;
  function seatButton(row: string, num: number) {
    const id = `${row}${num}`;
    const taken = TAKEN.has(id);
    const picked = value.includes(id);
    return (
      <button
        key={id}
        type="button"
        className={`${styles.seat} ${taken ? styles.seatTaken : picked ? styles.seatYours : ""}`}
        aria-pressed={picked}
        aria-label={taken ? `${id}, taken` : `${id}${picked ? ", selected" : ""}`}
        disabled={taken}
        onClick={() => toggle(id)}
      >
        {picked ? num : ""}
      </button>
    );
  }
  return (
    <div className={styles.cinema}>
      <div className={styles.head}>
        <div className={styles.headMain}>
          {poster ? <img className={styles.poster} src={poster} alt="" /> : null}
          <div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.session}>{session}</p>
          </div>
        </div>
        <div className={styles.stepper}>
          <button
            type="button"
            className={styles.stepButton}
            aria-label="Fewer tickets"
            disabled={tickets <= 1}
            onClick={() => onTicketsChange(Math.max(1, tickets - 1))}
          >
            −
          </button>
          <span className={styles.stepValue} aria-live="polite">
            {tickets} {tickets === 1 ? "ticket" : "tickets"}
          </span>
          <button
            type="button"
            className={styles.stepButton}
            aria-label="More tickets"
            disabled={tickets >= 6}
            onClick={() => onTicketsChange(Math.min(6, tickets + 1))}
          >
            +
          </button>
        </div>
      </div>
      {preview && focusSeat ? (
        <TheaterView
          seat={focusSeat}
          title={title}
          screenImg={screenImg}
          booked={booked}
          exiting={exiting}
          onExit={closePreview}
          onBook={book}
        />
      ) : (
        <>
          <div className={styles.screenWrap} aria-hidden="true">
            <div className={styles.screen} />
            <span className={styles.screenLabel}>SCREEN</span>
          </div>
          <div className={styles.grid} role="group" aria-label="Seats">
            {ROWS.map((row) => (
              <div key={row} className={styles.row} style={{ ["--i" as string]: ROWS.indexOf(row) }}>
                <span className={styles.rowLabel}>{row}</span>
                <div className={styles.block}>{LEFT.map((n) => seatButton(row, n))}</div>
                <div className={styles.block}>{RIGHT.map((n) => seatButton(row, n))}</div>
                <span className={styles.rowLabel}>{row}</span>
              </div>
            ))}
          </div>
          <div className={styles.legend}>
            <span className={styles.legendKey}><span className={`${styles.legendSwatch} ${styles.legendFree}`} />Free</span>
            <span className={styles.legendKey}><span className={`${styles.legendSwatch} ${styles.legendTaken}`} />Taken</span>
            <span className={styles.legendKey}><span className={`${styles.legendSwatch} ${styles.legendYours}`} />Yours</span>
          </div>
          <div className={styles.summary} aria-live="polite">
            <span className={styles.summaryText}>{summary}</span>
            {focusSeat ? <span className={styles.summaryHint}>Row {focusSeat[0]} · Seat {focusSeat.slice(1)}</span> : null}
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.preview}
              disabled={!focusSeat}
              onClick={() => setPreview(true)}
            >
              <span aria-hidden="true">◈</span> Preview
            </button>
            <button
              type="button"
              className={`${styles.book} ${booked ? styles.bookDone : ""}`}
              disabled={value.length === 0 || booked}
              onClick={book}
            >
              {booked
                ? "Booked, see you there"
                : value.length === 0
                  ? "Pick your seats"
                  : "Book seats"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
