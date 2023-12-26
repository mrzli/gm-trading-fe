import type { Meta, StoryObj } from '@storybook/react';
import {
  DecimalValueDisplay,
  DecimalValueDisplayProps,
} from './DecimalValueDisplay';
import { decoratorPadding } from '../../../../../../../storybook';

const STORY_META: Meta<DecimalValueDisplayProps> = {
  component: DecimalValueDisplay,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {},
  args: {},
};
export default STORY_META;

const Template: StoryObj<DecimalValueDisplayProps> = {
  render: (args: DecimalValueDisplayProps) => {
    return <DecimalValueDisplay {...args} />;
  },
};

export const WithValue: StoryObj<DecimalValueDisplayProps> = {
  ...Template,
  args: {
    label: 'Label',
    value: 12.3456,
    precision: 2,
  },
};

export const WithoutValue: StoryObj<DecimalValueDisplayProps> = {
  ...Template,
  args: {
    label: 'Label',
    value: undefined,
    precision: 2,
  },
};
