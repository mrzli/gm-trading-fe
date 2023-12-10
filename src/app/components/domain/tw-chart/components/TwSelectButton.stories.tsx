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

type SelectOption = TwSelectOption<string>;
type Props = TwSelectButtonProps<SelectOption['value']>;

function createOption(id: number): SelectOption {
  return {
    label: `Option ${id}`,
    value: `option-${id}`,
  };
}

function createOptions(count: number): readonly SelectOption[] {
  return range(1, count + 1).map((id) => createOption(id));
}

const OPTIONS: readonly SelectOption[] = createOptions(5);

const STORY_META: Meta<Props> = {
  component: TwSelectButton,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {},
  args: {
    placeholder: 'Select an option...',
    options: OPTIONS,
  },
};
export default STORY_META;

export const Primary: StoryObj<Props> = {
  render: (args: Props) => {
    const { value: _ignore1, onValueChange: _ignore2, ...rest } = args;

    const [value, setValue] = useState<string | undefined>(undefined);

    return (
      <div>
        <TwSelectButton {...rest} value={value} onValueChange={setValue} />
        <br />
        <PrettyDisplay content={value} />
      </div>
    );
  },
};
