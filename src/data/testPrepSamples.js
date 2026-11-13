// Original, fictional sample items for a local React design preview.
// Not official ASVAB, SAT, ACT, or TSIA2 questions or score predictions.
export const testPrepTracks = [
  {
    "id": "asvab",
    "title": "ASVAB",
    "subtitle": "Military aptitude",
    "description": "Start with the four AFQT subjects; technical subtests can be added later.",
    "reference": "https://www.officialasvab.com/applicants/sample-questions/",
    "topics": [
      {
        "id": "asvab-ar",
        "title": "Arithmetic Reasoning",
        "description": "Use math to solve everyday word problems.",
        "questions": [
          {
            "id": "asvab-ar-sample-01",
            "prompt": "A supply team divides 96 bolts equally among 8 tool kits. How many bolts go into each kit?",
            "options": [
              "8",
              "10",
              "12",
              "16"
            ],
            "correct": 2,
            "explanation": "Divide 96 by 8. Each tool kit receives 12 bolts."
          },
          {
            "id": "asvab-ar-sample-02",
            "prompt": "A delivery vehicle travels 180 miles in 3 hours at a steady speed. What is its average speed?",
            "options": [
              "45 mph",
              "60 mph",
              "75 mph",
              "90 mph"
            ],
            "correct": 1,
            "explanation": "Average speed equals distance divided by time: 180 ÷ 3 = 60 mph."
          }
        ]
      },
      {
        "id": "asvab-wk",
        "title": "Word Knowledge",
        "description": "Practice synonyms and vocabulary in context.",
        "questions": [
          {
            "id": "asvab-wk-sample-01",
            "prompt": "In the sentence \"The technician was meticulous when checking each connection,\" meticulous most nearly means:",
            "options": [
              "hurried",
              "careful",
              "uninterested",
              "unprepared"
            ],
            "correct": 1,
            "explanation": "Meticulous describes someone who gives careful attention to detail."
          },
          {
            "id": "asvab-wk-sample-02",
            "prompt": "The word \"scarce\" most nearly means:",
            "options": [
              "plentiful",
              "fragile",
              "limited",
              "unusual"
            ],
            "correct": 2,
            "explanation": "If something is scarce, there is not much of it available."
          }
        ]
      },
      {
        "id": "asvab-pc",
        "title": "Paragraph Comprehension",
        "description": "Identify main ideas and supporting details.",
        "questions": [
          {
            "id": "asvab-pc-sample-01",
            "prompt": "Passage: The neighborhood library added Saturday hours because weekday attendance had increased. Staff hope the extra day will help working families visit. Why did the library extend its schedule?",
            "options": [
              "To replace weekday hours",
              "To make visits easier for more people",
              "To reduce staff",
              "To host only weekend events"
            ],
            "correct": 1,
            "explanation": "The passage says Saturday hours respond to demand and help working families visit."
          },
          {
            "id": "asvab-pc-sample-02",
            "prompt": "Passage: Before using the lab, workers inspect equipment, record damaged items, and report problems. This routine helps prevent interruptions and injuries. What is the main purpose of the routine?",
            "options": [
              "Improving safety and reliability",
              "Making the lab look new",
              "Reducing all written records",
              "Increasing equipment costs"
            ],
            "correct": 0,
            "explanation": "The checklist catches problems early and lowers risk to people and equipment."
          }
        ]
      },
      {
        "id": "asvab-mk",
        "title": "Mathematics Knowledge",
        "description": "Review algebra, geometry, and number sense.",
        "questions": [
          {
            "id": "asvab-mk-sample-01",
            "prompt": "Solve for x: 3(x − 2) = 15.",
            "options": [
              "3",
              "5",
              "7",
              "9"
            ],
            "correct": 2,
            "explanation": "Divide by 3: x − 2 = 5. Add 2: x = 7."
          },
          {
            "id": "asvab-mk-sample-02",
            "prompt": "What is the area of a triangle with a base of 10 units and a height of 7 units?",
            "options": [
              "17 square units",
              "35 square units",
              "70 square units",
              "140 square units"
            ],
            "correct": 1,
            "explanation": "Triangle area is one-half times base times height: (10 × 7) ÷ 2 = 35."
          }
        ]
      }
    ]
  },
  {
    "id": "sat",
    "title": "SAT",
    "subtitle": "Digital SAT",
    "description": "Practice the Reading and Writing and Math sections. These samples are not adaptive and do not produce SAT scores.",
    "reference": "https://satsuite.collegeboard.org/sat/practice-preparation",
    "topics": [
      {
        "id": "sat-rw",
        "title": "Reading and Writing",
        "description": "Interpret short passages, revise sentences, and choose transitions.",
        "questions": [
          {
            "id": "sat-rw-sample-01",
            "prompt": "Choose the best transition: \"Maya planned to bike to school. _____, heavy rain forced her to take the bus.\"",
            "options": [
              "For example",
              "However",
              "Similarly",
              "Therefore"
            ],
            "correct": 1,
            "explanation": "However signals the contrast between Maya's plan and what happened."
          },
          {
            "id": "sat-rw-sample-02",
            "prompt": "Choose the grammatically correct sentence.",
            "options": [
              "Each of the notebooks have a label.",
              "Each of the notebooks has a label.",
              "Each of the notebooks are labeled.",
              "Each of the notebook have labels."
            ],
            "correct": 1,
            "explanation": "The subject each is singular, so it takes has."
          }
        ]
      },
      {
        "id": "sat-math",
        "title": "Math",
        "description": "Use algebra and problem-solving strategies.",
        "questions": [
          {
            "id": "sat-math-sample-01",
            "prompt": "If f(x) = 2x + 5, what is f(4)?",
            "options": [
              "9",
              "11",
              "13",
              "18"
            ],
            "correct": 2,
            "explanation": "Substitute 4 for x: f(4) = 2(4) + 5 = 13."
          },
          {
            "id": "sat-math-sample-02",
            "prompt": "If 2x + y = 11 and y = 3, what is x?",
            "options": [
              "3",
              "4",
              "5",
              "7"
            ],
            "correct": 1,
            "explanation": "Replace y with 3: 2x + 3 = 11, so 2x = 8 and x = 4."
          }
        ]
      }
    ]
  },
  {
    "id": "act",
    "title": "ACT",
    "subtitle": "Enhanced ACT",
    "description": "Practice English, Math, Reading, and optional Science using the updated ACT structure.",
    "reference": "https://www.act.org/content/act/en/products-and-services/the-act/test-preparation/act-exam-sections-and-structure.html",
    "topics": [
      {
        "id": "act-english",
        "title": "English",
        "description": "Revise sentences for grammar and clarity.",
        "questions": [
          {
            "id": "act-english-sample-01",
            "prompt": "Choose the correct verb: \"The team of engineers _____ ready to begin.\"",
            "options": [
              "are",
              "is",
              "were",
              "have"
            ],
            "correct": 1,
            "explanation": "The singular subject team takes the singular verb is."
          },
          {
            "id": "act-english-sample-02",
            "prompt": "Choose the correctly punctuated sentence.",
            "options": [
              "After the storm the street was quiet.",
              "After the storm, the street was quiet.",
              "After, the storm the street was quiet.",
              "After the storm the, street was quiet."
            ],
            "correct": 1,
            "explanation": "An introductory phrase is commonly followed by a comma."
          }
        ]
      },
      {
        "id": "act-math",
        "title": "Math",
        "description": "Practice algebra, geometry, and problem solving.",
        "questions": [
          {
            "id": "act-math-sample-01",
            "prompt": "What is the slope of the line through (2, 1) and (6, 9)?",
            "options": [
              "1",
              "2",
              "4",
              "8"
            ],
            "correct": 1,
            "explanation": "Slope = change in y ÷ change in x = (9 − 1) ÷ (6 − 2) = 8 ÷ 4 = 2."
          },
          {
            "id": "act-math-sample-02",
            "prompt": "A rectangle measures 8 inches by 5 inches. What is its perimeter?",
            "options": [
              "13 inches",
              "26 inches",
              "40 inches",
              "80 inches"
            ],
            "correct": 1,
            "explanation": "Perimeter = 2(length + width) = 2(8 + 5) = 26 inches."
          }
        ]
      },
      {
        "id": "act-reading",
        "title": "Reading",
        "description": "Find key details and reasonable inferences.",
        "questions": [
          {
            "id": "act-reading-sample-01",
            "prompt": "Passage: Lena repaired an old bicycle rather than buy a new one. She replaced the chain and adjusted the brakes so she could use it to commute. Which statement is supported?",
            "options": [
              "Lena sold the bike.",
              "Lena intends to ride the repaired bike.",
              "Lena cannot fix brakes.",
              "Lena purchased a new bike."
            ],
            "correct": 1,
            "explanation": "The passage explicitly says Lena repaired the bike to use it for commuting."
          },
          {
            "id": "act-reading-sample-02",
            "prompt": "Passage: Residents created a neighborhood garden on an empty lot. Volunteers donated seeds, installed raised beds, and shared the harvest. What best describes the project?",
            "options": [
              "A commercial farm run by one company",
              "A volunteer project that benefits neighbors",
              "A plan to close the lot permanently",
              "An indoor science experiment"
            ],
            "correct": 1,
            "explanation": "The volunteers worked together on a shared garden and harvest."
          }
        ]
      },
      {
        "id": "act-science",
        "title": "Science (optional)",
        "description": "Interpret experimental results, charts, and evidence.",
        "questions": [
          {
            "id": "act-science-sample-01",
            "prompt": "In an experiment, a plant grew 2 cm at 10°C, 4 cm at 20°C, and 6 cm at 30°C over the same period. What pattern is shown?",
            "options": [
              "Growth decreases as temperature increases.",
              "Growth remains constant.",
              "Growth increases with temperature in these trials.",
              "Temperature has no measurable relationship."
            ],
            "correct": 2,
            "explanation": "The recorded growth rises from 2 to 4 to 6 cm as temperature increases across these trials."
          },
          {
            "id": "act-science-sample-02",
            "prompt": "Two identical seedlings get the same light and water. One receives fertilizer and the other does not. Which variable is intentionally changed?",
            "options": [
              "Amount of light",
              "Amount of water",
              "Type of plant",
              "Use of fertilizer"
            ],
            "correct": 3,
            "explanation": "Fertilizer is the independent variable; the other conditions are kept the same."
          }
        ]
      }
    ]
  }
];

export const testPrepUnits = testPrepTracks.map((track) => ({
  id: track.id,
  title: track.title,
  description: track.description,
  lessons: track.topics.map((topic) => topic.id),
}));

export const testPrepLessonRecords = Object.fromEntries(testPrepTracks.flatMap((track) =>
  track.topics.map((topic) => [topic.id, {
    id: topic.id, title: topic.title, summary: topic.description, language: 'text',
    kind: 'Sample practice', trackId: track.id
  }])
));

export const findTestPrepTopic = (id) => {
  for (const track of testPrepTracks) {
    const topic = track.topics.find((item) => item.id === id);
    if (topic) return { track, topic };
  }
  return null;
};

export const testPrepQuestionCount = testPrepTracks.reduce((sum, track) =>
  sum + track.topics.reduce((subtotal, topic) => subtotal + topic.questions.length, 0), 0);
