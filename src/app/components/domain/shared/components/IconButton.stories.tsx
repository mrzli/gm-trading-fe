import type { Meta, StoryObj } from '@storybook/react';
import { EmptyObject } from '@gmjs/generic-types';
import {
  mdiChevronDoubleLeft,
  mdiChevronDoubleRight,
  mdiChevronLeft,
  mdiChevronRight,
  mdiCurrencyUsd,
} from '@mdi/js';
import { decoratorPadding, printArgs } from '../../../../../storybook';
import { IconButton } from './IconButton';

type NoProps = EmptyObject;

const STORY_META: Meta<NoProps> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: IconButton as any,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {},
  args: {},
};
export default STORY_META;

const ICONS: readonly string[] = [
  mdiChevronDoubleLeft,
  mdiChevronDoubleRight,
  mdiChevronLeft,
  mdiChevronRight,
  mdiCurrencyUsd,
];

export const Primary: StoryObj<NoProps> = {
  render: (_args: NoProps) => {
    return (
      <div className='grid grid-cols-12'>
        {ICONS.map((icon, index) => (
          <IconButton key={index} icon={icon} onClick={printArgs} />
        ))}
      </div>
    );
  },
};
