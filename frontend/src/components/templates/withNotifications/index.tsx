import * as React from 'react';
import { FC, ReactNode } from 'react';
import { TransitionGroup } from 'react-transition-group';
import NotificationToast from '@/molecules/notificationToast';
import { Grid } from '@/atoms/grid';
import Fade from '@/animations/fade';
import { useStoreState } from '~/hooks/store';

interface WithNotificationsProps {
  children: ReactNode;
  onDismiss: (id: number) => any;
}

const WithNotifications: FC<WithNotificationsProps> = ({
  children,
  onDismiss,
}) => {
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
          width: 320,
          height: 300,
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
