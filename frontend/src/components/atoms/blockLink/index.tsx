import * as React from 'react';
import { CSSProperties, FC, ReactNode, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import './style.scss';

interface BlockLinkProps {
  children: ReactNode;
  onClick: (() => void) | string;
  disabled?: boolean;
  style?: CSSProperties;
}

const BlockLink: FC<BlockLinkProps> = ({
  children,
  onClick,
  style,
  disabled,
}) => {
  const history = useHistory();

  const onClickCallback = useCallback(() => {
    if (disabled) {
      return;
    }

    if (typeof onClick === 'string') {
      history.push(onClick);
      return;
    }

    onClick();
  }, [onClick, disabled]);

  return (
    <div
      aria-hidden="true"
      className={`btn-link ${disabled ? 'disabled' : ''}`}
      onClick={onClickCallback}
      onKeyDown={onClickCallback}
      style={style}
    >
      {children}
    </div>
  );
};

export default BlockLink;
