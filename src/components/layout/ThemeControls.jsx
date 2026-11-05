import { Moon, Sun } from "lucide-react";
import { cn } from "../../lib/cn.js";

const ACCENTS = [
  { id: "coral", label: "Coral", color: "#ff6b59" },
  { id: "purple", label: "Purple", color: "#a78bfa" },
];

/** Light/dark toggle plus accent color swatches. */
export default function ThemeControls({ theme, setTheme, accent, setAccent }) {
  const isDark = theme === "dark";
  return (
    <>
      <button
        className="icon-button"
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        aria-label="Toggle light and dark mode"
        onClick={() => setTheme(isDark ? "light" : "dark")}
      >
        {isDark ? <Sun size={17} /> : <Moon size={17} />}
      </button>
      {ACCENTS.map((a) => (
        <button
          key={a.id}
          className={cn("accent-swatch", accent === a.id && "swatch-active")}
          title={`${a.label} accent`}
          aria-label={`Use ${a.id} accent`}
          onClick={() => setAccent(a.id)}
          style={{ background: a.color }}
        />
      ))}
    </>
  );
}
