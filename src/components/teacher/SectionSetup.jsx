import { getCourseLabel } from "../../data/courses.js";
import { sections } from "../../data/sections.js";

/** "Section setup" tab: read-only cards for each configured section. */
export default function SectionSetup({ students }) {
  return (
    <section className="panel">
      <h2>Section setup</h2>
      <p>
        Visual preview of configured sections. This sandbox cannot create live classes or assign students.
      </p>
      <div className="setup-grid">
        {sections.map((s) => (
          <div className="setup-card" key={s.id}>
            <div className="eyebrow">{s.name}</div>
            <h3>{getCourseLabel(s.course)}</h3>
            <span>{students.filter((t) => t.sections.includes(s.id)).length} sample students</span>
          </div>
        ))}
      </div>
    </section>
  );
}
