import { courseUnits } from './courseUnits.js';
import { testPrepUnits, testPrepLessonRecords } from './testPrepSamples.js';
import { liveCs1Lessons } from './liveCs1/index.js';
import { normalizeImportedOutline } from '../lib/courseContent.js';

const cs1Content = normalizeImportedOutline(liveCs1Lessons);
// Fictional design-only data. Never import or paste real student information here.
export const courses = [
  {
    id: "computer-science-1",
    units: cs1Content.units,
    lessonRecords: cs1Content.lessonRecords,
    language: "python",
    publishedContent: true,
    slug: "computer-science-1",
    label: "Computer Science I",
    short: "Python",
    glyph: "py",
    color: "#6366F1",
    description: "Build your problem-solving toolkit with Python.",
    lessons: cs1Content.lessons,
    topics: ["Variables", "Strings", "Formatting", "Conditions", "Lists"],
  },
  {
    id: "game-programming",
    units: courseUnits["game-programming"],
    slug: "game-programming",
    label: "Game Programming & Design",
    short: "C# · Unity",
    glyph: "C#",
    color: "#C052EB",
    description: "Make ideas playable with Unity and C#.",
    lessons: courseUnits["game-programming"].flatMap((unit) => unit.lessons),
    topics: ["C# Basics", "Rigidbody", "Colliders"],
  },
  {
    id: "mobile-app-dev",
    units: courseUnits["mobile-app-dev"],
    slug: "mobile-app-web",
    label: "Mobile App & Web",
    short: "React · JavaScript",
    glyph: "js",
    color: "#27BBD2",
    description: "Create useful websites and mobile applications.",
    lessons: courseUnits["mobile-app-dev"].flatMap((unit) => unit.lessons),
    topics: ["HTML", "CSS", "JavaScript", "React"],
  },
  {
    id: "capstone",
    units: courseUnits["capstone"],
    slug: "capstone",
    label: "Capstone",
    short: "Build for someone",
    glyph: "++",
    color: "#FF2D55",
    description: "Research a problem, prototype, and test a solution.",
    lessons: courseUnits["capstone"].flatMap((unit) => unit.lessons),
    topics: ["Research", "Prototype", "Pitch"],
  },
  {
    id: "uil",
    units: courseUnits["uil"],
    slug: "uil",
    label: "UIL Computer Science",
    short: "Java",
    glyph: "jv",
    color: "#FF9F0A",
    description: "Trace Java, explain your reasoning, and practice.",
    lessons: courseUnits["uil"].flatMap((unit) => unit.lessons),
    topics: ["Java", "Arrays", "Written", "Programming"],
  },
  {
    id: "test-prep",
    units: testPrepUnits,
    lessonRecords: testPrepLessonRecords,
    slug: "test-prep",
    label: "Test Prep",
    short: "TSI · ASVAB · SAT · ACT",
    glyph: "ex",
    color: "#15B7A3",
    description: "College readiness and military aptitude study, all in one place.",
    lessons: testPrepUnits.flatMap((unit) => unit.lessons),
    topics: ["TSI", "ASVAB", "SAT", "ACT"],
  },
  {
    id: "tsi-math",
    units: courseUnits["tsi-math"],
    slug: "tsi-math",
    label: "TSI Math Advisory",
    short: "Math · Open access",
    glyph: "ma",
    color: "#30C85A",
    description: "Quantitative reasoning and algebra practice.",
    lessons: courseUnits["tsi-math"].flatMap((unit) => unit.lessons),
    topics: ["Percents", "Ratios", "Equations"],
  },

];

export const getCourse = (id) => courses.find((c) => c.id === id);
export const getCourseLabel = (id) => getCourse(id)?.label;
