import React from 'react';
import Icon from '@mdi/react';
import { Button } from '../../shared';

export interface IconButtonProps {
  readonly icon: string;
  readonly onClick: () => void;
  readonly disabled?: boolean;
}

export function IconButton({
  icon,
  onClick,
  disabled,
}: IconButtonProps): React.ReactElement {
  return (
    <Button
      content={<Icon path={icon} size={ICON_SIZE} />}
      onClick={onClick}
      disabled={disabled}
      width={24}
      height={24}
    />
  );
}

const ICON_SIZE = 0.875 / 1.5;
