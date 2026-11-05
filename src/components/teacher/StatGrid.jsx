export default function StatGrid({ students }) {
  const stats = [
    [students.length, "Enrolled students"],
    [students.filter((s) => s.status === "Active now").length, "Recently interacting"],
    [students.filter((s) => s.sheetName).length, "Sheet names matched"],
  ];
  return (
    <div className="stat-grid">
      {stats.map(([value, label]) => (
        <div className="stat-card" key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
