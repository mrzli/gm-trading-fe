import type { Meta, StoryObj } from '@storybook/react';
import {
  AnotherScreenContent,
  AnotherScreenContentProps,
} from './AnotherScreenContent';

const STORY_META: Meta<AnotherScreenContentProps> = {
  component: AnotherScreenContent,
  args: {
    text: 'Some text',
  },
};
export default STORY_META;

export const Primary: StoryObj<AnotherScreenContentProps> = {
  render: (args: AnotherScreenContentProps) => {
    return <AnotherScreenContent {...args} />;
  },
};
