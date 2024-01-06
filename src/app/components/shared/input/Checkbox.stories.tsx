import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox, CheckboxProps } from './Checkbox';
import { decoratorPadding, disableControl } from '../../../../storybook';
import { PrettyDisplay } from '../display';

const STORY_META: Meta<CheckboxProps> = {
  component: Checkbox,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {
    value: disableControl(),
    onValueChange: disableControl(),
  },
  args: {
    label: 'Checkbox',
  },
};
export default STORY_META;

export const Primary: StoryObj<CheckboxProps> = {
  render: (args: CheckboxProps) => {
    const { value: _ignoreValue, onValueChange: _ignoreOnValueChange, ...rest } = args;

    const [value, setValue] = useState(false);

    return (
      <div>
        <Checkbox {...rest} value={value} onValueChange={setValue} />
        <br />
        <PrettyDisplay content={value} />
      </div>
    );
  },
};
