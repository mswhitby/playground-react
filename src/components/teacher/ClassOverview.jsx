import SectionBanner from "./SectionBanner.jsx";
import StatGrid from "./StatGrid.jsx";
import WeeklyPointsPanel from "./WeeklyPointsPanel.jsx";
import RosterPanel from "./RosterPanel.jsx";

/** "Class overview" tab: section banner, stats, weekly points and the expandable roster. */
export default function ClassOverview({
  section,
  students,
  week,
  setWeek,
  sort,
  setSort,
  expanded,
  setExpanded,
}) {
  return (
    <>
      <SectionBanner section={section} />
      <StatGrid students={students} />
      <WeeklyPointsPanel students={students} week={week} setWeek={setWeek} />
      <RosterPanel
        students={students}
        week={week}
        sort={sort}
        setSort={setSort}
        expanded={expanded}
        setExpanded={setExpanded}
      />
    </>
  );
}
