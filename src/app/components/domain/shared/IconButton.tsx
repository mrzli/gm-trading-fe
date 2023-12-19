import React from 'react';
import Icon from '@mdi/react';
import { Button } from '../../shared';

export interface IconButtonProps {
  readonly path: string;
  readonly onClick: () => void;
}

export function IconButton({
  path,
  onClick,
}: IconButtonProps): React.ReactElement {
  return (
    <Button
      content={<Icon path={path} size={ICON_SIZE} />}
      onClick={onClick}
      width={24}
      height={24}
    />
  );
}

const ICON_SIZE = 0.875 / 1.5;
