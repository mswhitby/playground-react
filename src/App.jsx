import { useCallback, useEffect, useState } from 'react';
import { seedStudents } from './data/students.js';
import { seedJournalSubmissions } from './data/journalSubmissions.js';
import { getCourse } from './data/courses.js';
import { useSaved } from './hooks/useSaved.js';
import { cn } from './lib/cn.js';
import { homePath, journalsPath, playgroundPath, resolveRoute, teacherPath } from './lib/routes.js';
import Topbar from './components/layout/Topbar.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Footer from './components/layout/Footer.jsx';
import Home from './pages/Home.jsx';
import CoursePage from './pages/CoursePage.jsx';
import TeacherDashboard from './pages/TeacherDashboard.jsx';
import Journals from './pages/Journals.jsx';

export default function App() {
  // Deep links and browser Back/Forward always win over stored UI preferences.
  const [route, setRoute] = useState(() => resolveRoute(window.location.pathname));
  const [lastCourse, setLastCourse] = useSaved('designlab:course', 'computer-science-1');
  const [theme, setTheme] = useSaved('designlab:theme', 'dark');
  const [accent, setAccent] = useSaved('designlab:accent', 'purple');
  const [sidebarOpen, setSidebarOpen] = useSaved('designlab:sidebar', true);
  const [students, setStudents] = useSaved('designlab:students', seedStudents);
  const [journalSubmissions, setJournalSubmissions] = useSaved('designlab:journal-submissions', seedJournalSubmissions);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.accent = accent;
  }, [theme, accent]);

  useEffect(() => {
    if (route.page === 'course') setLastCourse(route.courseId);
    const label = route.page === 'course'
      ? getCourse(route.courseId)?.label
      : route.page === 'teacher' ? 'Teacher dashboard' : route.page === 'journals' ? 'Weekly journals' : 'Your playgrounds';
    document.title = `${label || 'Playground'} | Ms. Whitby's Playground — React Lab`;
  }, [route.page, route.courseId, setLastCourse]);

  useEffect(() => {
    const handlePopState = () => setRoute(resolveRoute(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((path) => {
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    setRoute(resolveRoute(window.location.pathname));
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  function openCourse(id, lessonId) {
    if (!id) return navigate(homePath());
    setLastCourse(id);
    navigate(playgroundPath(id, lessonId));
  }

  function setPage(page) {
    if (page === 'teacher') navigate(teacherPath());
    else if (page === 'journals') navigate(journalsPath());
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
        accent={accent}
        setAccent={setAccent}
      />
      <div className={cn('app-layout', !sidebarOpen && 'sidebar-closed')}>
        <Sidebar
          open={sidebarOpen}
          page={page}
          courseId={currentCourse}
          lessonId={route.page === 'course' ? route.lessonId : null}
          setPage={setPage}
          openCourse={openCourse}
        />
        <main className="main-panel">
          {page === 'home' ? (
            <Home openCourse={openCourse} openTeacher={() => navigate(teacherPath())} />
          ) : page === 'course' ? (
            <CoursePage
              key={route.courseId}
              courseId={route.courseId}
              lessonId={route.lessonId}
              openCourse={openCourse}
            />
          ) : page === 'journals' ? (
            <Journals submissions={journalSubmissions} setSubmissions={setJournalSubmissions} />
          ) : page === 'teacher' ? (
            <TeacherDashboard students={students} setStudents={setStudents} journalSubmissions={journalSubmissions} />
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
