import { useRef } from "react";
import { cn } from "../../lib/cn.js";

/**
 * Draggable gutter. axis="columns" resizes left/right, axis="rows" resizes top/bottom.
 * Calls onDrag(pointerEvent) while the user is dragging this splitter.
 */
export default function Splitter({ axis, onDrag }) {
  const dragging = useRef(false);
  const isColumns = axis === "columns";
  const stop = () => (dragging.current = false);

  return (
    <div
      className={cn("splitter", isColumns ? "column-split" : "row-split")}
      role="separator"
      aria-label={isColumns ? "Resize instructions and editor" : "Resize editor and console"}
      aria-orientation={isColumns ? "vertical" : "horizontal"}
      tabIndex={0}
      onPointerDown={(e) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        dragging.current = true;
      }}
      onPointerMove={(e) => {
        if (dragging.current && e.buttons === 1) onDrag(e);
      }}
      onPointerUp={stop}
      onLostPointerCapture={stop}
    >
      <span />
    </div>
  );
}
