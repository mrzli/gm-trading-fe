import type { Meta, StoryObj } from '@storybook/react';
import {
  CandlestickChartArea,
  CandlestickChartAreaProps,
} from './CandlestickChartArea';
import { decoratorPadding, decoratorSvg } from '../../../../../../storybook';
import { CandleVisualData } from '../../types';

const ITEMS: readonly CandleVisualData[] = [
  {
    y1: 50,
    y2: 100,
    y3: 150,
    y4: 200,
    isBull: true,
  },
  {
    y1: 75,
    y2: 100,
    y3: 250,
    y4: 375,
    isBull: false,
  },
  {
    y1: 150,
    y2: 200,
    y3: 250,
    y4: 300,
    isBull: true,
  },
  {
    y1: 75,
    y2: 75,
    y3: 200,
    y4: 250,
    isBull: true,
  },
];

const STORY_META: Meta<CandlestickChartAreaProps> = {
  component: CandlestickChartArea,
  tags: ['autodocs'],
  decorators: [decoratorSvg(1000, 800), decoratorPadding()],
  argTypes: {
    candleOffset: {
      control: {
        type: 'range',
        min: -10,
        max: 10,
        step: 0.1,
      },
    },
  },
  args: {
    items: ITEMS,
  },
};
export default STORY_META;

export const Primary: StoryObj<CandlestickChartAreaProps> = {
  render: (args: CandlestickChartAreaProps) => {
    return <CandlestickChartArea {...args} />;
  },
  args: {
    x: 50,
    y: 50,
    width: 400,
    height: 400,
    candleOffset: 0,
    slotWidth: 50,
  },
};
