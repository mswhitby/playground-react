import { Fragment } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { niceName } from "../../lib/students.js";
import Chip from "../ui/Chip.jsx";
import SortSelect from "./SortSelect.jsx";
import StudentAssignments from "./StudentAssignments.jsx";

/** Section roster; clicking a name expands that student's assignments inline. */
export default function RosterPanel({ students, week, sort, setSort, expanded, setExpanded }) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <h2>Section roster & activity</h2>
          <p>Click a student's name to expand their assignments directly inside the roster.</p>
        </div>
        <SortSelect label="Sort students by" value={sort} onChange={setSort} />
      </div>
      <div className="overflow">
        <table className="data-table roster-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Activity signal</th>
              <th>Current activity</th>
              <th>Practice</th>
              <th>Hand-ins</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const isOpen = expanded === s.id;
              return (
                <Fragment key={s.id}>
                  <tr className={isOpen ? "selected-row" : ""}>
                    <th>
                      <button
                        className="student-name-button"
                        aria-expanded={isOpen}
                        onClick={() => setExpanded(isOpen ? null : s.id)}
                      >
                        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />} {niceName(s)}
                      </button>
                      <small>
                        @{s.github}
                        {s.sections.length > 1 ? " · Sheet periods 1, 3" : ""}
                      </small>
                    </th>
                    <td>
                      <Chip tone={s.status === "Active now" ? "success" : ""}>{s.status}</Chip>
                    </td>
                    <td>{s.current}</td>
                    <td>{s.assignments.filter((a) => a.status.includes("Completed")).length} complete</td>
                    <td>{s.assignments.filter((a) => a.score !== null).length}</td>
                  </tr>
                  {isOpen && (
                    <tr className="expansion-row">
                      <td colSpan="5">
                        <StudentAssignments student={s} week={week} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
