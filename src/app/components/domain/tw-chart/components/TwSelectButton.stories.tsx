import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  TwSelectButton,
  TwSelectButtonProps,
  TwSelectOption,
} from './TwSelectButton';
import { range } from '@gmjs/array-create';
import { PrettyDisplay } from '../../../shared/display/PrettyDisplay';
import { decoratorPadding } from '../../../../../storybook';

function createOption(id: number): TwSelectOption {
  return {
    label: `Option ${id}`,
    value: `option-${id}`,
  };
}

function createOptions(count: number): readonly TwSelectOption[] {
  return range(1, count + 1).map((id) => createOption(id));
}

const OPTIONS: readonly TwSelectOption[] = createOptions(5);

const STORY_META: Meta<TwSelectButtonProps> = {
  component: TwSelectButton,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {},
  args: {
    options: OPTIONS,
  },
};
export default STORY_META;

export const Primary: StoryObj<TwSelectButtonProps> = {
  render: (args: TwSelectButtonProps) => {
    const { value: _ignore1, onValueChange: _ignore2, ...rest } = args;

    const { options } = args;

    const [value, setValue] = useState<string>(
      options.length > 0 ? options[0].value : '',
    );

    return (
      <div>
        <TwSelectButton {...rest} value={value} onValueChange={setValue} />
        <br />
        <PrettyDisplay content={value} />
      </div>
    );
  },
};
