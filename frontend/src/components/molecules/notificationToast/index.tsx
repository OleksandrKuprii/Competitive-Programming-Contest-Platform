import * as React from 'react';
import { FC, useCallback } from 'react';
import Notification from '~/typings/entities/notification';
import Snackbar from "@/toucanui/molecules/snackbar";

interface NotificationToastProps {
  notification: Notification;
  onDismiss: (id: number) => any;
}

const NotificationToast: FC<NotificationToastProps> = ({
  notification,
  onDismiss,
}) => {
  const dismissCallback = useCallback(() => {
    onDismiss(notification.id);
  }, [onDismiss, notification.id]);

  return (
    <>
      {notification.payload.type === 'submitting' && (
        <Snackbar message="Submitting" />
      )}

      {notification.payload.type === 'submitted' && (
        <Snackbar message="Submitted" />
      )}

      {notification.payload.type === 'receivedResults' && (
        <Snackbar message="Received results" action={{ handler: 'hello', text: 'View' }}  />
      )}
    </>
  );
};

export default NotificationToast;
