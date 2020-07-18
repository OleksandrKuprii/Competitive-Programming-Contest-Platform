import * as React from 'react';
import {FC, useCallback} from 'react';
import Button from "@/toucanui/atoms/button";
import ButtonGroup from "@/molecules/buttonGroup";
import {MdCameraEnhance, MdEdit, MdExitToApp} from "react-icons/all";
import {useStoreActions, useStoreState} from "~/hooks/store";
import {Route, Switch, useHistory} from 'react-router-dom';

const ProfileQuickActionsAuthenticated: FC = () => {
  const signOut = useStoreActions(actions => actions.auth0.signOut);
  const history = useHistory();

  const signOutCallback = useCallback(() => {
    signOut();
  }, []);

  const editProfileCallback = useCallback(() => {
    history.push('/edit/profile');
  }, []);

  return (
    <ButtonGroup>
      <Button icon onClick={signOutCallback}>
        <MdExitToApp/>
      </Button>
      <Button icon onClick={editProfileCallback}>
        <Switch>
          <Route path="/edit/profile">
            <MdCameraEnhance />
          </Route>
          <Route>
            <MdEdit/>
          </Route>
        </Switch>
      </Button>
    </ButtonGroup>
  );
};


const ProfileQuickActionsGuest: FC = () => {
  const signIn = useStoreActions(actions => actions.auth0.signIn);

  const signInCallback = useCallback(() => {
    signIn();
  }, []);

  return (
    <Button onClick={signInCallback} variant="danger">
      Sign in
    </Button>
  );
};

const ProfileQuickActions: FC = () => {
  const isAuthenticated = useStoreState(state => state.auth0.isAuthenticated);

  return isAuthenticated ? <ProfileQuickActionsAuthenticated />
    : <ProfileQuickActionsGuest />;
};

export default ProfileQuickActions;
