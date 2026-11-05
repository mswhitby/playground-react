import { ChevronRight, LayoutDashboard } from "lucide-react";

export default function TeacherShortcut({ onClick }) {
  return (
    <button className="wide-shortcut" onClick={onClick}>
      <LayoutDashboard size={18} />
      <span>
        <strong>Teacher Dashboard preview</strong>
        <small>Section roster, expanded student assignments, account matching, and weekly points</small>
      </span>
      <ChevronRight size={18} />
    </button>
  );
}
