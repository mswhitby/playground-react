import { LayoutDashboard, Settings2, Users } from "lucide-react";

export const TEACHER_TABS = [
  ["overview", "Class overview", LayoutDashboard],
  ["accounts", "Accounts", Users],
  ["setup", "Section setup", Settings2],
];

export default function TeacherTabs({ tab, onChange }) {
  return (
    <div className="tabs teacher-tabs" role="tablist" aria-label="Teacher dashboard tabs">
      {TEACHER_TABS.map(([id, label, Icon]) => (
        <button
          key={id}
          role="tab"
          aria-selected={tab === id}
          className={tab === id ? "active" : ""}
          onClick={() => onChange(id)}
        >
          <Icon size={16} />
          {label}
        </button>
      ))}
    </div>
  );
}
