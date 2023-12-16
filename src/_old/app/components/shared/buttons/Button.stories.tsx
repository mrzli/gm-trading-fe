import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonProps } from './Button';
import { decoratorPadding, disableControl } from '../../../../../storybook';

const STORY_META: Meta<ButtonProps> = {
  component: Button,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {
    onClick: disableControl(),
  },
  args: {
    label: 'Button',
  },
};
export default STORY_META;

export const Primary: StoryObj<ButtonProps> = {
  render: (args: ButtonProps) => {
    return <Button {...args} />;
  },
};
