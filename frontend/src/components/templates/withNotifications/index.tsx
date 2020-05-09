import * as React from 'react';
import { TransitionGroup } from 'react-transition-group';
import { FC, ReactNode } from 'react';
import { useStoreState } from '../../../hooks/store';
import NotificationToast from '../../molecules/notificationToast';
import { Grid } from '../../atoms/grid';
import Fade from '../../animations/fade';

interface WithNotificationsProps {
  children: ReactNode;
}

const WithNotifications: FC<WithNotificationsProps> = ({ children }) => {
  const notifications = useStoreState((state) => state.notification.list);

  return (
    <>
      {children}

      <Grid
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          zIndex: 9999,
          padding: 40,
          width: 275,
          height: 300,
          flexDirection: 'column-reverse',
        }}
      >
        <TransitionGroup className="notifications">
          {notifications.map((notification) => (
            <Fade key={notification.id} in>
              <NotificationToast notification={notification} />
            </Fade>
          ))}
        </TransitionGroup>
      </Grid>
    </>
  );
};

export default WithNotifications;
