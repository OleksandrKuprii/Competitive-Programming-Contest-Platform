import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import WithNotifications from '@/templates/withNotifications';
import WithNavbar from '@/templates/withNavbar';
import SubmissionFromURL from '@/providers/submissionFromURL';
import Auth0Provider from '@/providers/auth0Provider';
import StartupFetcher from '@/startupFetcher';
import { Spacer } from '@/atoms/spacers';
import ForceRegister from '@/templates/forceRegister';
import SubmissionsPage from '~/pages/SubmissionsPage';
import SubmissionPage from '~/pages/SubmissionPage';
import TournamentsPage from '~/pages/TournamentsPage';
import TaskPage from '~/pages/TaskPage';
import TasksPage from '~/pages/TasksPage';
import HomePage from '~/pages/HomePage';
import GlobalStyle from '~/theme/GlobalStyle';
import MyProfilePage from '~/pages/MyProfilePage';
import RegisterPage from '~/pages/RegisterPage';

const App = () => (
  <ThemeProvider theme={{ mode: 'dark' }}>
    <GlobalStyle />

    <HashRouter>
      <Auth0Provider>
        <StartupFetcher />

        <WithNotifications>
          <WithNavbar>
            <ForceRegister>
              <Switch>
                <Route path="/register">
                  <RegisterPage />
                </Route>

                <Route path="/tournaments">
                  <TournamentsPage />
                </Route>

                <Route path="/task/view/:id">
                  <TaskPage />
                </Route>

                <Route path="/tasks">
                  <TasksPage />
                </Route>

                <Route path="/submissions">
                  <SubmissionsPage />
                </Route>

                <Route path="/submission/view/:id">
                  <SubmissionFromURL>
                    {(submission) => <SubmissionPage submission={submission} />}
                  </SubmissionFromURL>
                </Route>

                <Route path="/profile/my">
                  <MyProfilePage />
                </Route>

                <Route path="/" exact>
                  <HomePage />
                </Route>

                <Route path="/">
                  <Redirect to="/" />
                </Route>
              </Switch>
            </ForceRegister>

            <Spacer />
          </WithNavbar>
        </WithNotifications>
      </Auth0Provider>
    </HashRouter>
  </ThemeProvider>
);

export default App;
