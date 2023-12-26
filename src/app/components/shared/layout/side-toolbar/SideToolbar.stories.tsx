import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { range } from '@gmjs/array-create';
import { SideToolbar, SideToolbarProps } from './SideToolbar';
import {
  EXAMPLE_FILL_CONTENT,
  argTypeInlineRadio,
  decoratorFullHeight,
  disableControl,
} from '../../../../../storybook';
import { SideToolbarEntry, TYPES_OF_SIDE_TOOLBAR_POSITIONS } from './types';

type SideToolbarValue = string;
type MySideToolbarEntry = SideToolbarEntry<SideToolbarValue>;
type MySideToolbarProps = SideToolbarProps<SideToolbarValue>;

const ENTRIES: readonly MySideToolbarEntry[] = range(1, 5).map((i) =>
  createTabEntry(i),
);

function createTabEntry(id: number): MySideToolbarEntry {
  return {
    value: `tab-${id}`,
    tab: `Tab ${id}`,
    content: `Content ${id}`,
  };
}

const STORY_META: Meta<MySideToolbarProps> = {
  component: SideToolbar,
  tags: ['autodocs'],
  decorators: [decoratorFullHeight()],
  argTypes: {
    position: argTypeInlineRadio(TYPES_OF_SIDE_TOOLBAR_POSITIONS),
    entries: disableControl(),
    value: disableControl(),
    onValueChange: disableControl(),
  },
  args: {
    position: 'left',
    entries: ENTRIES,
  },
};
export default STORY_META;

export const Primary: StoryObj<MySideToolbarProps> = {
  render: (args: MySideToolbarProps) => {
    const { value: _ignore1, onValueChange: _ignore2, ...rest } = args;

    const [value, setValue] = useState<SideToolbarValue | undefined>(undefined);

    const toolbar = (
      <SideToolbar<SideToolbarValue>
        {...rest}
        value={value}
        onValueChange={setValue}
      />
    );

    const fullContent =
      args.position === 'left' ? (
        <>
          {toolbar}
          {EXAMPLE_FILL_CONTENT}
        </>
      ) : (
        <>
          {EXAMPLE_FILL_CONTENT}
          {toolbar}
        </>
      );

    return <div className='flex flex-row h-full p-4 gap-2'>{fullContent}</div>;
  },
};
