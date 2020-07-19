import React from 'react';
import {BrowserRouter, HashRouter, Redirect, Route, Switch} from 'react-router-dom';
import WithNotifications from '@/templates/withNotifications';
import SubmissionFromURL from '@/providers/submissionFromURL';
import Auth0Provider from '@/providers/auth0Provider';
import StartupFetcher from '@/startupFetcher';
import SidebarLayout from '@/toucanui/templates/sidebarLayout';
import Sidebar from '@/organisms/sidebar';
import SubmissionsPage from '~/pages/SubmissionsPage';
import SubmissionPage from '~/pages/SubmissionPage';
import TournamentsPage from '~/pages/TournamentsPage';
import TaskPage from '~/pages/TaskPage';
import TasksPage from '~/pages/TasksPage';
import GlobalStyle from '~/GlobalStyle';
import RegistrationCompletionStatus from "@/organisms/registrationCompletionStatus";
import EditProfilePage from "~/pages/EditProfilePage";


const App = () => (
  <>
    <GlobalStyle/>

    <HashRouter>
      <Auth0Provider>
        <StartupFetcher/>

        <WithNotifications>
          <SidebarLayout sidebar={<Sidebar/>}>
            <Switch>
              <Route path="/edit/profile">
                <EditProfilePage />
              </Route>

              <Route path="/tournaments">
                <TournamentsPage/>
              </Route>

              <Route path="/task/view/:id">
                <TaskPage/>
              </Route>

              <Route path="/tasks">
                <TasksPage/>
              </Route>

              <Route path="/submissions">
                <SubmissionsPage/>
              </Route>

              <Route path="/submission/view/:id">
                <SubmissionFromURL>
                  {(submission) => <SubmissionPage submission={submission}/>}
                </SubmissionFromURL>
              </Route>

              <Route path="/">
                <Redirect to="/tasks"/>
              </Route>
            </Switch>
          </SidebarLayout>

          <RegistrationCompletionStatus />
        </WithNotifications>
      </Auth0Provider>
    </HashRouter>
  </>
);

export default App;
