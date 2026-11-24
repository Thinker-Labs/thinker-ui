import styles from "./agentic.module.css";

const DEFAULT_VALUES = [
  { radius: 0, use: "Table cells" },
  { radius: 4, use: "Checkboxes" },
  { radius: 6, use: "Keyboard shortcuts" },
  { radius: 8, use: "Menu images" },
  { radius: 10, use: "Accordions and sliders" },
  { radius: 16, use: "Text areas and tables" },
  { radius: 20, use: "Dialogs and banners" },
  { radius: 30, use: "Bottom sheets" },
  { radius: 50, use: "Call-to-action panels" },
  { radius: 9999, use: "Buttons and avatars" },
];

export function RadiusScale({
  values = DEFAULT_VALUES,
}: {
  values?: { radius: number; use: string }[];
}) {
  return (
    <div className={styles.radiusPanel}>
      <ul className={styles.radiusGrid}>
        {values.map((item) => (
          <li key={`${item.radius}-${item.use}`} className={styles.radiusItem}>
            <span
              className={styles.radiusSpecimen}
              aria-hidden="true"
              style={
                { borderBottomLeftRadius: item.radius }
              }
            />
            <span className={styles.radiusUse}>{item.use}</span>
            <span className={styles.radiusValue}>{item.radius}px</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
