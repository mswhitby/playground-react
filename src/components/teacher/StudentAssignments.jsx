import { Fragment, useState } from "react";
import { niceName } from "../../lib/students.js";
import Chip from "../ui/Chip.jsx";

const statusTone = (status) =>
  status.includes("Completed") ? "success" : status === "Needs revision" ? "warning" : "";

/** Expanded roster row: one student's assignment history. */
export default function StudentAssignments({ student, week }) {
  const [openReceipt, setOpenReceipt] = useState(null);
  const entries = student.assignments;
  const completed = entries.filter(
    (x) => x.status === "Completed" || x.status === "Practice completed",
  ).length;
  const graded = entries.filter((x) => x.score !== null).length;

  return (
    <div className="expanded-student">
      <div className="expanded-header">
        <div>
          <h3>Assignment history</h3>
          <p className="muted">Sample records for {niceName(student)}. No student data is loaded.</p>
        </div>
        <Chip tone="success">{student.weekly[week] || 0} verified pts this week</Chip>
      </div>

      <div className="mini-stats">
        <span>
          <strong>{completed}</strong> completed
        </span>
        <span>
          <strong>{graded}</strong> graded
        </span>
        <span>
          <strong>{entries.length}</strong> tracked
        </span>
      </div>

      <div className="overflow">
        <table className="data-table assignment-table">
          <thead>
            <tr>
              <th>Assignment</th>
              <th>Status</th>
              <th>Score</th>
              <th>Updated</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((a) => {
              const isOpen = openReceipt === a.id;
              return (
                <Fragment key={a.id}>
                  <tr>
                    <th>
                      {a.name}
                      <small>{a.type}</small>
                    </th>
                    <td>
                      <Chip tone={statusTone(a.status)}>{a.status}</Chip>
                    </td>
                    <td>{a.score === null ? "—" : `${a.score} / ${a.possible}`}</td>
                    <td>{a.submitted}</td>
                    <td>
                      <button className="small-link" onClick={() => setOpenReceipt(isOpen ? null : a.id)}>
                        {isOpen ? "Hide details" : "View details"}
                      </button>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="receipt-preview">
                      <td colSpan="5">
                        <strong>Sample assignment detail</strong>
                        <p>
                          This is a mock submitted-copy preview for layout testing, not the student's actual
                          code.
                        </p>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
