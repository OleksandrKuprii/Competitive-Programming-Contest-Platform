

import * as React from 'react';
import {FC, useCallback} from "react";
import Button from "@/atoms/button";
import ButtonGroup from "@/molecules/buttonGroup";
import {MdEdit, MdExitToApp} from "react-icons/all";
import {useStoreState, useStoreActions} from "~/hooks/store";

const ProfileQuickActionsAuthenticated: FC = () => {
  const signOut = useStoreActions(actions => actions.auth0.signOut);

  const signOutCallback = useCallback(() => {
    signOut();
  }, []);

  return (
    <ButtonGroup>
      <Button icon onClick={signOutCallback}>
        <MdExitToApp/>
      </Button>
      <Button icon>
        <MdEdit/>
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
