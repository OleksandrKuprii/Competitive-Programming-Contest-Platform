import React from 'react';
import { Container } from 'react-bootstrap';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './routes/HomePage';
import TasksPage from './routes/TasksPage';
import TournamentsPage from './routes/TournamentsPage';
import TaskPage from './routes/TaskPage';
import SubmissionsPage from './routes/SubmissionsPage';
import SubmissionPage from './routes/SubmissionPage';

const App = () => (
  <HashRouter>
    <Navbar />

    <Container style={{ paddingTop: 20 }}>
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
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
    </Container>
  </HashRouter>
);

export default App;
