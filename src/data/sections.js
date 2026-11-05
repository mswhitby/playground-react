// Fictional design-only data. Never import or paste real student information here.
export const sections = [
  { id: "p1", period: "1", name: "Period 1", course: "computer-science-1" },
  { id: "p3", period: "3", name: "Period 3", course: "computer-science-1" },
  { id: "p5", period: "5", name: "Period 5", course: "mobile-app-dev" },
  { id: "p6", period: "6", name: "Period 6", course: "game-programming" },
  { id: "p7", period: "7", name: "Period 7", course: "mobile-app-dev" },
  { id: "p8", period: "8", name: "Period 8", course: "computer-science-1" },
];

export const getSection = (id) => sections.find((s) => s.id === id);
export const getSectionPeriod = (id) => getSection(id)?.period;
/** Unique class periods, sorted numerically ("1", "3", "5", ...). */
export const periods = [...new Set(sections.map((s) => s.period))].sort((a, b) => Number(a) - Number(b));
