import { Menu, PanelLeftClose } from "lucide-react";
import Chip from "../ui/Chip.jsx";
import ThemeControls from "./ThemeControls.jsx";

export default function Topbar({ sidebarOpen, onToggleSidebar, onHome, theme, setTheme }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <button className="icon-button nav-toggle" onClick={onToggleSidebar} aria-label="Toggle navigation">
          {sidebarOpen ? <PanelLeftClose size={18} /> : <Menu size={18} />}
        </button>
        <button className="brand" onClick={onHome}>
          <span className="brand-logo">{"{ }"}</span>
          <strong>Ms. Whitby's Playground</strong>
          <span className="brand-compact">React Lab</span>
        </button>
        <div className="topbar-spacer" />
        <Chip>LOCAL DESIGN LAB</Chip>
        <ThemeControls theme={theme} setTheme={setTheme} />
        <span className="user-circle">W</span>
      </div>
    </header>
  );
}
