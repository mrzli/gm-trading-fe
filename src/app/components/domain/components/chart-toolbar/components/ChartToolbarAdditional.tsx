import React from 'react';
import Icon from '@mdi/react';
import { Checkbox, PopupMenu } from '../../../../shared';
import { mdiDotsVertical } from '@mdi/js';
import { ChartAdditionalSettings } from '../../../types';

export interface ChartToolbarAdditionalProps {
  readonly value: ChartAdditionalSettings;
  readonly onValueChange: (value: ChartAdditionalSettings) => void;
}

export function ChartToolbarAdditional({
  value,
  onValueChange,
}: ChartToolbarAdditionalProps): React.ReactElement {
  const { highlightSession } = value;

  const content = (
    <div className='flex flex-col gap-1'>
      <Checkbox
        label='Highlight session'
        value={highlightSession}
        onValueChange={(highlightSession: boolean) => {
          onValueChange({
            ...value,
            highlightSession,
          });
        }}
      />
    </div>
  );

  return (
    <PopupMenu
      triggerContent={<Icon path={mdiDotsVertical} size={ICON_SIZE} />}
      content={content}
    />
  );
}

const ICON_SIZE = 0.875 / 1.5;
