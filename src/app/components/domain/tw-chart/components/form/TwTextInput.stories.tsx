import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TwTextInput, TwTextInputProps } from './TwITextnput';
import { decoratorPadding, disableControl } from '../../../../../../storybook';
import { PrettyDisplay } from '../../../../shared/display/PrettyDisplay';

const STORY_META: Meta<TwTextInputProps> = {
  component: TwTextInput,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {
    value: disableControl(),
    onValueChange: disableControl(),
  },
  args: {
    placeholder: 'Enter text here...',
    disabled: false,
    error: false,
    width: '',
  },
};
export default STORY_META;

export const Primary: StoryObj<TwTextInputProps> = {
  render: (args: TwTextInputProps) => {
    const { value: _ignore1, onValueChange: _ignore2, ...rest } = args;

    const [value, setValue] = useState('');

    return (
      <div>
        <TwTextInput {...rest} value={value} onValueChange={setValue} />
        <br />
        <br />
        <PrettyDisplay content={value} />
      </div>
    );
  },
};
