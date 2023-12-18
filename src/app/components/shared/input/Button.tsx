import React, { CSSProperties, useCallback } from 'react';
import cls from 'classnames';

export interface ButtonProps {
  readonly content: React.ReactNode;
  readonly onClick: () => void;
  readonly disabled?: boolean;
  readonly width?: CSSProperties['width'];
  readonly height?: CSSProperties['height'];
}

export function Button({
  content,
  onClick,
  disabled,
  width,
  height,
}: ButtonProps): React.ReactElement {
  const classes = cls('px-1 text-sm border rounded', {
    'border-slate-400 bg-slate-300 active:bg-slate-200': !disabled,
    'border-slate-200 bg-slate-100 text-gray-400 cursor-not-allowed': disabled,
  });

  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <button
      className={classes}
      style={{ width, height }}
      onClick={handleClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}
