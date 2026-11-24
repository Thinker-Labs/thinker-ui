"use client";
import { useId } from "react";
import s from "./forms.module.css";
export function MaterialCheckbox({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <label className={s.checkRow}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span>
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
    </label>
  );
}
export function ChoiceCards({
  items,
  value,
  onChange,
  label,
}: {
  items: { id: string; label: string; description: string }[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  const id = useId();
  return (
    <fieldset className={s.choices}>
      <legend>{label}</legend>
      {items.map((item) => (
        <label className={s.choice} key={item.id}>
          <input
            type="radio"
            name={id}
            checked={value === item.id}
            onChange={() => onChange(item.id)}
          />
          <span>
            <strong>{item.label}</strong>
            <small>{item.description}</small>
          </span>
        </label>
      ))}
    </fieldset>
  );
}
export function MaterialSlider({
  value,
  onChange,
  label,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}) {
  const id = useId();
  return (
    <div className={s.field}>
      <div className={s.top}>
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>
          {value}
          {unit}
        </output>
      </div>
      <input
        className={s.range}
        id={id}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(e.target.valueAsNumber)}
      />
    </div>
  );
}
export function QuantityStepper({
  value,
  onChange,
  label,
  min = 0,
  max = 10,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
}) {
  const id = useId();
  return (
    <div className={s.field}>
      <label htmlFor={id}>{label}</label>
      <div className={s.stepper}>
        <button
          type="button"
          aria-label={`Decrease ${label.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          −
        </button>
        <output id={id} aria-live="polite">
          {value}
        </output>
        <button
          type="button"
          aria-label={`Increase ${label.toLowerCase()}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          +
        </button>
      </div>
    </div>
  );
}
export function MaterialSelect({
  value,
  onChange,
  label,
  items,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  items: { id: string; label: string }[];
}) {
  const id = useId();
  return (
    <div className={s.field}>
      <label htmlFor={id}>{label}</label>
      <select
        className={s.select}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {items.map((i) => (
          <option value={i.id} key={i.id}>
            {i.label}
          </option>
        ))}
      </select>
    </div>
  );
}
export function NoteField({
  value,
  onChange,
  label,
  maxLength = 240,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  maxLength?: number;
}) {
  const id = useId();
  return (
    <div className={s.field}>
      <label htmlFor={id}>{label}</label>
      <textarea
        className={s.textarea}
        id={id}
        value={value}
        maxLength={maxLength}
        aria-describedby={`${id}-count`}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Room for a thought…"
      />
      <small id={`${id}-count`}>
        {value.length} / {maxLength} characters
      </small>
    </div>
  );
}
export function TagPicker({
  items,
  value,
  onChange,
  label,
  max = 3,
}: {
  items: string[];
  value: string[];
  onChange: (value: string[]) => void;
  label: string;
  max?: number;
}) {
  return (
    <fieldset className={s.tags}>
      <legend>
        {label} <small>Choose up to {max}</small>
      </legend>
      {items.map((item) => (
        <button
          type="button"
          key={item}
          aria-pressed={value.includes(item)}
          disabled={!value.includes(item) && value.length >= max}
          onClick={() =>
            onChange(
              value.includes(item)
                ? value.filter((v) => v !== item)
                : [...value, item],
            )
          }
        >
          {value.includes(item) && <span aria-hidden="true">✓ </span>}
          {item}
        </button>
      ))}
    </fieldset>
  );
}
export function RatingControl({
  value,
  onChange,
  label,
  max = 5,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
  max?: number;
}) {
  const id = useId();
  return (
    <fieldset className={s.rating}>
      <legend>{label}</legend>
      {Array.from({ length: max }, (_, i) => (
        <label key={i} title={`${i + 1} of ${max}`}>
          <input
            type="radio"
            name={id}
            checked={value === i + 1}
            onChange={() => onChange(i + 1)}
            aria-label={`${i + 1} of ${max}`}
          />
          <span aria-hidden="true" data-filled={value > i}>
            ★
          </span>
        </label>
      ))}
      <output aria-live="polite">
        {value ? `${value} of ${max}` : "Not rated"}
      </output>
    </fieldset>
  );
}
