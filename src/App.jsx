import { useCallback, useEffect, useMemo, useState } from 'react';
import { seedStudents } from './data/students.js';
import { seedJournalSubmissions } from './data/journalSubmissions.js';
import { courses, getCourse } from './data/courses.js';
import { applyCourseColorPreferences, isHexColor } from './lib/courseColors.js';
import { useSaved } from './hooks/useSaved.js';
import { toggleLessonComplete } from './lib/completion.js';
import { completionIds } from './lib/gradebook.js';
import { loadPublishedCourse } from './lib/publishedCourseLoader.js';
import { cn } from './lib/cn.js';
import { homePath, journalsPath, gradesPath, playgroundPath, challengesPath, challengePath, resolveRoute, teacherPath, adminPath, projectPath } from './lib/routes.js';
import Topbar from './components/layout/Topbar.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Footer from './components/layout/Footer.jsx';
import Home from './pages/Home.jsx';
import CoursePage from './pages/CoursePage.jsx';
import TeacherDashboard from './pages/TeacherDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Journals from './pages/Journals.jsx';
import Grades from './pages/Grades.jsx';
import ChallengeBank from './pages/ChallengeBank.jsx';
import ChallengeDetail from './pages/ChallengeDetail.jsx';

export default function App() {
  // Deep links and browser Back/Forward always win over stored UI preferences.
  const [route, setRoute] = useState(() => resolveRoute(window.location.pathname));
  const [lastCourse, setLastCourse] = useSaved('designlab:course', 'computer-science-1');
  const [theme, setTheme] = useSaved('designlab:theme', 'dark');
  const [courseColors, setCourseColors] = useSaved('designlab:course-colors', {});
  const [sidebarOpen, setSidebarOpen] = useSaved('designlab:sidebar', true);
  const [completedLessons, setCompletedLessons] = useSaved('designlab:completed-lessons', []);
  // All six courses now use published content or explicit unpublished placeholders.
  // Do not mix fictional grades or assignments into any migrated course.
  const grades = [];
  const courseAssignments = [];
  const completedWithGrades = completionIds(completedLessons,grades);
  const [publishedContent,setPublishedContent] = useState({});
  const [contentErrors,setContentErrors] = useState({});
  const [contentLoading,setContentLoading] = useState(true);
  const availableCourses = useMemo(() => courses.map(course => {
    if (course.id === 'computer-science-1' || course.id === 'test-prep') return course;
    if (course.id === 'capstone') return {...course,units:[],lessons:[],lessonRecords:{},
      publishedContent:false,projects:[]};
    const imported = publishedContent[course.id];
    return imported ? {...course,...imported,publishedContent:true}
      : {...course,units:[],lessons:[],lessonRecords:{},projects:[],
        contentLoadingError:contentErrors[course.id] || null};
  }),[publishedContent,contentErrors]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    Promise.all(['game-programming','mobile-app-dev','uil','tsi-math'].map(async courseId => {
      try {return {courseId, data:await loadPublishedCourse(courseId,{signal:controller.signal})};}
      catch(error){return {courseId,error:String(error?.message||error)};}
    })).then(results => {
      if (!active) return;
      const data = {}, errors = {};
      for (const record of results) {
        if (record.data) data[record.courseId] = record.data;
        else errors[record.courseId] = record.error;
      }
      setPublishedContent(data); setContentErrors(errors); setContentLoading(false);
    });
    return () => {active = false;controller.abort();};
  },[]);

  // Re-resolve published lesson and project deep links once their catalogs load.
  useEffect(() => {
    setRoute(resolveRoute(window.location.pathname,availableCourses));
  },[availableCourses]);
  const [students, setStudents] = useSaved('designlab:students', seedStudents);
  const [journalSubmissions, setJournalSubmissions] = useSaved('designlab:journal-submissions', seedJournalSubmissions);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    applyCourseColorPreferences(courseColors, courses);
  }, [courseColors]);

  function setCourseColor(courseId, value) {
    if (!courses.some(course => course.id === courseId) || !isHexColor(value)) return;
    setCourseColors(previous => ({
      ...(previous && typeof previous === 'object' ? previous : {}),
      [courseId]: value.toUpperCase()
    }));
  }

  function resetCourseColor(courseId) {
    setCourseColors(previous => {
      const next = { ...(previous && typeof previous === 'object' ? previous : {}) };
      delete next[courseId];
      return next;
    });
  }

  useEffect(() => {
    if (route.page === 'course') setLastCourse(route.courseId);
    const label = route.page === 'course'
      ? getCourse(route.courseId)?.label
      : route.page === 'admin' ? 'Admin dashboard' : route.page === 'teacher' ? 'Teacher dashboard' : route.page === 'grades' ? 'Grades' : route.page === 'journals' ? 'Weekly journals'
      : route.page === 'challenges' ? 'Challenge Bank' : route.page === 'challenge' ? 'Coding challenge' : 'Your playgrounds';
    document.title = `${label || 'Playground'} | Ms. Whitby's Playground — React Lab`;
  }, [route.page, route.courseId, setLastCourse]);

  useEffect(() => {
    const handlePopState = () => setRoute(resolveRoute(window.location.pathname,availableCourses));
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange',handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange',handlePopState);
    };
  }, [availableCourses]);

  const navigate = useCallback((path) => {
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    setRoute(resolveRoute(window.location.pathname,availableCourses));
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [availableCourses]);

  function openCourse(id, lessonId) {
    if (!id) return navigate(homePath());
    setLastCourse(id);
    navigate(playgroundPath(id, lessonId));
  }

  function openProject(courseId,projectId,stepId=null) {
    navigate(projectPath(courseId,projectId,stepId));
  }

  function setPage(page) {
    if (page === 'teacher') navigate(teacherPath());
    else if (page === 'admin') navigate(adminPath());
    else if (page === 'journals') navigate(journalsPath());
    else if (page === 'grades') navigate(gradesPath());
    else if (page === 'challenges') navigate(challengesPath());
    else if (page === 'course') openCourse(route.page === 'course' ? route.courseId : lastCourse);
    else navigate(homePath());
  }

  const page = route.page;
  const currentCourse = route.courseId || lastCourse;

  return (
    <div className="app-shell">
      <Topbar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onHome={() => navigate(homePath())}
        theme={theme}
        setTheme={setTheme}
      />
      <div className={cn('app-layout', !sidebarOpen && 'sidebar-closed')}>
        <Sidebar
          open={sidebarOpen}
          page={page}
          courseId={currentCourse}
          lessonId={route.page === 'course' ? route.lessonId : null}
          setPage={setPage}
          openCourse={openCourse}
          completedLessons={completedWithGrades}
          assignments={courseAssignments}
          grades={grades}
          availableCourses={availableCourses}
          onOpenProject={openProject}
        />
        <main className="main-panel">
          {page === 'home' ? (
            <Home availableCourses={availableCourses} completedLessons={completedWithGrades} openCourse={openCourse} openTeacher={() => navigate(teacherPath())} openChallenges={() => navigate(challengesPath())} />
          ) : page === 'course' ? (
            <CoursePage
              key={route.courseId}
              courseId={route.courseId}
              lessonId={route.lessonId}
              projectId={route.projectId}
              projectStepId={route.stepId}
              availableCourses={availableCourses}
              openCourse={openCourse}
              openProject={openProject}
              openChallenges={(courseId) => navigate(challengesPath(courseId))}
              completedLessons={completedWithGrades}
              assignments={courseAssignments}
              grades={grades}
              onToggleLessonComplete={(id) => setCompletedLessons(previous => toggleLessonComplete(previous, id))}
              courseColors={courseColors}
              onSetCourseColor={setCourseColor}
              onResetCourseColor={resetCourseColor}
            />
          ) : page === 'grades' ? (
            <Grades grades={grades} assignments={courseAssignments} completedLessons={completedWithGrades}/>
          ) : page === 'challenges' ? (
            <ChallengeBank grades={grades} filterCourse={route.filterCourse} onSelect={(id) => navigate(challengePath(id))} onBrowseCourse={(id) => navigate(challengesPath(id))} />
          ) : page === 'challenge' ? (
            <ChallengeDetail key={route.challengeId} challengeId={route.challengeId} grades={grades} onBack={() => navigate(challengesPath())} />
          ) : page === 'journals' ? (
            <Journals submissions={journalSubmissions} setSubmissions={setJournalSubmissions} />
          ) : page === 'teacher' ? (
            <TeacherDashboard students={students} journalSubmissions={journalSubmissions} />
          ) : page === 'admin' ? (
            <AdminDashboard students={students} setStudents={setStudents}/>
          ) : contentLoading ? (
            <div className="main-content route-not-found" role="status">
              <h1>Loading published course materials…</h1>
              <p>The lesson and project links will appear once the course catalogs are loaded.</p>
            </div>
          ) : (
            <div className="main-content route-not-found">
              <div className="eyebrow">Link not found</div>
              <h1>That playground page doesn't exist.</h1>
              <p>Check the link or return to the list of playgrounds.</p>
              <button className="btn primary" onClick={() => navigate(homePath())}>See all playgrounds</button>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
