import { Settings2, X } from "lucide-react";
import { getCourseLabel } from "../../data/courses.js";
import { sections } from "../../data/sections.js";

export default function TeacherToolbar({ sectionId, onSectionChange, setupOpen, onToggleSetup, sections: availableSections = sections, readOnlyMode = false }) {
  return (
    <div className="teacher-toolbar">
      <label>
        Class section
        <select value={sectionId} onChange={event => onSectionChange(event.target.value)}>
          {availableSections.map(section => (
            <option key={section.id} value={section.id}>
              {section.name} · {getCourseLabel(section.course)}
            </option>
          ))}
        </select>
      </label>
      {!readOnlyMode && <button type="button" className="btn section-setup-toggle"
        aria-expanded={setupOpen} aria-controls="teacher-section-setup"
        onClick={onToggleSetup}>
        {setupOpen ? <X size={16}/> : <Settings2 size={16}/>}
        {setupOpen ? 'Close section setup' : 'Section setup'}
      </button>}
    </div>
  );
}
