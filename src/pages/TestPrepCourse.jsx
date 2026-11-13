import { useState } from 'react';
import { ArrowLeft, BookOpenCheck, CheckCircle2, ChevronLeft, ChevronRight, ExternalLink, FlaskConical, RotateCcw } from 'lucide-react';
import { useSaved } from '../hooks/useSaved.js';
import { testPrepTracks, findTestPrepTopic } from '../data/testPrepSamples.js';

function PracticeTopic({ selectedTopic, attempts, setAttempts, openCourse, completedLessons, onToggleLessonComplete }) {
  const { track, topic } = selectedTopic;
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [checked, setChecked] = useState(false);
  const question = topic.questions[index];
  const attempted = topic.questions.filter((item) => attempts[item.id] !== undefined).length;
  const isComplete = completedLessons.includes(topic.id);
  function nextQuestion(next) {
    setIndex(next);
    setChosen(null);
    setChecked(false);
  }
  function check() {
    if (chosen === null || checked) return;
    setChecked(true);
    setAttempts((current) => ({
      ...current, [question.id]: { chosen, correct: chosen === question.correct }
    }));
  }
  const isCorrect = chosen === question.correct;
  return <section className="test-prep-practice">
    <button type="button" className="test-prep-back" onClick={() => openCourse('test-prep')}>
      <ArrowLeft size={16} /> All Test Prep
    </button>
    <div className="surface-card test-prep-practice-header">
      <div className="eyebrow">{track.title} / {topic.title}</div>
      <h1>{topic.title}</h1>
      <p>{topic.description}</p>
      <p className="muted">Original sample questions only. Your practice results are not official exam scores.</p>
      <div className="test-prep-practice-meta">
        <span>{attempted} of {topic.questions.length} attempted</span>
        {isComplete && <span className="test-prep-complete"><CheckCircle2 size={16} /> Practiced</span>}
      </div>
    </div>
    <div className="surface-card test-prep-question">
      <div className="test-prep-question-top">
        <strong>Question {index + 1} of {topic.questions.length}</strong>
        <span className="muted">Practice / multiple choice</span>
      </div>
      <h2>{question.prompt}</h2>
      <fieldset className="test-prep-options" disabled={checked}>
        <legend className="sr-only">Choose your answer</legend>
        {question.options.map((option, i) => (
          <label key={i} className={'test-prep-option ' + (chosen === i ? 'selected ' : '') + (checked && i === question.correct ? 'correct' : '')}>
            <input type="radio" name={question.id} checked={chosen === i} onChange={() => setChosen(i)} />
            <span className="test-prep-letter">{String.fromCharCode(65 + i)}</span>
            <span>{option}</span>
          </label>
        ))}
      </fieldset>
      {checked && <div className={'test-prep-feedback ' + (isCorrect ? 'is-correct' : 'is-incorrect')} role="status">
        <strong>{isCorrect ? 'Correct!' : 'Review this answer'}</strong>
        <p>{question.explanation}</p>
      </div>}
      <div className="test-prep-actions">
        <button type="button" className="btn primary" disabled={chosen === null || checked} onClick={check}>Check answer</button>
        <button type="button" className="btn" onClick={() => { setChosen(null); setChecked(false); }}><RotateCcw size={14} /> Try again</button>
      </div>
    </div>
    <nav className="test-prep-topic-nav" aria-label="Sample question navigation">
      {index > 0 ? <button type="button" className="btn" onClick={() => nextQuestion(index - 1)}><ChevronLeft size={16}/> Previous</button> : <span />}
      {index < topic.questions.length - 1 ? <button type="button" className="btn" onClick={() => nextQuestion(index + 1)}>Next question <ChevronRight size={16}/></button> : <span />}
    </nav>
    {attempted === topic.questions.length && !isComplete && <div className="test-prep-completion surface-card">
      <span>You've attempted every sample in this subject.</span>
      <button type="button" className="btn primary" onClick={() => onToggleLessonComplete?.(topic.id)}>Mark topic practiced</button>
    </div>}
    <p className="test-prep-official">Need more questions? <a href={track.reference} target="_blank" rel="noreferrer">Visit official {track.title} preparation resources <ExternalLink size={13}/></a></p>
  </section>;
}

export default function TestPrepCourse({ lessonId, openCourse, completedLessons = [], onToggleLessonComplete }) {
  const [attempts, setAttempts] = useSaved('designlab:test-prep-sample-answers', {});
  const selectedTopic = lessonId ? findTestPrepTopic(lessonId) : null;
  return <div className="course-layout integrated-course" data-course="test-prep">
    <div className="course-main">
      <div className="course-breadcrumb">
        <button type="button" onClick={() => openCourse(null)}>All playgrounds</button>
        <ChevronRight size={14}/>
        {lessonId ? <><button type="button" onClick={() => openCourse('test-prep')}>Test Prep</button><ChevronRight size={14}/><span>{selectedTopic?.topic.title}</span></> : <span>Test Prep</span>}
      </div>
      {selectedTopic ? <PracticeTopic key={lessonId} selectedTopic={selectedTopic} attempts={attempts} setAttempts={setAttempts}
          openCourse={openCourse} completedLessons={completedLessons} onToggleLessonComplete={onToggleLessonComplete}/> :
        <div className="test-prep-hub">
          <header className="surface-card test-prep-hero">
            <div className="eyebrow">Test Prep / Self-study</div>
            <h1>Choose a test to prepare for</h1>
            <p>Study in short sessions, answer original sample questions, and review the reasoning behind each answer. No class code required.</p>
            <p className="muted">This is a preview. Practice history stays in this browser. No scores are sent to a teacher, and no official exam scores are predicted.</p>
          </header>
          <div className="test-prep-exams">
            <section className="surface-card test-prep-exam" data-exam="tsi">
              <div className="test-prep-exam-icon"><BookOpenCheck size={23}/></div>
              <div className="eyebrow">College readiness</div>
              <h2>TSI Math</h2>
              <p>Continue the existing TSIA2 math curriculum and diagnostic work without changing old lesson links.</p>
              <p className="test-prep-exam-meta">Existing course / classroom study</p>
              <button type="button" className="btn primary" onClick={() => openCourse('tsi-math')}>Open TSI Math <ChevronRight size={16}/></button>
            </section>
            {testPrepTracks.map((track) => {
              const total = track.topics.reduce((count, topic) => count + topic.questions.length, 0);
              const attempted = track.topics.reduce((count, topic) => count + topic.questions.filter((q) => attempts[q.id] !== undefined).length, 0);
              return <section className="surface-card test-prep-exam" data-exam={track.id} key={track.id}>
                <div className="test-prep-exam-icon">{track.id === 'act' ? <FlaskConical size={23}/> : <BookOpenCheck size={23}/>}</div>
                <div className="eyebrow">{track.subtitle}</div>
                <h2>{track.title}</h2>
                <p>{track.description}</p>
                <p className="test-prep-exam-meta">{track.topics.length} subjects · {attempted}/{total} samples attempted</p>
                <progress className="course-progress-track" value={attempted} max={total} aria-label={track.title + ' sample practice progress'} />
                <div className="test-prep-topic-links">
                  {track.topics.map((topic) => <button type="button" key={topic.id} onClick={() => openCourse('test-prep', topic.id)}>
                    <span>{topic.title}</span><ChevronRight size={15}/>
                  </button>)}
                </div>
                <button type="button" className="btn primary" onClick={() => openCourse('test-prep', track.topics[0].id)}>Start {track.title} samples <ChevronRight size={16}/></button>
              </section>;
            })}
          </div>
        </div>}
    </div>
  </div>;
}
