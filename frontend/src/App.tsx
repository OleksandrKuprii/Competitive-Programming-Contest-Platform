import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './routes/HomePage';
import TasksPage from './routes/TasksPage';
import TournamentsPage from './routes/TournamentsPage';
import TaskPage from './routes/TaskPage';
import SubmissionsPage from './routes/SubmissionsPage';
import SubmissionPage from './routes/SubmissionPage';
import ErrorPage from './routes/ErrorPage';
import Notifications from './components/notification/Notifications';
import { useStoreActions, useStoreState } from './hooks/store';
import MyProfile from './routes/MyProfile';

const App = () => {
  const fetchTasks = useStoreActions((actions) => actions.task.fetchRange);
  const fetchSubmissions = useStoreActions(
    (actions) => actions.submission.fetchRange,
  );

  const checkSubmissions = useStoreActions(
    (actions) => actions.submissionHunter.checkSubmissions,
  );

  const isAuthenticated = useStoreState((state) => state.auth0.isAuthenticated);

  checkSubmissions();

  useEffect(() => {
    fetchTasks({ offset: 0, number: 300 });

    if (isAuthenticated) {
      fetchSubmissions({ offset: 0, number: 100 });
    }
  }, []);

  return (
    <HashRouter>
      <Notifications />

      <Navbar />

      <Container style={{ padding: 0, marginTop: 20 }}>
        <Switch>
          <Route path="/tournaments">
            <TournamentsPage />
          </Route>

          <Route path="/task/view/:taskAlias">
            <TaskPage />
          </Route>

          <Route path="/tasks">
            <TasksPage />
          </Route>

          <Route path="/submissions">
            <SubmissionsPage />
          </Route>

          <Route path="/submission/view/:id">
            <SubmissionPage />
          </Route>

          <Route path="/profile/my">
            <MyProfile />
          </Route>

          <Route path="/" exact>
            <HomePage />
          </Route>

          <Route path="/">
            <ErrorPage code="notFound" />
          </Route>
        </Switch>
      </Container>
    </HashRouter>
  );
};

export default App;
