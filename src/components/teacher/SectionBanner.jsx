import { getCourseLabel } from "../../data/courses.js";
import Chip from "../ui/Chip.jsx";

export default function SectionBanner({ section }) {
  const joinCode = section?.join_code || section?.joinCode;
  const isIntegration = import.meta.env.VITE_READONLY_INTEGRATION === 'true';
  return (
    <div className="section-banner">
      <div>
        <div className="eyebrow">Selected section</div>
        <h2>
          {section.name} <span className="muted">· {getCourseLabel(section.course)}</span>
        </h2>
      </div>
      {joinCode ? <Chip>Join code: {joinCode}</Chip> : isIntegration ? <Chip>Join code unavailable</Chip> : <Chip>Demo join code: LOCAL01</Chip>}
    </div>
  );
}
