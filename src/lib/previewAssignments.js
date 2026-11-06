/**
 * Draft assignment settings for the React design preview.
 * These are never sent to live classes or grading APIs.
 */
export function previewAssignmentId(sectionId, lessonId) {
  return sectionId + '::' + lessonId;
}

export function validatePreviewAssignment(input, sectionStudents = []) {
  if (!input?.sectionId || !input.lessonId) return 'Choose a section and lesson.';
  if (input.sectionCourseId && input.sectionCourseId !== 'computer-science-1') {
    return 'This section uses a different course. Only Computer Science I is connected.';
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.dueDate || '')) return 'Choose a valid due date.';
  const [year, month, day] = input.dueDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.toISOString().slice(0,10) !== input.dueDate) return 'Choose a valid due date.';
  const points = Number(input.points);
  if (!Number.isFinite(points) || !Number.isInteger(points) || points < 0 || points > 1000) {
    return 'Points must be a whole number between 0 and 1,000.';
  }
  if (input.scope !== 'section' && input.scope !== 'selected') return 'Choose who receives the assignment.';
  if (input.scope === 'selected') {
    const valid = new Set(sectionStudents.map(student => student.id));
    const selected = [...new Set(input.studentIds || [])];
    if (!selected.length || selected.some(id => !valid.has(id))) {
      return 'Select at least one student from this section.';
    }
  }
  return null;
}

export function previewAssignment(input, sectionStudents = []) {
  const error = validatePreviewAssignment(input, sectionStudents);
  if (error) throw new Error(error);
  return {
    id: previewAssignmentId(input.sectionId,input.lessonId),
    sectionId: input.sectionId,
    courseId: 'computer-science-1',
    lessonId: input.lessonId,
    scope: input.scope,
    studentIds: input.scope === 'selected' ? [...new Set(input.studentIds)].sort() : [],
    dueDate: input.dueDate,
    points: Number(input.points),
  };
}

export function upsertPreviewAssignment(assignments, record) {
  return [...(Array.isArray(assignments)?assignments:[]).filter(a => a.id !== record.id), record];
}

export function matchingPreviewAssignment(assignments, sectionId, lessonId) {
  return (assignments || []).find(a => a.id === previewAssignmentId(sectionId, lessonId)) || null;
}
