// Each student can choose a course accent without modifying course content or shared styles.
export function isHexColor(color) {
  return typeof color === 'string' && /^#[0-9a-fA-F]{6}$/.test(color);
}

export function selectedCourseColor(course, preferences = {}) {
  const saved = preferences && typeof preferences === 'object' ? preferences[course.id] : null;
  return isHexColor(saved) ? saved.toUpperCase() : course.color;
}

/** Keep labels readable even when a student chooses a very dark or bright color. */
export function contrastTextForColor(color) {
  if (!isHexColor(color)) return '#101012';
  const channels = [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16) / 255)
    .map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  return luminance > 0.179 ? '#101012' : '#FFFFFF';
}

export function applyCourseColorPreferences(preferences, courses, root = document.documentElement) {
  for (const course of courses) {
    const variable = `--student-course-color-${course.id}`;
    const color = preferences && typeof preferences === 'object' ? preferences[course.id] : null;
    const inkVariable = `--student-course-ink-${course.id}`;
    if (isHexColor(color)) {
      root.style.setProperty(variable, color);
      root.style.setProperty(inkVariable, contrastTextForColor(color));
    } else {
      root.style.removeProperty(variable);
      root.style.removeProperty(inkVariable);
    }
  }
}
