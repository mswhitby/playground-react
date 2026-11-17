// Use the published CS1 challenge contracts packaged by the canonical Playground.
// No private solutions, hidden tests, sample students, or fake grades belong here.
export const PYTHON_ONLY_NOTICE = 'Python challenges are available now. More languages are coming later.';

export function publishedCs1Challenges(course) {
  if (!Array.isArray(course?.challenges)) return [];
  return course.challenges
    .filter(row => row && typeof row.id === 'string' && typeof row.starter === 'string' &&
      Array.isArray(row.examples) && row.examples.length > 0 &&
      row.examples.every(sample => typeof sample.call === 'string' && typeof sample.expected === 'string'))
    // Explicit student-safe allowlist, never spread arbitrary curriculum fields.
    .map(row => ({
      id: row.id,
      title: String(row.title || row.id),
      difficulty: String(row.difficulty || 'Easy'),
      points: Number(row.points) || 0,
      scenario: String(row.scenario || ''),
      parameters: String(row.parameters || ''),
      behavior: String(row.behavior || ''),
      starter: row.starter,
      examples: row.examples.map(sample => ({call:sample.call,expected:sample.expected})),
      skills: typeof row.skills === 'string' ? row.skills : null,
      source: 'published-cs1',
      summary: String(row.scenario || ''),
      tags: Array.isArray(row.topics) ? row.topics.filter(tag=>typeof tag==='string') : [],
      suggestedCourses: ['computer-science-1'],
      languages: ['python'],
      prerequisites: [],
    }))
    .sort((a,b) => a.title.localeCompare(b.title));
}

export function filterPublishedCs1Challenges(catalog,{query='',topic='all',difficulty='all',course='all',language='all'}={}) {
  const q = query.trim().toLocaleLowerCase();
  return catalog.filter(item =>
    (!q || [item.title,item.summary,...item.tags].join(' ').toLocaleLowerCase().includes(q)) &&
    (topic === 'all' || item.tags.includes(topic)) &&
    (difficulty === 'all' || item.difficulty === difficulty) &&
    (course === 'all' || item.suggestedCourses.includes(course)) &&
    (language === 'all' || item.languages.includes(language)));
}

export function cs1ChallengeStatement(item) {
  if (!item || item.source !== 'published-cs1') return '';
  const behavior = String(item.behavior || '')
    .replace(/\[Review the optional skills guide\]\(skills\.md\)/g,'See the optional skills guide below.');
  const examples = (item.examples || []).map((row,index) =>
    '### Example ' + (index+1) + '\n\n```python\n' + row.call + '\n# Expected: ' + row.expected + '\n```').join('\n\n');
  return [
    '## Scenario',item.scenario || '',
    '## Parameters',item.parameters || '',
    '## Required behavior',behavior,
    '## Published examples',examples,
    item.skills ? '## Optional skills guide\n\n' + item.skills : '',
  ].filter(Boolean).join('\n\n');
}

// Old CS1 challenge drafts used this stable namespace. Preserve it across UIs.
export function cs1ChallengeDraftKey(id) {
  return 'cs1:challenges:2026-10-26:draft:' + id;
}
