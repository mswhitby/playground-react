/** Display name precedence: Google Sheet name → student-entered name → GitHub username. */
export const niceName = (student) =>
  student.sheetName?.trim() || student.studentName?.trim() || student.github;

const nameParts = (s) => (s.sheetName || s.studentName || "").trim().split(/\s+/);

/** Comparator for sorting students by "first", "last" or "github". */
export const sortStudent = (a, b, sort) => {
  const field = (s) =>
    sort === "github"
      ? s.github.toLowerCase()
      : sort === "first"
        ? (nameParts(s)[0] || s.github).toLowerCase()
        : (nameParts(s).at(-1) || s.github).toLowerCase();
  return field(a).localeCompare(field(b), undefined, { numeric: true }) || a.github.localeCompare(b.github);
};

export const SORT_OPTIONS = [
  ["last", "Last name"],
  ["first", "First name"],
  ["github", "GitHub username"],
];
