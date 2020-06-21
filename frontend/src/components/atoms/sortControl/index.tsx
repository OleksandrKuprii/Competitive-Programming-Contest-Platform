import * as React from 'react';
import { useCallback } from 'react';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import styled, { css } from 'styled-components';
import { Grid, Row, JustifyContent } from '@/atoms/grid';
import { background } from '~/mixins/color';

interface SortControlArgs {
  onChange: (order: number) => any;
  active: number;
}

const Control = styled.div<{ active: boolean; variant: string }>`
  transition: all 0.2s ease-in-out;

  transform: scale(1.3) translateY(10%);

  ${(props) =>
    props.active &&
    css`
      color: ${background};
      transform: scale(1.7) translateY(10%);
    `}

  &:hover {
    transform: scale(1.7);
  }
`;

const SortControl: React.FunctionComponent<SortControlArgs> = ({
  onChange,
  active,
}) => {
  const onDescClick = useCallback(() => {
    if (active === -1) {
      onChange(0);
      return;
    }

    onChange(-1);
  }, [active, onChange]);

  const onAscClick = useCallback(() => {
    if (active === 1) {
      onChange(0);
      return;
    }

    onChange(1);
  }, [active, onChange]);

  return (
    <>
      <Grid justifyContent={JustifyContent.Center}>
        <Row>
          <Control
            variant="primary"
            active={active === 1}
            onClick={onAscClick}
            onKeyDown={onAscClick}
            role="button"
            aria-hidden="true"
          >
            <MdExpandLess />
          </Control>

          <Control
            variant="primary"
            active={active === -1}
            onClick={onDescClick}
            onKeyDown={onDescClick}
            role="button"
            aria-hidden="true"
          >
            <MdExpandMore />
          </Control>
        </Row>
      </Grid>
    </>
  );
};

export default React.memo(SortControl);
