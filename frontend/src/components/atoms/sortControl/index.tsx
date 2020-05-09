import * as React from 'react';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { useCallback } from 'react';
import styled, { css } from 'styled-components';
import { Grid, Row } from '../grid';
import { HorizontalSpacer } from '../spacers';
import { color } from '../../../theme';

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
      color: ${color};
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
      <HorizontalSpacer size={5} />

      <Grid justifyContent="center">
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
