import * as React from 'react';
import Button from 'react-bootstrap/Button';
import { FaAngleDoubleRight } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { FC } from 'react';
import { useStoreActions } from '../../../hooks/store';
import { Notification } from '../../../models/interfaces';
import Result from '../../atoms/result';

const SubmittingNotification: FC<{ taskId: string; taskName: string }> = ({
  taskId,
  taskName,
}) => {
  const history = useHistory();

  const goToTask = () => {
    history.push(`/task/view/${taskId}`);
  };

  return (
    <div
      className="notification-toast"
      onClick={goToTask}
      onKeyDown={goToTask}
      role="button"
      aria-hidden="true"
    >
      {taskName}
    </div>
  );
};

const SubmittedNotification: FC<{
  submissionId: number;
}> = ({ submissionId }) => {
  const history = useHistory();
  const goToSubmission = () => {
    history.push(`/submission/view/${submissionId}`);
  };

  return (
    <div
      className="notification-toast"
      onClick={goToSubmission}
      onKeyDown={goToSubmission}
      role="button"
      aria-hidden="true"
    >
      #{submissionId}
    </div>
  );
};

const ReceivedResultsNotification: FC<{
  submissionId: number;
  points: number;
  status: string[];
}> = ({ submissionId, points, status }) => {
  const history = useHistory();
  const goToSubmission = () => {
    history.push(`/submission/view/${submissionId}`);
  };

  return (
    <div
      className="notification-toast"
      onClick={goToSubmission}
      onKeyDown={goToSubmission}
      role="button"
      aria-hidden="true"
    >
      <Result points={points} status={status} />
    </div>
  );
};

const NotificationToast = ({
  notification,
}: {
  notification: Notification;
}) => {
  const dismissedNotification = useStoreActions(
    (actions) => actions.notification.dismissedNotification,
  );

  const onClose = () => {
    dismissedNotification(notification.id);
  };

  let notificationBody;

  switch (notification.payload.type) {
    case 'submitting':
      notificationBody = (
        <SubmittingNotification
          taskId={notification.payload.taskId}
          taskName={notification.payload.taskName}
        />
      );
      break;
    case 'submitted':
      notificationBody = (
        <SubmittedNotification
          submissionId={notification.payload.submissionId}
        />
      );
      break;
    case 'receivedResults':
      notificationBody = (
        <ReceivedResultsNotification
          submissionId={notification.payload.submissionId}
          points={notification.payload.points}
          status={notification.payload.status}
        />
      );
      break;
    default:
      notificationBody = <></>;
  }

  return (
    <div style={{ height: 50, marginTop: 5 }}>
      <Row style={{ height: '100%' }}>
        <Col className="p-0">{notificationBody}</Col>
        <Button
          variant="danger"
          style={{ borderRadius: 0, width: 50 }}
          onClick={onClose}
        >
          <FaAngleDoubleRight />
        </Button>
      </Row>
    </div>
  );
};

export default React.memo(NotificationToast);
