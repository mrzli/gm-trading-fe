import type { Meta, StoryObj } from '@storybook/react';
import {
  CandlestickChartArea,
  CandlestickChartAreaProps,
} from './CandlestickChartArea';
import { decoratorPadding, decoratorSvg } from '../../../../../../storybook';

const STORY_META: Meta<CandlestickChartAreaProps> = {
  component: CandlestickChartArea,
  tags: ['autodocs'],
  decorators: [decoratorSvg(1000, 800), decoratorPadding()],
};
export default STORY_META;

export const Primary: StoryObj<CandlestickChartAreaProps> = {
  render: (args: CandlestickChartAreaProps) => {
    return <CandlestickChartArea {...args} />;
  },
  args: {
    x: 50,
    y: 50,
  },
};
