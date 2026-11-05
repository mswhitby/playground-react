import { useMemo } from "react";
import { weeks } from "../../data/weeks.js";
import { niceName } from "../../lib/students.js";

/** Students ranked by verified points for the selected week. */
export default function WeeklyPointsPanel({ students, week, setWeek }) {
  const ranked = useMemo(
    () => [...students].sort((a, b) => (b.weekly[week] || 0) - (a.weekly[week] || 0)),
    [students, week],
  );

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <h2>Weekly points</h2>
          <p>Mock verified points · Monday–Sunday in Central Time</p>
        </div>
        <label>
          Week
          <select value={week} onChange={(e) => setWeek(e.target.value)}>
            {weeks.map((w) => (
              <option key={w.key} value={w.key}>
                {w.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="overflow">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Weekly points</th>
              <th>Sample assignments</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((s) => (
              <tr key={s.id}>
                <th>
                  {niceName(s)}
                  <small>@{s.github}</small>
                </th>
                <td>
                  <strong>{s.weekly[week] || 0}</strong>
                </td>
                <td>{s.assignments.filter((a) => a.score !== null).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
