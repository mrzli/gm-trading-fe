import type { Meta, StoryObj } from '@storybook/react';
import { TwOhlcLabel, TwOhlcLabelProps } from './TwOhlcLabel';
import { decoratorAbsolute, decoratorSize } from '../../../../../../storybook';

const STORY_META: Meta<TwOhlcLabelProps> = {
  component: TwOhlcLabel,
  tags: ['autodocs'],
  decorators: [decoratorAbsolute(16, 16), decoratorSize(500, 200)],
  args: {
    o: 12_805.1,
    h: 12_927.4,
    l: 12_623.95,
    c: 12_920.9,
    precision: 1,
  },
};
export default STORY_META;

export const Primary: StoryObj<TwOhlcLabelProps> = {
  render: (args: TwOhlcLabelProps) => {
    return <TwOhlcLabel {...args} />;
  },
};
