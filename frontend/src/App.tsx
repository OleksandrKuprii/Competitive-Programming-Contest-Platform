import React from 'react';
import { Container } from 'react-bootstrap';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './routes/HomePage';
import TasksPage from './routes/TasksPage';
import TournamentsPage from './routes/TournamentsPage';
import TaskPage from './routes/TaskPage';
import SubmissionPage from './routes/SubmissionPage';

const App = () => (
  <HashRouter>
    <Navbar></Navbar>

    <Container style={{paddingTop: 20}}>
      <Switch>
        <Route path="/tournaments">
          <TournamentsPage></TournamentsPage>
        </Route>

        <Route path="/task/view/:taskAlias">
          <TaskPage></TaskPage>
        </Route>

        <Route path="/tasks">
          <TasksPage></TasksPage>
        </Route>
        <Route path="/submissions">
          <SubmissionPage></SubmissionPage>
        </Route>
        <Route path="/">
          <HomePage></HomePage>
        </Route>
      </Switch>
    </Container>
  </HashRouter>
)

export default App;
