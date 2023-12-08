import type { Meta, StoryObj } from '@storybook/react';
import { YAxis, YAxisProps } from './YAxis';
import { decoratorPadding, decoratorSvg } from '../../../../../../storybook';
import { AxisTickItem, TYPES_OF_Y_AXIS_LOCATIONS } from '../../types';

const TICKS: readonly AxisTickItem[] = [
  {
    offset: 0,
    textLines: ['2021-01-01', '00:00:00'],
  },
  {
    offset: 100,
    textLines: ['2021-01-01', '00:00:00'],
  },
  {
    offset: 500,
    textLines: ['2021-01-01'],
  },
  {
    offset: 550,
    textLines: ['2021-01-01', '00:00:00'],
  },
  {
    offset: 600,
    textLines: ['2021-01-01', '00:00:00'],
  },
];

const STORY_META: Meta<YAxisProps> = {
  component: YAxis,
  tags: ['autodocs'],
  decorators: [decoratorSvg(400, 800), decoratorPadding()],
  argTypes: {
    location: {
      control: {
        type: 'inline-radio',
      },
      options: TYPES_OF_Y_AXIS_LOCATIONS,
    },
  },
  args: {
    ticks: TICKS,
  },
};
export default STORY_META;

export const Primary: StoryObj<YAxisProps> = {
  render: (args: YAxisProps) => {
    return <YAxis {...args} />;
  },
  args: {
    x: 200,
    y: 50,
    location: 'left',
    size: 600,
  },
};
