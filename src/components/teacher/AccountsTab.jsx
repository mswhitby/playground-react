import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getSectionPeriod, periods } from "../../data/sections.js";
import { useSaved } from "../../hooks/useSaved.js";
import { niceName, sortStudent } from "../../lib/students.js";
import Chip from "../ui/Chip.jsx";
import Empty from "../ui/Empty.jsx";
import SortSelect from "./SortSelect.jsx";
import AccountCard from "./AccountCard.jsx";

/** "Accounts" tab: search, filter by period, sort, and edit sample names. */
export default function AccountsTab({ students, sort, setSort, patchStudent }) {
  const [period, setPeriod] = useSaved("designlab:period-filter", "all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  const accounts = useMemo(() => {
    const q = search.toLowerCase();
    return students
      .filter(
        (s) =>
          (period === "all" || s.sections.some((id) => getSectionPeriod(id) === period)) &&
          [niceName(s), s.github, s.studentName].some((x) => x.toLowerCase().includes(q)),
      )
      .sort((a, b) => sortStudent(a, b, sort));
  }, [students, period, sort, search]);

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <h2>Accounts</h2>
          <p>Google Sheet name first, student-entered name second, then GitHub name.</p>
        </div>
        <Chip>{accounts.length} accounts</Chip>
      </div>

      <div className="filters">
        <label>
          <Search size={16} />{" "}
          <input
            aria-label="Search accounts"
            value={search}
            placeholder="Search name or GitHub username"
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label>
          Class period
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="all">All periods</option>
            {periods.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <SortSelect label="Sort" value={sort} onChange={setSort} />
      </div>

      <p className="info-text">
        Change a sample Sheet name to test precedence and fallback behavior. These edits are saved only in
        browser storage.
      </p>

      <div className="account-grid">
        {accounts.map((s) => (
          <AccountCard
            key={s.id}
            student={s}
            isEditing={editing === s.id}
            onToggleEdit={() => setEditing(editing === s.id ? null : s.id)}
            onDone={() => setEditing(null)}
            onPatch={(patch) => patchStudent(s.id, patch)}
          />
        ))}
      </div>
      {!accounts.length && <Empty>No accounts match those filters.</Empty>}
    </section>
  );
}
