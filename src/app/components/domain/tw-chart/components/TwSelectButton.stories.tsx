import type { Meta, StoryObj } from '@storybook/react';
import { TwSelectButton, TwSelectButtonProps } from './TwSelectButton';

const STORY_META: Meta<TwSelectButtonProps> = {
  component: TwSelectButton,
  tags: ['autodocs'],
  decorators: [],
  argTypes: {},
  args: {},
};
export default STORY_META;

export const Primary: StoryObj<TwSelectButtonProps> = {
  render: (args: TwSelectButtonProps) => {
    return <TwSelectButton {...args} />;
  },
};
