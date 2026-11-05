import { weekStart } from '../lib/journals.js';

// Fictional demo submissions, never connected to actual students or teachers.
export const seedJournalSubmissions = [
  { id:'seed-journal-1', sectionId:'p1', studentId:'sample-2', studentName:'Jordan Brooks', courseId:'computer-science-1', week:weekStart(), type:'essay', response:'When I debug code, I first reproduce the problem and read the error carefully. Next I try one small change and test again. I keep notes so I can explain what fixed the problem and why.', aiUse:'none', aiDetails:'', submittedAt:new Date().toISOString() },
  { id:'seed-journal-2', sectionId:'p1', studentId:'sample-3', studentName:'Taylor Reed', courseId:'computer-science-1', week:weekStart(), type:'logic-puzzle', response:'The differences are 4, 6, 8, and 10. The next difference is 12, so the next number is 42. This also follows the pattern n(n+1), starting at n = 1.', aiUse:'none', aiDetails:'', submittedAt:new Date().toISOString() },
];
