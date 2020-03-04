import React from 'react';
import { Container } from 'react-bootstrap';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './routes/HomePage';
import TasksPage from './routes/TasksPage';
import TournamentsPage from './routes/TournamentsPage';

const App = () => (
  <HashRouter>
    <Navbar></Navbar>

    <Container style={{paddingTop: 20}}>
      <Switch>
        <Route path="/tournaments">
          <TournamentsPage></TournamentsPage>
        </Route>

        <Route path="/tasks">
          <TasksPage></TasksPage>
        </Route>

        <Route path="/">
          <HomePage></HomePage>
        </Route>
      </Switch>
    </Container>
  </HashRouter>
)

export default App;
