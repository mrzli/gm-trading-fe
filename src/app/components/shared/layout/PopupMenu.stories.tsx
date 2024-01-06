import type { Meta, StoryObj } from '@storybook/react';
import { PopupMenu, PopupMenuProps } from './PopupMenu';
import { decoratorPadding, disableControl } from '../../../../storybook';

const STORY_META: Meta<PopupMenuProps> = {
  component: PopupMenu,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {
    triggerContent: disableControl(),
    content: disableControl(),
  },
  args: {
    triggerContent: 'Trigger',
    content: 'Content',
  },
};
export default STORY_META;

export const Primary: StoryObj<PopupMenuProps> = {
  render: (args: PopupMenuProps) => {
    return <PopupMenu {...args} />;
  },
};
