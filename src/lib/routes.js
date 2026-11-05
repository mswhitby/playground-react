import { courses, getCourse } from '../data/courses.js';

// URLs remain the source of truth, even with localStorage UI preferences.
const viteBase = import.meta.env?.BASE_URL || '/';
const basePrefix = viteBase === '/' ? '' : '/' + viteBase.replace(/^\/+|\/+$/g, '');
const withBase = (path) => `${basePrefix}${path}` || '/';

export const homePath = () => withBase('/');
export const teacherPath = () => withBase('/teacher');
export const journalsPath = () => withBase('/journals');

export function playgroundPath(courseOrId, lessonId) {
  const course = typeof courseOrId === 'string' ? getCourse(courseOrId) : courseOrId;
  if (!course) return homePath();
  const base = `/playgrounds/${encodeURIComponent(course.slug)}`;
  return withBase(lessonId ? `${base}/lessons/${encodeURIComponent(lessonId)}` : base);
}

export function resolveRoute(pathname) {
  const incoming = pathname.replace(/\/+$/, '') || '/';
  const base = basePrefix || '';
  if (base && incoming !== base && !incoming.startsWith(base + '/')) return { page: 'not-found' };
  const relative = incoming.slice(base.length) || '/';
  if (relative === '/') return { page: 'home' };
  if (relative === '/teacher') return { page: 'teacher' };
  if (relative === '/journals') return { page: 'journals' };

  const segments = relative.split('/').filter(Boolean);
  if (segments[0] !== 'playgrounds' || ![2, 4].includes(segments.length)) return { page: 'not-found' };

  let slug, lessonId;
  try {
    slug = decodeURIComponent(segments[1]);
    lessonId = segments.length === 4 ? decodeURIComponent(segments[3]) : undefined;
  } catch { return { page: 'not-found' }; }
  const course = courses.find((item) => item.slug === slug);
  if (!course || (segments.length === 4 && segments[2] !== 'lessons')) return { page: 'not-found' };
  if (lessonId && !course.lessons.includes(lessonId)) return { page: 'not-found' };
  return { page: 'course', courseId: course.id, lessonId: lessonId ?? null };
}
