import { Moon, Sun } from "lucide-react";

/** Light/dark is global; individual courses own their accent colors. */
export default function ThemeControls({ theme, setTheme }) {
  const dark = theme === "dark";
  return <button className="icon-button"
    title={dark ? "Switch to light mode" : "Switch to dark mode"}
    aria-label="Toggle light and dark mode"
    onClick={() => setTheme(dark ? "light" : "dark")}>
    {dark ? <Sun size={17}/> : <Moon size={17}/>}
  </button>;
}
