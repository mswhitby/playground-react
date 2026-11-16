import { Fragment, useState } from "react";
import { niceName } from "../../lib/students.js";
import Chip from "../ui/Chip.jsx";

const statusTone = (status) =>
  status.includes("Completed") ? "success" : status === "Needs revision" ? "warning" : "";

/** Expanded roster row: one student's assignment history. */
export default function StudentAssignments({ student, week, readOnlyMode = false }) {
  const [openReceipt, setOpenReceipt] = useState(null);
  const entries = student.assignments;
  const completed = entries.filter(
    (x) => x.status === "Completed" || x.status === "Practice completed",
  ).length;
  const graded = entries.filter((x) => x.score !== null).length;
  const weeklyGroups = Object.groupBy(entries, a => a.week || 'undated');
  const sortedWeeks = Object.keys(weeklyGroups).sort((a,b)=>b.localeCompare(a));
  const weekPoints = (key) => Number(student.weekly?.[key]) || 0;
  const dateLabel = key => {if(key==='undated')return 'Earlier / undated activity'; const start=new Date(key+'T12:00:00Z'); const end=new Date(start);end.setUTCDate(end.getUTCDate()+6);const fmt=d=>d.toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'UTC'});return fmt(start)+' – '+fmt(end)+', '+end.getUTCFullYear();};

  return (
    <div className="expanded-student">
      <div className="expanded-header">
        <div>
          <h3>Assignment history</h3>
          <p className="muted">{readOnlyMode ? `Verified submission history for ${niceName(student)}. Practice checks are not grades.` : `Sample records for ${niceName(student)}. No student data is loaded.`}</p>
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

      {(readOnlyMode ? sortedWeeks : ['all']).map(key => <details key={key} open={!readOnlyMode ? true : undefined} className={readOnlyMode?'panel':'assignment-history-all'} style={readOnlyMode?{marginTop:12,padding:12}:{}}><summary style={readOnlyMode?{cursor:'pointer',fontWeight:600}:{display:'none'}}>{dateLabel(key)} · {(weeklyGroups[key]||[]).filter(a=>a.status==='Completed'||a.status==='Practice completed').length} completed · {key==='undated'?'No weekly points':weekPoints(key)+' verified pts'}</summary><div className="overflow"><table className="data-table assignment-table">
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
            {(readOnlyMode ? weeklyGroups[key] : entries).map((a) => {
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
                        <strong>{readOnlyMode ? 'Submission details' : 'Sample assignment detail'}</strong>
                        <p>
                          {readOnlyMode ? 'Submitted code and protected receipts are not loaded in this read-only integration.' : "This is a mock submitted-copy preview for layout testing, not the student's actual code."}
                        </p>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table></div></details>)}
    </div>
  );
}
