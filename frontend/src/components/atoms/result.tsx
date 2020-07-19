import * as React from 'react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from "@/toucanui/atoms/loading";
import {allColors, background, backgroundColors, foreground, foregroundColors} from "~/mixins/color";
import styled from "styled-components";

const Span = styled.span<{ variant?: string, mark?: boolean }>`
  background: ${props => props.mark ? backgroundColors.light : 'none'};
  color: ${background};
  border-radius: 5px;
  padding: ${props => props.mark ? '5px 10px' : '0'};
`;

interface ResultProps {
  points: number;
  status: string[];
  mark?: boolean;
}

const Result: FC<ResultProps> = ({ points, status, mark }) => {
  const { t } = useTranslation();

  if (status.length === 0) {
    return <></>;
  }

  if (status[0] === 'Running') {
    return (
      <span>
        {t('running')} <Loading />
      </span>
    );
  }

  const started = points >= 0;
  const correct = status[0] === 'Correct';

  if (started) {
    let color;

    if (correct) {
      color = 'success';
    } else {
      color = points === 0 ? 'danger' : 'warning';
    }

    return (
      <Span variant={color} mark={mark}>
        {points} {status.join(', ')}
      </Span>
    );
  }

  return <span>{status.join(', ')}</span>;
};

export default React.memo(Result);
