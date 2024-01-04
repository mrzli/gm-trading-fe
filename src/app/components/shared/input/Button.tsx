import React, { CSSProperties, useCallback } from 'react';
import cls from 'classnames';

export type ButtonType = 'button' | 'submit' | 'reset';

export interface ButtonProps {
  readonly type?: ButtonType;
  readonly content: React.ReactNode;
  readonly onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  readonly disabled?: boolean;
  readonly width?: CSSProperties['width'];
  readonly height?: CSSProperties['height'];
}

export function Button({
  type,
  content,
  onClick,
  disabled,
  width,
  height,
}: ButtonProps): React.ReactElement {
  const classes = cls('px-1 text-sm border rounded', {
    'border-slate-400 bg-slate-300 hover:bg-slate-200 active:bg-slate-100': !disabled,
    'border-slate-200 bg-slate-100 text-gray-400 cursor-not-allowed': disabled,
  });

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
  }, [onClick]);

  return (
    <button
      className={classes}
      style={{ width, height }}
      type={type}
      onClick={handleClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}
