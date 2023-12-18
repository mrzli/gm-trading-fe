import type { Meta, StoryObj } from '@storybook/react';
import { ValueDisplay, ValueDisplayProps } from './ValueDisplay';
import { decoratorPadding } from '../../../../storybook';

const STORY_META: Meta<ValueDisplayProps> = {
  component: ValueDisplay,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {},
  args: {
    label: 'Label',
    value: 'Value',
  },
};
export default STORY_META;

export const Primary: StoryObj<ValueDisplayProps> = {
  render: (args: ValueDisplayProps) => {
    return <ValueDisplay {...args} />;
  },
};
