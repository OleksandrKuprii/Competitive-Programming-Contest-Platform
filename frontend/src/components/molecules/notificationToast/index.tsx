import * as React from 'react';
import { FC, useCallback } from 'react';
import styled from 'styled-components';
import BlockLink from '@/toucanui/atoms/link/BlockLink';
import Result from '@/atoms/result';
import Box from '@/toucanui/atoms/box';
import { Col, Row } from '@/toucanui/atoms/grid';
import { FaAngleDoubleRight } from 'react-icons/all';
import Notification from '~/typings/entities/notification';

interface NotificationToastProps {
  notification: Notification;
  onDismiss: (id: number) => any;
}

const NotificationToastContainer = styled(Box)`
  margin-top: 20px;
`;

const NotificationToast: FC<NotificationToastProps> = ({
  notification,
  onDismiss,
}) => {
  const dismissCallback = useCallback(() => {
    onDismiss(notification.id);
  }, [onDismiss, notification.id]);

  return (
    <NotificationToastContainer variant="dark">
      <Row>
        <Col>
          {notification.payload.type === 'submitting' && (
            <BlockLink
              padding={20}
              href={`#/task/view/${notification.payload.taskId}`}
            >
              {notification.payload.taskName}
            </BlockLink>
          )}

          {notification.payload.type === 'submitted' && (
            <BlockLink
              padding={20}
              href={`#/submission/view/${notification.payload.submissionId}`}
            >
              {notification.payload.submissionId}
            </BlockLink>
          )}

          {notification.payload.type === 'receivedResults' && (
            <BlockLink
              padding={20}
              href={`#/submission/view/${notification.payload.submissionId}`}
            >
              <Result
                points={notification.payload.points}
                status={notification.payload.status}
              />
            </BlockLink>
          )}
        </Col>

        {/*<IconButton variant="danger" onClick={dismissCallback}>*/}
        {/*  <FaAngleDoubleRight />*/}
        {/*</IconButton>*/}
      </Row>
    </NotificationToastContainer>
  );
};

export default NotificationToast;
