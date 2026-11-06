import { useMemo, useState } from "react";
import { getSection, sections } from "../data/sections.js";
import { seedStudents } from "../data/students.js";
import { weeks } from "../data/weeks.js";
import { useSaved } from "../hooks/useSaved.js";
import { sortStudent } from "../lib/students.js";
import Chip from "../components/ui/Chip.jsx";
import SectionTitle from "../components/ui/SectionTitle.jsx";
import TeacherToolbar from "../components/teacher/TeacherToolbar.jsx";
import TeacherTabs from "../components/teacher/TeacherTabs.jsx";
import ClassOverview from "../components/teacher/ClassOverview.jsx";
import TeacherCurriculum from "../components/teacher/TeacherCurriculum.jsx";
import AccountsTab from "../components/teacher/AccountsTab.jsx";
import SectionSetup from "../components/teacher/SectionSetup.jsx";
import JournalInbox from "../components/teacher/JournalInbox.jsx";

export default function TeacherDashboard({ students, setStudents, journalSubmissions }) {
  const [tab, setTab] = useSaved("designlab:teacher-tab", "overview");
  const [sectionId, setSectionId] = useSaved("designlab:section", "p1");
  const [sort, setSort] = useSaved("designlab:sort", "last");
  const [week, setWeek] = useSaved("designlab:week", weeks[0].key);
  const [expanded, setExpanded] = useState(null);

  const currentSection = getSection(sectionId) || sections[0];
  const sectionStudents = useMemo(
    () => students.filter((s) => s.sections.includes(sectionId)).sort((a, b) => sortStudent(a, b, sort)),
    [students, sectionId, sort],
  );

  const patchStudent = (id, patch) =>
    setStudents((previous) => previous.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  return (
    <div className="main-content teacher-screen">
      <SectionTitle eyebrow="Your classroom · Frontend preview" actions={<Chip>{tab === "curriculum" ? "Published CS1 content" : "Sample student data"}</Chip>}>
        Teacher dashboard
      </SectionTitle>
      <p className="page-subtitle">
        {tab === 'curriculum' ? 'Browse the published Computer Science I course and its lessons.' : 'Explore sample sections, student records, and weekly scores. No real student information is loaded.'}
      </p>

      <TeacherToolbar
        sectionId={sectionId}
        onSectionChange={(id) => {
          setSectionId(id);
          setExpanded(null);
        }}
        onReset={() => {
          setStudents(seedStudents);
          setExpanded(null);
        }}
      />
      <TeacherTabs
        tab={tab}
        onChange={(id) => {
          setTab(id);
          setExpanded(null);
        }}
      />

      {tab === "curriculum" && <TeacherCurriculum/>}
      {tab === "overview" && (
        <ClassOverview
          section={currentSection}
          students={sectionStudents}
          week={week}
          setWeek={setWeek}
          sort={sort}
          setSort={setSort}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      )}
      {tab === "journals" && <JournalInbox section={currentSection} students={sectionStudents} submissions={journalSubmissions} />}
      {tab === "accounts" && (
        <AccountsTab students={students} sort={sort} setSort={setSort} patchStudent={patchStudent} />
      )}
      {tab === "setup" && <SectionSetup students={students} />}
    </div>
  );
}
