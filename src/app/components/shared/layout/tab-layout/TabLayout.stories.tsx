import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { range } from '@gmjs/array-create';
import { TabLayout, TabLayoutProps } from './TabLayout';
import { decoratorPadding, disableControl } from '../../../../../storybook';
import { TabLayoutEntry } from './types';

type TabLayoutValue = string;
type MyTabLayoutEntry = TabLayoutEntry<TabLayoutValue>;
type MyTabLayoutProps = TabLayoutProps<TabLayoutValue>;

const ENTRIES: readonly MyTabLayoutEntry[] = range(1, 5).map((i) =>
  createTabEntry(i),
);

function createTabEntry(id: number): MyTabLayoutEntry {
  return {
    value: `tab-${id}`,
    tab: `Tab ${id}`,
    content: `Content ${id}`,
  };
}

const STORY_META: Meta<MyTabLayoutProps> = {
  component: TabLayout,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {
    entries: disableControl(),
    value: disableControl(),
    onValueChange: disableControl(),
  },
  args: {
    entries: ENTRIES,
  },
};
export default STORY_META;

export const Primary: StoryObj<MyTabLayoutProps> = {
  render: (args: MyTabLayoutProps) => {
    const { value: _ignore1, onValueChange: _ignore2, ...rest } = args;

    const [value, setValue] = useState(ENTRIES[0].value);

    return <TabLayout {...rest} value={value} onValueChange={setValue} />;
  },
};
