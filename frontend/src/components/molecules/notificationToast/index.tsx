import * as React from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import BlockLink from '@/atoms/link/BlockLink';
import Result from '@/atoms/result';
import ColoredBox from '@/atoms/box/ColoredBox';
import { Notification } from '~/models/interfaces';

interface NotificationToastProps {
  notification: Notification;
}

const NotificationToastContainer = styled(ColoredBox)`
  margin-top: 20px;
`;

const NotificationToast: FC<NotificationToastProps> = ({ notification }) => (
  <NotificationToastContainer variant="dark">
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
  </NotificationToastContainer>
);

export default NotificationToast;
