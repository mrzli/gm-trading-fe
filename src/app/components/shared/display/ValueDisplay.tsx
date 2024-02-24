/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { CSSProperties, useCallback } from 'react';
import cls from 'classnames';
import { Label } from './Label';

export interface ValueDisplayProps {
  readonly label?: string;
  readonly fontSize?: CSSProperties['fontSize'];
  readonly color?: CSSProperties['color'];
  readonly value: string;
  readonly onClick?: (value: string) => void;
}

export function ValueDisplay({
  label,
  fontSize,
  color,
  value,
  onClick,
}: ValueDisplayProps): React.ReactElement {
  const classes = cls('inline-flex items-center min-h-[20px] text-sm', {
    'cursor-pointer': onClick !== undefined,
  });

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(value);
    }
  }, [onClick, value]);

  const contentElement = (
    <div className={classes} style={{ fontSize, color }} onClick={handleClick}>
      {value}
    </div>
  );

  return label ? (
    <div className='flex flex-col'>
      <Label content={label} />
      {contentElement}
    </div>
  ) : (
    contentElement
  );
}
