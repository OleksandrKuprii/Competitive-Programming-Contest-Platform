import * as React from 'react';
import Button from 'react-bootstrap/Button';
import { FaAngleDoubleRight } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { useStoreActions, useStoreState } from '../../hooks/store';
import { Notification } from '../../models/interfaces';
import Result from '../result/Result';

const SubmittingNotification: React.FunctionComponent<{ taskId: string }> = ({ taskId }) => {
  const taskName = useStoreState((state) => state.task.byId(taskId)?.name);
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

const SubmittedNotification: React.FunctionComponent<{ submissionId: number }> = ({
  submissionId,
}) => {
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

const ReceivedResultsNotification: React.FunctionComponent<{
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

const NotificationToast = ({ notification }: { notification: Notification }) => {
  const dismissedNotification = useStoreActions(
    (actions) => actions.notification.dismissedNotification,
  );

  const onClose = () => {
    dismissedNotification(notification.id);
  };

  let notificationBody;

  switch (notification.payload.type) {
    case 'submitting':
      notificationBody = <SubmittingNotification taskId={notification.payload.taskId} />;
      break;
    case 'submitted':
      notificationBody = <SubmittedNotification submissionId={notification.payload.submissionId} />;
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
    <Row style={{ marginTop: 5 }}>
      <Col className="p-0">{notificationBody}</Col>
      <Button variant="danger" style={{ borderRadius: 0 }} onClick={onClose}>
        <FaAngleDoubleRight />
      </Button>
    </Row>
  );
};

export default NotificationToast;
