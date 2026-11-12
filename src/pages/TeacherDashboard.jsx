import { useMemo, useState } from "react";
import { getSection, sections } from "../data/sections.js";
import { weeks } from "../data/weeks.js";
import { useSaved } from "../hooks/useSaved.js";
import { sortStudent } from "../lib/students.js";
import Chip from "../components/ui/Chip.jsx";
import SectionTitle from "../components/ui/SectionTitle.jsx";
import TeacherToolbar from "../components/teacher/TeacherToolbar.jsx";
import TeacherTabs from "../components/teacher/TeacherTabs.jsx";
import ClassOverview from "../components/teacher/ClassOverview.jsx";
import TeacherCurriculum from "../components/teacher/TeacherCurriculum.jsx";
import SectionSetup from "../components/teacher/SectionSetup.jsx";
import JournalInbox from "../components/teacher/JournalInbox.jsx";

/** All teacher tabs concern one selected class. Account management lives in Admin. */
export default function TeacherDashboard({ students, journalSubmissions }) {
  const [tab, setTab] = useSaved("designlab:teacher-tab", "overview");
  const [sectionId, setSectionId] = useSaved("designlab:section", "p1");
  const [sort, setSort] = useSaved("designlab:sort", "last");
  const [week, setWeek] = useSaved("designlab:week", weeks[0].key);
  const [expanded, setExpanded] = useState(null);
  const [setupOpen, setSetupOpen] = useState(false);
  const [previewAssignments, setPreviewAssignments] = useSaved("designlab:teacher-preview-assignments", []);

  // Older preview versions persisted "accounts" or "setup" as a teacher tab.
  const activeTab = ["overview","curriculum","journals"].includes(tab) ? tab : "overview";
  const currentSection = getSection(sectionId) || sections[0];
  const sectionStudents = useMemo(
    () => students.filter(student => student.sections.includes(sectionId)).sort((a,b) => sortStudent(a,b,sort)),
    [students,sectionId,sort],
  );

  return <div className="main-content teacher-screen">
    <SectionTitle eyebrow="Your classroom · Frontend preview"
      actions={<Chip>{activeTab === "curriculum" ? "Real CS1 catalog · demo assignments" : "Sample student data"}</Chip>}>
      Teacher dashboard
    </SectionTitle>
    <p className="page-subtitle">
      {activeTab === "curriculum"
        ? "Browse published Computer Science I lessons and configure preview-only section assignments."
        : "Explore your class layout with fictional students. No real student information is loaded."}
    </p>

    <TeacherToolbar sectionId={currentSection.id}
      onSectionChange={id => {setSectionId(id);setExpanded(null);}}
      setupOpen={setupOpen} onToggleSetup={() => setSetupOpen(open => !open)}/>
    {setupOpen && <div id="teacher-section-setup"><SectionSetup students={students}/></div>}
    <TeacherTabs tab={activeTab} onChange={id => {setTab(id);setExpanded(null);}}/>

    {activeTab === "curriculum" && <TeacherCurriculum section={currentSection}
      students={sectionStudents} assignments={previewAssignments} setAssignments={setPreviewAssignments}/>}
    {activeTab === "overview" && <ClassOverview section={currentSection} students={sectionStudents}
      week={week} setWeek={setWeek} sort={sort} setSort={setSort}
      expanded={expanded} setExpanded={setExpanded}/>}
    {activeTab === "journals" && <JournalInbox section={currentSection}
      students={sectionStudents} submissions={journalSubmissions}/>}
  </div>;
}
