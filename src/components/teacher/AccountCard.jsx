import { Settings2, X } from "lucide-react";
import { getSectionPeriod } from "../../data/sections.js";
import { niceName } from "../../lib/students.js";
import Chip from "../ui/Chip.jsx";

export default function AccountCard({ student: s, isEditing, onToggleEdit, onDone, onPatch }) {
  const name = niceName(s);
  return (
    <article className="account-card">
      <div className="account-row">
        <span className="avatar">{name.slice(0, 1).toUpperCase()}</span>
        <div className="account-identity">
          <h3>{name}</h3>
          <small>@{s.github}</small>
        </div>
        <button className="icon-button" aria-label={`Edit ${name}`} onClick={onToggleEdit}>
          {isEditing ? <X size={17} /> : <Settings2 size={17} />}
        </button>
      </div>

      <div className="account-footer">
        <Chip tone={s.sheetName ? "success" : ""}>
          {s.sheetName ? "Sheet matched" : "Student name fallback"}
        </Chip>
        {s.sections.map((id) => (
          <Chip key={id}>Period {getSectionPeriod(id)}</Chip>
        ))}
      </div>

      {isEditing && (
        <div className="account-edit">
          <label>
            Google Sheet name
            <input
              value={s.sheetName || ""}
              onChange={(e) => onPatch({ sheetName: e.target.value || null })}
            />
          </label>
          <label>
            Student-provided backup
            <input value={s.studentName || ""} onChange={(e) => onPatch({ studentName: e.target.value })} />
          </label>
          <button className="btn" onClick={onDone}>
            Done
          </button>
        </div>
      )}
    </article>
  );
}
