// Each student can choose a course accent without modifying course content or shared styles.
export function isHexColor(color) {
  return typeof color === 'string' && /^#[0-9a-fA-F]{6}$/.test(color);
}

export function selectedCourseColor(course, preferences = {}) {
  const saved = preferences && typeof preferences === 'object' ? preferences[course.id] : null;
  return isHexColor(saved) ? saved.toUpperCase() : course.color;
}

export function applyCourseColorPreferences(preferences, courses, root = document.documentElement) {
  for (const course of courses) {
    const variable = `--student-course-color-${course.id}`;
    const color = preferences && typeof preferences === 'object' ? preferences[course.id] : null;
    if (isHexColor(color)) root.style.setProperty(variable, color);
    else root.style.removeProperty(variable);
  }
}
