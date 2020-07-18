import * as React from 'react';
import { FC, ReactNode, useCallback } from 'react';
import { TransitionGroup } from 'react-transition-group';
import NotificationToast from '@/molecules/notificationToast';
import { Grid } from '@/toucanui/atoms/grid';
import Fade from '@/toucanui/animations/fade';
import { useStoreState, useStoreActions } from '~/hooks/store';

interface WithNotificationsProps {
  children: ReactNode;
}

const WithNotifications: FC<WithNotificationsProps> = ({ children }) => {
  const notifications = useStoreState((state) => state.notification.list);

  const dismissedNotification = useStoreActions(
    (actions) => actions.notification.dismissedNotification,
  );

  const onDismiss = useCallback(
    (id: number) => {
      dismissedNotification(id);
    },
    [dismissedNotification],
  );

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
          width: 320,
          height: 'auto',
          flexDirection: 'column-reverse',
        }}
      >
        <TransitionGroup className="notifications">
          {notifications.map((notification) => (
            <Fade key={notification.id} in>
              <NotificationToast
                notification={notification}
                onDismiss={onDismiss}
              />
            </Fade>
          ))}
        </TransitionGroup>
      </Grid>
    </>
  );
};

export default WithNotifications;
