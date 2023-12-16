import type { Meta, StoryObj } from '@storybook/react';
import { TextInput, TextInputProps } from './TextInput';
import { decoratorPadding, disableControl } from '../../../../../storybook';
import { useState } from 'react';

const STORY_META: Meta<TextInputProps> = {
  component: TextInput,
  decorators: [decoratorPadding()],
  tags: ['autodocs'],
  argTypes: {
    value: disableControl(),
    onValueChange: disableControl(),
  },
  args: {
    placeholder: 'Placeholder',
  },
};
export default STORY_META;

export const Primary: StoryObj<TextInputProps> = {
  render: (args: TextInputProps) => {
    const { value: _ignore1, onValueChange: _ignore2, ...rest } = args;

    const [value, setValue] = useState<string>('');

    return <TextInput {...rest} value={value} onValueChange={setValue} />;
  },
};
