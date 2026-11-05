import { cn } from "../../lib/cn.js";

/** Small pill label. tone: "" | "success" | "warning" */
export default function Chip({ children, tone = "" }) {
  return <span className={cn("chip", tone && `chip-${tone}`)}>{children}</span>;
}
