import type { Meta, StoryObj } from '@storybook/react';
import { Label, LabelProps } from './Label';
import { decoratorPadding } from '../../../../storybook';

const STORY_META: Meta<LabelProps> = {
  component: Label,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {},
  args: {
    content: 'Label',
  },
};
export default STORY_META;

export const Primary: StoryObj<LabelProps> = {
  render: (args: LabelProps) => {
    return <Label {...args} />;
  },
};
