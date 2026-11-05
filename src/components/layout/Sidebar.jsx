import { BookOpen, CircleHelp, House, LayoutDashboard } from "lucide-react";
import { courses } from "../../data/courses.js";
import { cn } from "../../lib/cn.js";

const MENU = [
  ["home", "Home", House],
  ["course", "Course preview", BookOpen],
  ["teacher", "Teacher dashboard", LayoutDashboard],
];

export default function Sidebar({ open, page, courseId, setPage, openCourse }) {
  return (
    <aside className={cn("main-sidebar", !open && "collapsed")}>
      <div className="side-title">EXPLORE</div>
      {MENU.map(([id, label, Icon]) => (
        <button
          key={id}
          className={cn("nav-item", page === id && "active")}
          onClick={() => setPage(id)}
          title={label}
        >
          <Icon size={19} />
          <span>{label}</span>
        </button>
      ))}

      <div className="side-rule" />
      <div className="side-title">PLAYGROUNDS</div>
      {courses.map((c) => (
        <button
          key={c.id}
          className={cn("nav-item course-nav-item", page === "course" && courseId === c.id && "active")}
          onClick={() => openCourse(c.id)}
          title={c.label}
        >
          <span className="nav-dot" style={{ background: c.color }} />
          <span>{c.label}</span>
        </button>
      ))}

      <div className="sidebar-bottom">
        <CircleHelp size={17} />
        <span>Frontend-only preview</span>
      </div>
    </aside>
  );
}
