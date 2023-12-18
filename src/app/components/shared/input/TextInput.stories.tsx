import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TextInput, TextInputProps } from './TextInput';
import { decoratorPadding, disableControl } from '../../../../storybook';
import { PrettyDisplay } from '../display';

const STORY_META: Meta<TextInputProps> = {
  component: TextInput,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {
    value: disableControl(),
    onValueChange: disableControl(),
    onKeyDown: disableControl(),
  },
  args: {
    placeholder: 'Enter text here...',
    disabled: false,
    error: false,
    width: '',
  },
};
export default STORY_META;

export const Primary: StoryObj<TextInputProps> = {
  render: (args: TextInputProps) => {
    const { value: _ignore1, onValueChange: _ignore2, ...rest } = args;

    const [value, setValue] = useState('');

    return (
      <div>
        <TextInput {...rest} value={value} onValueChange={setValue} />
        <br />
        <br />
        <PrettyDisplay content={value} />
      </div>
    );
  },
};
