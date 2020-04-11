import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { FaAngleDoubleRight } from 'react-icons/fa';
import { useStoreActions } from '../../hooks/store';
import SubmissionLink from '../submission/SubmissionLink';
import Result from '../result/Result';
import TaskLinkByAlias from '../task/TaskLinkByAlias';
import { Notification } from '../../models/interfaces';

const notificationBodyBuilders = {
  submitting: (notification: { id: number, type: 'submitting', taskAlias: string }) => (
    <TaskLinkByAlias id={notification.taskAlias} />
  ),
  submitted: (notification: { id: number, type: 'submitted', submissionId: number }) => (
    <SubmissionLink id={notification.submissionId}>
      #
      {notification.submissionId}
    </SubmissionLink>
  ),
  receivedResults: (notification: { id: number, type: 'receivedResults', submissionId: number, points: number, status: string[] }) => (
    <SubmissionLink id={notification.submissionId}>
      <Result points={notification.points} status={notification.status} />
    </SubmissionLink>
  ),
};

const NotificationToast = ({ notification }: { notification: Notification }) => {
  const { t } = useTranslation();

  const dismissedNotification = useStoreActions(
    (actions) => actions.notification.dismissedNotification,
  );

  const onClose = useCallback(() => {
    dismissedNotification(notification.id);
  }, [dismissedNotification, notification]);

  return (
    <Row className="justify-content-end notification">
      <Col className="justify-content-around">
        <Row>
          <p className="small m-0">
            {t(`notificationHeaders.${notification.type}`)}
          </p>
        </Row>
        <Row>
          {notificationBodyBuilders[notification.type](notification as any)}
        </Row>
      </Col>
      <Button variant="outline-danger" onClick={onClose}>
        <FaAngleDoubleRight />
      </Button>
    </Row>
  );
};

export default NotificationToast;
