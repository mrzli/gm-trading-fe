import type { Meta, StoryObj } from '@storybook/react';
import { XAxis, XAxisProps } from './XAxis';
import { decoratorPadding, decoratorSvg } from '../../../../../../storybook';
import { AxisTickItem, TYPES_OF_X_AXIS_LOCATIONS } from '../../types';

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
    offset: 600,
    textLines: ['2021-01-01', '00:00:00'],
  },
  {
    offset: 700,
    textLines: ['2021-01-01', '00:00:00'],
  },
  {
    offset: 900,
    textLines: ['2021-01-01', '00:00:00'],
  },
];

const STORY_META: Meta<XAxisProps> = {
  component: XAxis,
  tags: ['autodocs'],
  decorators: [decoratorSvg(1400, 400), decoratorPadding()],
  argTypes: {
    location: {
      control: {
        type: 'inline-radio',
      },
      options: TYPES_OF_X_AXIS_LOCATIONS,
    },
  },
  args: {
    ticks: TICKS,
  },
};
export default STORY_META;

export const Primary: StoryObj<XAxisProps> = {
  render: (args: XAxisProps) => {
    return <XAxis {...args} />;
  },
  args: {
    x: 100,
    y: 100,
    location: 'top',
    size: 1200,
  },
};
