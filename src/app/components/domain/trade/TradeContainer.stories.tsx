import type { Meta, StoryObj } from '@storybook/react';
import { TradeContainer, TradeContainerProps } from './TradeContainer';

const STORY_META: Meta<TradeContainerProps> = {
  component: TradeContainer,
  tags: ['autodocs'],
  decorators: [],
  argTypes: {},
  args: {},
};
export default STORY_META;

export const Primary: StoryObj<TradeContainerProps> = {
  render: (args: TradeContainerProps) => {
    return <TradeContainer {...args} />;
  },
};
