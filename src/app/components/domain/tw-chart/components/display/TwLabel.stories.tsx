import type { Meta, StoryObj } from '@storybook/react';
import { TwLabel, TwLabelProps } from './TwLabel';
import { decoratorPadding } from '../../../../../../storybook';

const STORY_META: Meta<TwLabelProps> = {
  component: TwLabel,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {},
  args: {
    content: 'Label',
  },
};
export default STORY_META;

export const Primary: StoryObj<TwLabelProps> = {
  render: (args: TwLabelProps) => {
    return <TwLabel {...args} />;
  },
};
