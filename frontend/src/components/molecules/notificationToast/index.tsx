import * as React from 'react';
import { FC, useCallback } from 'react';
import styled from 'styled-components';
import BlockLink from '@/atoms/link/BlockLink';
import Result from '@/atoms/result';
import ColoredBox from '@/atoms/box/ColoredBox';
import { Col, Row } from '@/atoms/grid';
import { FaAngleDoubleRight } from 'react-icons/all';
import IconButton from '@/atoms/button/IconButton';
import { Notification } from '~/models/interfaces';

interface NotificationToastProps {
  notification: Notification;
  onDismiss: (id: number) => any;
}

const NotificationToastContainer = styled(ColoredBox)`
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

        <IconButton variant="danger" onClick={dismissCallback}>
          <FaAngleDoubleRight />
        </IconButton>
      </Row>
    </NotificationToastContainer>
  );
};

export default NotificationToast;
