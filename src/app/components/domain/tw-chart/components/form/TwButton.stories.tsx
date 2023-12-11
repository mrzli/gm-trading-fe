import type { Meta, StoryObj } from '@storybook/react';
import { TwButton, TwButtonProps } from './TwButton';
import { decoratorPadding, disableControl } from '../../../../../../storybook';

const STORY_META: Meta<TwButtonProps> = {
  component: TwButton,
  decorators: [decoratorPadding()],
  argTypes: {
    onClick: disableControl(),
  },
  args: {
    label: 'Button',
    disabled: false,
  },
};
export default STORY_META;

export const Primary: StoryObj<TwButtonProps> = {
  render: (args: TwButtonProps) => {
    return <TwButton {...args} />;
  },
};
