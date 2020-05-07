import * as React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { FC, ReactNode } from 'react';
import { useStoreState } from '../../../hooks/store';
import NotificationToast from '../../molecules/notificationToast';

interface WithNotificationsProps {
  children: ReactNode;
}

const WithNotifications: FC<WithNotificationsProps> = ({ children }) => {
  const notifications = useStoreState((state) => state.notification.list);

  return (
    <>
      {children}

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          zIndex: 9999,
          padding: 40,
          width: 275,
        }}
      >
        <TransitionGroup className="notifications">
          {notifications.map((notification) => (
            <CSSTransition
              key={notification.id}
              classNames="notification"
              timeout={500}
            >
              <NotificationToast notification={notification} />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    </>
  );
};

export default WithNotifications;
