import { getCourseLabel } from "../../data/courses.js";
import Chip from "../ui/Chip.jsx";

export default function SectionBanner({ section }) {
  return (
    <div className="section-banner">
      <div>
        <div className="eyebrow">Selected section</div>
        <h2>
          {section.name} <span className="muted">· {getCourseLabel(section.course)}</span>
        </h2>
      </div>
      <Chip>Demo join code: LOCAL01</Chip>
    </div>
  );
}
