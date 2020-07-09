import * as React from 'react';
import {useStoreState} from "~/hooks/store";
import BottomAlert from "@/molecules/bottomAlert";
import Button from "@/atoms/button";
import { useHistory, Route, Switch } from 'react-router-dom';
import {useCallback} from "react";

const RegistrationCompletionStatus = () => {
  const history = useHistory();

  const isAuthenticated = useStoreState(state => state.auth0.isAuthenticated);

  const registered = useStoreState(
    (state) => state.user.myProfileMeta?.registered,
  );

  const goRegister = useCallback(() => {
    history.push('/edit/profile');
  }, []);

  if (!isAuthenticated || registered) {
    return <></>;
  }

  return (
    <Switch>
      <Route path="/edit/profile" />
      <Route path="/">
        <BottomAlert
          variant="danger"
          title="Complete the registration"
          subtitle="A few steps needed to start using Toucan"
          body={<Button onClick={goRegister}>Proceed</Button>}>
          Click to complete registration
        </BottomAlert>
      </Route>
    </Switch>
  );
};

export default RegistrationCompletionStatus;
