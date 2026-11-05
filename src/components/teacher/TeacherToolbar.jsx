import { RotateCcw } from "lucide-react";
import { getCourseLabel } from "../../data/courses.js";
import { sections } from "../../data/sections.js";

export default function TeacherToolbar({ sectionId, onSectionChange, onReset }) {
  return (
    <div className="teacher-toolbar">
      <label>
        Class section
        <select value={sectionId} onChange={(e) => onSectionChange(e.target.value)}>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} · {getCourseLabel(s.course)}
            </option>
          ))}
        </select>
      </label>
      <button className="btn" onClick={onReset}>
        <RotateCcw size={15} /> Reset sample records
      </button>
    </div>
  );
}
