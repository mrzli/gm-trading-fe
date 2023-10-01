import type { Meta, StoryObj } from '@storybook/react';
import { arrayOfMapped } from '@gmjs/array-create';
import {
  SelectInput,
  SelectInputOption,
  SelectInputProps,
} from './SelectInput';
import { decoratorPadding, disableControl } from '../../../../storybook';
import { useState } from 'react';

const OPTIONS: readonly SelectInputOption[] = arrayOfMapped(5, (i) => ({
  value: `value-${i}`,
  label: `Label ${i}`,
}));

const STORY_META: Meta<SelectInputProps> = {
  component: SelectInput,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {
    options: disableControl(),
    value: disableControl(),
    onValueChange: disableControl(),
  },
  args: {
    options: OPTIONS,
  },
};
export default STORY_META;

export const Primary: StoryObj<SelectInputProps> = {
  render: (args: SelectInputProps) => {
    const { value: _ignore1, onValueChange: _ignore2, ...rest } = args;

    const [value, setValue] = useState<string>('');

    return (
      <div>
        <SelectInput {...rest} value={value} onValueChange={setValue} />
        <br />
        <div>
          Value: <code>{value === '' ? '<empty>' : value}</code>
        </div>
      </div>
    );
  },
};
