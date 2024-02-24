import type { Meta, StoryObj } from '@storybook/react';
import { CopyDisplay, CopyDisplayProps } from './CopyDisplay';
import { decoratorPadding } from '../../../../storybook';

const STORY_META: Meta<CopyDisplayProps> = {
  component: CopyDisplay,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {},
  args: {
    content: 'Hello, world!',
  },
};
export default STORY_META;

export const Primary: StoryObj<CopyDisplayProps> = {
  render: (args: CopyDisplayProps) => {
    return <CopyDisplay {...args} />;
  },
};
