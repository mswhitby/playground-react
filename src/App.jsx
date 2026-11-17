import { useCallback, useEffect, useMemo, useState } from 'react';
import { seedStudents } from './data/students.js';
import { seedJournalSubmissions } from './data/journalSubmissions.js';
import { courses, getCourse } from './data/courses.js';
import { applyCourseColorPreferences, isHexColor } from './lib/courseColors.js';
import { useSaved } from './hooks/useSaved.js';
import { toggleLessonComplete } from './lib/completion.js';
import { completionIds } from './lib/gradebook.js';
import { loadPublishedCourse } from './lib/publishedCourseLoader.js';
import {applyCs1PublishedMetadata,cs1IntegrationMode,loadCs1PublishedCatalog,loadCs1ReadOnlyAccount} from './lib/cs1Integration.js';
import {publishedCs1Challenges} from './lib/cs1ChallengeBank.js';
import { cn } from './lib/cn.js';
import { homePath, journalsPath, gradesPath, playgroundPath, challengesPath, challengePath, resolveRoute, teacherPath, adminPath, projectPath } from './lib/routes.js';
import Topbar from './components/layout/Topbar.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Footer from './components/layout/Footer.jsx';
import Home from './pages/Home.jsx';
import CoursePage from './pages/CoursePage.jsx';
import TeacherDashboard from './pages/TeacherDashboard.jsx';
import TeacherReadOnly from './pages/TeacherReadOnly.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminReadOnly from './pages/AdminReadOnly.jsx';
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
  const [readOnlyAccount,setReadOnlyAccount] = useState({
    status:cs1IntegrationMode?'loading':'disabled',grades:[],weeklyPoints:[]
  });
  const grades = cs1IntegrationMode ? readOnlyAccount.grades : [];
  const courseAssignments = [];
  const completedWithGrades = completionIds(cs1IntegrationMode?[]:completedLessons,grades);
  const [publishedContent,setPublishedContent] = useState({});
  const [contentErrors,setContentErrors] = useState({});
  const [contentLoading,setContentLoading] = useState(true);
  const availableCourses = useMemo(() => (cs1IntegrationMode?courses.filter(c=>c.id==='computer-science-1'):courses).map(course => {
    if (course.id === 'computer-science-1') return cs1IntegrationMode
      ? applyCs1PublishedMetadata(course,publishedContent[course.id])
      : course;
    if (course.id === 'test-prep') return course;
    if (course.id === 'capstone') return {...course,units:[],lessons:[],lessonRecords:{},
      publishedContent:false,projects:[]};
    const imported = publishedContent[course.id];
    return imported ? {...course,...imported,publishedContent:true}
      : {...course,units:[],lessons:[],lessonRecords:{},projects:[],
        contentLoadingError:contentErrors[course.id] || null};
  }),[publishedContent,contentErrors]);

  const integrationChallenges = useMemo(() => cs1IntegrationMode
    ? publishedCs1Challenges(publishedContent['computer-science-1']) : null, [publishedContent]);

  useEffect(() => {
    if(!cs1IntegrationMode)return;
    let active=true;
    loadCs1ReadOnlyAccount().then(value=>{if(active)setReadOnlyAccount(value)}).catch(()=>{
      if(active)setReadOnlyAccount({status:'unavailable',grades:[],weeklyPoints:[],
        message:'Account lookup unavailable. No production records were changed.'});
    });
    return ()=>{active=false};
  },[]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const courseIds=cs1IntegrationMode?['computer-science-1']:['game-programming','mobile-app-dev','uil','tsi-math'];
    Promise.all(courseIds.map(async courseId => {
      try {return {courseId, data:courseId==='computer-science-1'
        ? await loadCs1PublishedCatalog({signal:controller.signal})
        : await loadPublishedCourse(courseId,{signal:controller.signal})};}
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
    setRoute(resolveRoute(window.location.pathname,availableCourses,integrationChallenges?.map(item=>item.id)));
  },[availableCourses,integrationChallenges]);
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
      : route.page === 'admin' ? 'Admin Dashboard' : route.page === 'teacher' ? 'Teacher Dashboard' : route.page === 'grades' ? 'Grades' : route.page === 'journals' ? 'Weekly Journals'
      : route.page === 'challenges' ? 'Challenge Bank' : route.page === 'challenge' ? 'Coding Challenge' : 'Your Playgrounds';
    document.title = `${label || 'Playground'} | Ms. Whitby's Playground — React Lab`;
  }, [route.page, route.courseId, setLastCourse]);

  useEffect(() => {
    const handlePopState = () => setRoute(resolveRoute(window.location.pathname,availableCourses,integrationChallenges?.map(item=>item.id)));
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange',handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange',handlePopState);
    };
  }, [availableCourses,integrationChallenges]);

  const navigate = useCallback((path) => {
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    setRoute(resolveRoute(window.location.pathname,availableCourses,integrationChallenges?.map(item=>item.id)));
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [availableCourses,integrationChallenges]);

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
        readOnlyMode={cs1IntegrationMode}
        accountLabel={readOnlyAccount.user?.handle}
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
          readOnlyMode={cs1IntegrationMode}
          onOpenProject={openProject}
        />
        <main className="main-panel">
          {cs1IntegrationMode && <section className="cs1-integration-notice" role="status">
            <strong>Computer Science I · read-only integration test</strong>
            <span>{readOnlyAccount.status==='loading'?'Checking your existing Playground session…'
              :readOnlyAccount.status==='signed-in'?'Signed in as '+readOnlyAccount.user.handle+' · Your own verified grades are shown.'
              :readOnlyAccount.status==='signed-out'?'Sign in on the current Playground to view your existing results.'
              :readOnlyAccount.message||'Could not verify your existing session.'}</span>
            <a href="/playground/">Open current Playground</a>
          </section>}
          {cs1IntegrationMode && !['home','course','grades','teacher','admin','challenges','challenge'].includes(page) ? (
            <div className="main-content"><h1>Not enabled in this test build</h1>
              <p>Teacher tools, journals, challenges, and submissions remain in the current Playground until their permissions and data are integrated.</p>
              <a href="/playground/">Return to current Playground</a>
            </div>
          ) : page === 'home' ? (
            <Home availableCourses={availableCourses} completedLessons={completedWithGrades} openCourse={openCourse} openTeacher={() => navigate(teacherPath())} openChallenges={() => navigate(challengesPath())} readOnlyMode={cs1IntegrationMode} />
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
              readOnlyMode={cs1IntegrationMode}
              onToggleLessonComplete={cs1IntegrationMode?undefined:(id) => setCompletedLessons(previous => toggleLessonComplete(previous, id))}
              courseColors={courseColors}
              onSetCourseColor={setCourseColor}
              onResetCourseColor={resetCourseColor}
            />
          ) : page === 'grades' ? (
            <Grades grades={grades} assignments={courseAssignments} completedLessons={completedWithGrades} readOnlyMode={cs1IntegrationMode} weeklyPoints={readOnlyAccount.weeklyPoints} accountStatus={readOnlyAccount.status}/>
          ) : page === 'challenges' ? (
            <ChallengeBank grades={grades} filterCourse={route.filterCourse} onSelect={(id) => navigate(challengePath(id))} onBrowseCourse={(id) => navigate(challengesPath(id))}
              catalog={integrationChallenges} pythonOnly={cs1IntegrationMode} loading={cs1IntegrationMode&&contentLoading} error={contentErrors['computer-science-1']} />
          ) : page === 'challenge' ? (
            <ChallengeDetail key={route.challengeId} challengeId={route.challengeId} grades={grades} onBack={() => navigate(challengesPath())}
              publishedChallenge={integrationChallenges?.find(item=>item.id===route.challengeId)} pythonOnly={cs1IntegrationMode} />
          ) : page === 'journals' ? (
            <Journals submissions={journalSubmissions} setSubmissions={setJournalSubmissions} />
          ) : page === 'teacher' ? (
            cs1IntegrationMode ? <TeacherReadOnly /> : <TeacherDashboard students={students} journalSubmissions={journalSubmissions} />
          ) : page === 'admin' ? (
            cs1IntegrationMode ? <AdminReadOnly /> : <AdminDashboard students={students} setStudents={setStudents}/>
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
