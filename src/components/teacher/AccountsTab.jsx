import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getSectionPeriod, periods } from "../../data/sections.js";
import { useSaved } from "../../hooks/useSaved.js";
import { niceName, sortStudent } from "../../lib/students.js";
import { availableRosterPeriods } from "../../lib/rosterPeriods.js";
import Chip from "../ui/Chip.jsx";
import Empty from "../ui/Empty.jsx";
import SortSelect from "./SortSelect.jsx";
import AccountCard from "./AccountCard.jsx";

/** "Accounts" tab: search, filter by period, sort, and edit sample names. */
export default function AccountsTab({ students, sort, setSort, patchStudent, readOnlyMode = false, onRefresh, sheetDuplicateCount = 0 }) {
  const [period, setPeriod] = useSaved("designlab:period-filter", "all");
  const [show, setShow] = useSaved("designlab:account-filter", "all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const availablePeriods = useMemo(
    () => readOnlyMode ? availableRosterPeriods(students) : periods,
    [students,readOnlyMode]
  );
  const accounts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students
      .filter((s) => {
        const memberships=s.memberships||[];
        const enrolled=memberships.length>0;
        if(show==="enrolled"&&(s.kind!=="student"||!enrolled))return false;
        if(show==="unassigned"&&(s.kind!=="student"||enrolled))return false;
        if(show==="client"&&s.kind!=="client")return false;
        if(show==="without-sheet"&&s.sheetMatched)return false;
        if(period!=="all" && (readOnlyMode ? !(s.periods||[]).includes(period) : !s.sections.some((id)=>getSectionPeriod(id)===period)))return false;
        if(!q)return true;
        return [
          niceName(s),s.github,s.studentName,s.sheetName,
          ...(s.periods||[]),
          ...memberships.map(m=>m.name),
          ...memberships.map(m=>m.course_id)
        ].some(value=>String(value||"").toLowerCase().includes(q));
      })
      .sort((a, b) => sortStudent(a, b, sort));
  }, [students, period, show, sort, search, readOnlyMode]);

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <h2>Accounts</h2>
          <p>Teacher name, then connected Sheet, signup name, and GitHub fallback.</p>
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
          Show
          <select value={show} onChange={(e) => setShow(e.target.value)}>
            <option value="all">All accounts</option>
            <option value="enrolled">Enrolled students</option>
            <option value="unassigned">Unassigned students</option>
            <option value="client">Private clients</option>
            <option value="without-sheet">No Sheet match</option>
          </select>
        </label>
        <label>
          Class period
          <select value={availablePeriods.includes(period)?period:"all"} onChange={(e) => setPeriod(e.target.value)}>
            <option value="all">All periods</option>
            {availablePeriods.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <SortSelect label="Sort" value={sort} onChange={setSort} />
        {readOnlyMode&&<button type="button" className="btn secondary" onClick={onRefresh}>Refresh accounts</button>}
      </div>

      <p className="info-text">{readOnlyMode
        ? 'Authorized account directory · read-only. Sheet names and periods can be refreshed here; account and section edits remain disabled.'+(sheetDuplicateCount?(' '+sheetDuplicateCount+' duplicate Sheet GitHub '+(sheetDuplicateCount===1?'username was':'usernames were')+' skipped.'):'')
        : 'Sample account edits are saved only in browser storage.'}</p>

      <div className="account-grid">
        {accounts.map((s) => (
          <AccountCard
            key={s.id}
            student={s}
            isEditing={editing === s.id}
            onToggleEdit={() => setEditing(editing === s.id ? null : s.id)}
            onDone={() => setEditing(null)}
            onPatch={(patch) => patchStudent?.(s.id, patch)}
            readOnlyMode={readOnlyMode}
          />
        ))}
      </div>
      {!accounts.length && <Empty>No accounts match those filters.</Empty>}
    </section>
  );
}
