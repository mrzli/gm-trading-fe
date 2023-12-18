import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonProps } from './Button';
import { decoratorPadding, disableControl } from '../../../../storybook';

const STORY_META: Meta<ButtonProps> = {
  component: Button,
  decorators: [decoratorPadding()],
  argTypes: {
    onClick: disableControl(),
  },
  args: {
    content: 'Button',
    disabled: false,
  },
};
export default STORY_META;

export const Primary: StoryObj<ButtonProps> = {
  render: (args: ButtonProps) => {
    return <Button {...args} />;
  },
};
