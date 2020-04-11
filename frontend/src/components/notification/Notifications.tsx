import * as React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import NotificationToast from './NotificationToast';
import { useStoreState } from '../../hooks/store';

const Notifications = () => {
  const notifications = useStoreState((state) => state.notification.list);

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      right: 0,
      zIndex: 9999,
      padding: 40,
      width: 300,
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
  );
};
export default Notifications;
