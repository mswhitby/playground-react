import { courseLessonIds } from './courseContent.js';
// Only student-marked lessons count toward the local preview's progress.
export function isLessonComplete(id, completedLessons = []) {
  return Array.isArray(completedLessons) && completedLessons.includes(id);
}

export function courseProgress(course, completedLessons = []) {
  const ids = courseLessonIds(course);
  const completed = ids.filter(id => isLessonComplete(id, completedLessons)).length;
  return {
    completed,
    total: ids.length,
    percent: ids.length ? Math.round((completed / ids.length) * 100) : 0,
  };
}

export function toggleLessonComplete(completedLessons, id) {
  const previous = Array.isArray(completedLessons) ? completedLessons : [];
  return previous.includes(id)
    ? previous.filter(value => value !== id)
    : [...previous, id];
}
