import type { Meta, StoryObj } from '@storybook/react';
import { OrderInputDisplay, OrderInputDisplayProps } from './OrderInputDisplay';

const STORY_META: Meta<OrderInputDisplayProps> = {
  component: OrderInputDisplay,
  tags: ['autodocs'],
  decorators: [],
  argTypes: {},
  args: {},
};
export default STORY_META;

export const Primary: StoryObj<OrderInputDisplayProps> = {
  render: (args: OrderInputDisplayProps) => {
    return <OrderInputDisplay {...args} />;
  },
};
