import { lessons as previewLessons } from '../data/lessons.js';

/**
 * Keep identifiers separate from visible names. Published lessons can have
 * nested IDs (e.g. "02-values-and-variables/01-meet-variables") and titles
 * with punctuation, spaces and mixed casing.
 */
export function lessonIdOf(entry) {
  if (typeof entry === 'string') return entry;
  return typeof entry?.id === 'string' ? entry.id : '';
}

export function unitTitleOf(unit) {
  return String(unit?.title || unit?.unitName || unit?.name || 'Lessons');
}

export function unitNumberOf(unit, fallback = 1) {
  const value = unit?.number ?? unit?.unit ?? fallback;
  return value;
}

export function lessonIdsOf(unit) {
  return (unit?.lessons || []).map(lessonIdOf).filter(Boolean);
}

export function courseLessonIds(course) {
  if (Array.isArray(course?.units)) return course.units.flatMap(lessonIdsOf);
  return Array.isArray(course?.lessons) ? course.lessons.map(lessonIdOf).filter(Boolean) : [];
}

export function lessonInCourse(course, id) {
  return (course?.units || []).some(unit => lessonIdsOf(unit).includes(id));
}

export function getCourseLesson(course, id, registry = previewLessons) {
  if (!id) return null;
  const unit = (course?.units || []).find(section => lessonIdsOf(section).includes(id));
  const entry = (unit?.lessons || []).find(item => lessonIdOf(item) === id);
  const imported = (typeof entry === 'object' && entry) || unit?.lessonMeta?.[id] || course?.lessonRecords?.[id] || {};
  const known = registry?.[id] || {};
  const title = String(imported.title || imported.name || known.title || id.split('/').at(-1));
  return {
    ...known,
    ...imported,
    id,
    title,
    kind: imported.kind || known.kind || 'Lesson',
    difficulty: imported.difficulty || known.difficulty || '',
    points: imported.points ?? known.points ?? null,
    language: imported.language || known.language || course?.language || 'text',
    challenge: imported.challenge || imported.summary || known.challenge || '',
    starter: imported.starter || known.starter || '',
    console: known.console || '',
    // Only actual preview lesson records have a working student editor.
    ready: Boolean(registry?.[id]),
  };
}

export function lessonTitleOf(course, id, registry = previewLessons) {
  return getCourseLesson(course, id, registry)?.title || '';
}

/**
 * Adapter for the existing repositories. It accepts:
 * - Computer Science I's flat rows with unit, unitName, lesson, title
 * - Game Programming's nested units/lessons
 * - Mobile App and UIL's flat lesson lists
 *
 * This does not change any published lesson IDs or source files.
 */
export function normalizeImportedOutline(source) {
  const input = Array.isArray(source) ? {lessons: source} : source || {};
  const records = new Map();
  const seen = new Set();
  const units = [];

  const addUnit = (id, title, description, number) => {
    const key = String(id);
    let unit = units.find(item => item.id === key);
    if (!unit) {
      unit = {id: key, title: String(title || 'Lessons'), description: String(description || ''), number, lessons: []};
      units.push(unit);
    }
    return unit;
  };
  const append = (unit, entry) => {
    const id = lessonIdOf(entry);
    if (!id || seen.has(id)) return;
    seen.add(id);
    unit.lessons.push(id);
    records.set(id, typeof entry === 'string' ? {id} : {...entry});
  };

  if (Array.isArray(input.units)) {
    input.units.forEach((raw, index) => {
      const unit = addUnit(raw.id || `unit-${index+1}`, unitTitleOf(raw), raw.description || raw.summary, unitNumberOf(raw,index+1));
      (raw.lessons || []).forEach(lesson => append(unit,lesson));
    });
  } else if (Array.isArray(input.lessons)) {
    input.lessons.forEach((entry, index) => {
      if (!entry || !lessonIdOf(entry)) return;
      const number = entry.unit || null;
      const slash = lessonIdOf(entry).indexOf('/');
      const groupId = number != null
        ? (slash >= 0 ? lessonIdOf(entry).slice(0,slash) : `unit-${number}`)
        : entry.competency ? `topic-${String(entry.competency).toLowerCase().replace(/[^a-z0-9]+/g,'-')}` : 'lessons';
      const title = entry.unitName || entry.competency || 'Lessons';
      const unit = addUnit(groupId,title,'',number ?? units.length+1);
      append(unit,entry);
    });
    // Keep the source's published order; it is often intentionally sequenced.
  }
  return {units, lessonRecords: Object.fromEntries(records), lessons: units.flatMap(lessonIdsOf)};
}
