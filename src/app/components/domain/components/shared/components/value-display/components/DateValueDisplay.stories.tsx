import type { Meta, StoryObj } from '@storybook/react';
import { DateValueDisplay, DateValueDisplayProps } from './DateValueDisplay';
import { decoratorPadding } from '../../../../../../../../storybook';
import { TYPES_OF_TW_CHART_TIMEZONES } from '../../../../../tw-chart/types';

const STORY_META: Meta<DateValueDisplayProps> = {
  component: DateValueDisplay,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {
    timezone: {
      control: 'inline-radio',
      options: TYPES_OF_TW_CHART_TIMEZONES,
    },
  },
  args: {
    label: 'Label',
    value: 1_703_014_214, // 2023-12-19T19:30:14Z
    timezone: 'UTC',
  },
};
export default STORY_META;

export const Primary: StoryObj<DateValueDisplayProps> = {
  render: (args: DateValueDisplayProps) => {
    return <DateValueDisplay {...args} />;
  },
};
