import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './routes/HomePage';
import TasksPage from './routes/TasksPage';
import TournamentsPage from './routes/TournamentsPage';
import TaskPage from './routes/TaskPage';
import SubmissionsPage from './routes/SubmissionsPage';
import SubmissionPage from './routes/SubmissionPage';
import { useStoreActions } from './hooks/store';
import ErrorPage from './routes/ErrorPage';
import Notifications from './components/notification/Notifications';

const App = () => {
  const init = useStoreActions((actions) => actions.auth0.init);

  useEffect(() => {
    init({
      domain: 'dev-gly-dk66.eu.auth0.com',
      client_id: 'w5IiSiIhAoOW8dQvAATlvbaS2eP47H0Q',
      audience: 'toucan-api',
    });
  }, [init]);

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
