import React, { useCallback, useEffect, useState } from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import shallowEqual from 'shallowequal';
import { ThemeProvider } from 'styled-components';
import TaskFromURL from '@/dataProviders/taskFromURL';
import WithNotifications from '@/templates/withNotifications';
import WithNavbar from '@/templates/withNavbar';
import MyProfileFromAPI from '@/dataProviders/myProfileFromAPI';
import SubmissionFromURL from '@/dataProviders/submissionFromUrl';
import SubmissionsPage from '~/pages/SubmissionsPage';
import SubmissionPage from '~/pages/SubmissionPage';
import ProfilePage from '~/pages/ProfilePage';
import TournamentsPage from '~/pages/TournamentsPage';
import { useStoreActions, useStoreState } from '~/hooks/store';
import TaskPage from '~/pages/TaskPage';
import TasksPage from '~/pages/TasksPage';
import HomePage from '~/pages/HomePage';
import GlobalStyle from '~/theme/GlobalStyle';

const App = () => {
  const {
    fetchTasks,
    fetchTask,
    fetchSubmissions,
    fetchSubmission,
    signIn,
    signOut,
    uploadFile,
    cancelled,
    submit,
    selectedLanguage,
    fetchMyProfile,
    checkSubmissions,
  } = useStoreActions((actions) => ({
    fetchTask: actions.task.fetch,
    fetchTasks: actions.task.fetchAll,
    fetchSubmission: actions.submission.fetch,
    fetchSubmissions: actions.submission.fetchAll,
    signIn: actions.auth0.signIn,
    signOut: actions.auth0.signOut,
    uploadFile: actions.solutionSubmission.uploadFile,
    cancelled: actions.solutionSubmission.canceled,
    submit: actions.solutionSubmission.submit,
    selectedLanguage: actions.solutionSubmission.selectedLanguage,
    fetchMyProfile: actions.user.fetchMyProfile,
    checkSubmissions: actions.submissionHunter.checkSubmissions,
  }));

  /* <editor-fold desc="Callbacks"> */

  const fetchTaskCallback = useCallback(
    (id: string) => {
      fetchTask({ id });
    },
    [fetchTask],
  );

  const fetchSubmissionCallback = useCallback(
    (id: number) => {
      fetchSubmission({ id });
    },
    [fetchSubmission],
  );

  const signInCallback = useCallback(() => {
    signIn();
  }, [signIn]);

  const singOutCallback = useCallback(() => {
    signOut();
  }, [signOut]);

  const onDropAcceptedCallback = useCallback(
    async (file: File) => {
      await uploadFile(file);

      document.body.scrollIntoView(false);
    },
    [uploadFile],
  );

  const cancelledCallback = useCallback(() => {
    cancelled();
  }, [cancelled]);

  const submitCallback = useCallback(
    (taskId) => {
      submit(taskId);
    },
    [submit],
  );

  const selectedLanguageCallback = useCallback(
    (language: string) => {
      selectedLanguage(language);
    },
    [selectedLanguage],
  );

  const fetchMyProfileCallback = useCallback(() => {
    fetchMyProfile();
  }, [fetchMyProfile]);

  /* </editor-fold> */

  const languages = ['python3', 'python2', 'c++', 'c', 'pascal'];

  const {
    isAuthenticated,
    tasks,
    tasksLoading,
    submissionsLoading,
    submissions,
    language,
    code,
    fileUploaded,
    myProfile,
    categories,
  } = useStoreState(
    (state) => ({
      isAuthenticated: state.auth0.isAuthenticated,
      tasks: state.task.tasks,
      tasksLoading: state.task.loadingStatus,
      submissions: state.submission.submissions,
      submissionsLoading: state.submission.loadingStatus,
      language: state.solutionSubmission.language,
      code: state.solutionSubmission.code,
      fileUploaded: state.solutionSubmission.fileUploaded,
      myProfile: state.user.myProfile,
      categories: state.task.categories,
    }),
    shallowEqual,
  );

  useEffect(() => {
    fetchTasks();

    if (isAuthenticated) {
      fetchMyProfile();
      fetchSubmissions().then(() => {
        checkSubmissions();
      });
    }
  }, [
    fetchTasks,
    fetchSubmissions,
    fetchMyProfile,
    isAuthenticated,
    checkSubmissions,
  ]);

  const [selectedCategories, setSelectedCategories] = useState([] as string[]);

  const [selectedResults, setSelectedResults] = useState([] as string[]);

  const [difficultyRange, setDifficultyRange] = useState([1, 10]);

  const [sortBy, setSortBy] = useState({ id: 'publishedAt', order: -1 });

  return (
    <ThemeProvider theme={{ mode: 'dark' }}>
      <GlobalStyle />
      <HashRouter>
        <WithNotifications>
          <WithNavbar
            isAuthenticated={isAuthenticated}
            onSignIn={signInCallback}
            onSingOut={singOutCallback}
          >
            <Switch>
              <Route path="/tournaments">
                <TournamentsPage />
              </Route>

              <Route path="/task/view/:id">
                <TaskFromURL tasks={tasks} fetchTask={fetchTaskCallback}>
                  {(task) => (
                    <TaskPage
                      task={task}
                      language={language}
                      languages={languages}
                      onDropAccepted={onDropAcceptedCallback}
                      code={code}
                      fileUploaded={fileUploaded}
                      cancelled={cancelledCallback}
                      submit={submitCallback}
                      selectedLanguage={selectedLanguageCallback}
                    />
                  )}
                </TaskFromURL>
              </Route>

              <Route path="/tasks">
                <TasksPage
                  tasks={tasks}
                  tasksLoading={tasksLoading}
                  selectedCategories={selectedCategories}
                  categories={categories}
                  setSelectedCategories={setSelectedCategories}
                  selectedResults={selectedResults}
                  setSelectedResults={setSelectedResults}
                  difficultyRange={difficultyRange}
                  setDifficultyRange={setDifficultyRange}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />
              </Route>

              <Route path="/submissions">
                <SubmissionsPage
                  submissions={submissions}
                  submissionsLoading={submissionsLoading}
                />
              </Route>

              <Route path="/submission/view/:id">
                <SubmissionFromURL
                  submissions={submissions}
                  fetchSubmission={fetchSubmissionCallback}
                >
                  {(submission) => <SubmissionPage submission={submission} />}
                </SubmissionFromURL>
              </Route>

              <Route path="/profile/my">
                <MyProfileFromAPI
                  fetchMyProfile={fetchMyProfileCallback}
                  myProfile={myProfile}
                >
                  {({ username, fullname, picture }) => (
                    <ProfilePage
                      username={username}
                      fullname={fullname}
                      picture={picture}
                    />
                  )}
                </MyProfileFromAPI>
              </Route>

              <Route path="/" exact>
                <HomePage />
              </Route>

              <Route path="/">
                <Redirect to="/" />
              </Route>
            </Switch>
          </WithNavbar>
        </WithNotifications>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;
