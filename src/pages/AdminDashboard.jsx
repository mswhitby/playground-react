import { useState } from "react";
import { ShieldCheck, RotateCcw } from "lucide-react";
import { seedStudents } from "../data/students.js";
import { useSaved } from "../hooks/useSaved.js";
import AccountsTab from "../components/teacher/AccountsTab.jsx";
import SectionTitle from "../components/ui/SectionTitle.jsx";
import Chip from "../components/ui/Chip.jsx";

/** Visual admin workspace only. Real role authorization is not connected. */
export default function AdminDashboard({ students, setStudents }) {
  const [sort, setSort] = useSaved("designlab:admin-sort","last");
  const [resetStatus, setResetStatus] = useState("");
  const patchStudent = (id,patch) =>
    setStudents(previous => previous.map(student => student.id===id?{...student,...patch}:student));

  return <div className="main-content teacher-screen admin-screen">
    <SectionTitle eyebrow="Global management · Frontend preview" actions={<Chip>Sample accounts only</Chip>}>
      Admin dashboard
    </SectionTitle>
    <p className="page-subtitle">
      <ShieldCheck size={16} aria-hidden="true"/> Account management is separate from class-specific teacher tools.
      This demo has no real accounts or admin permissions attached.
    </p>
    <div className="admin-actions">
      <button type="button" className="btn" onClick={() => {
        setStudents(seedStudents);
        setResetStatus("Fictional account records restored.");
      }}><RotateCcw size={15}/> Reset sample accounts</button>
      {resetStatus && <small role="status">{resetStatus}</small>}
    </div>
    <AccountsTab students={students} sort={sort} setSort={setSort} patchStudent={patchStudent}/>
  </div>;
}
