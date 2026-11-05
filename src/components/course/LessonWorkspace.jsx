import { useRef } from "react";
import { lessons } from "../../data/lessons.js";
import { useSaved } from "../../hooks/useSaved.js";
import Splitter from "../ui/Splitter.jsx";
import LessonHeader from "./LessonHeader.jsx";
import InstructionsPane from "./InstructionsPane.jsx";
import CodePane from "./CodePane.jsx";

/** Lesson header + resizable two-column workspace (instructions | editor & console). */
export default function LessonWorkspace({ lessonId }) {
  const task = lessons[lessonId];
  const workspace = useRef(null);
  const [leftWidth, setLeftWidth] = useSaved("designlab:left-width", 420);

  function resizeColumns(e) {
    if (!workspace.current) return;
    const rect = workspace.current.getBoundingClientRect();
    setLeftWidth(Math.max(260, Math.min(rect.width - 340, e.clientX - rect.left)));
  }

  return (
    <div className="lesson-screen">
      <LessonHeader task={task} />
      <div className="workspace-grid" ref={workspace} style={{ "--left-pane": `${leftWidth}px` }}>
        <InstructionsPane lessonId={lessonId} />
        <Splitter axis="columns" onDrag={resizeColumns} />
        <CodePane lessonId={lessonId} task={task} />
      </div>
    </div>
  );
}
