import { CSSProperties, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  SelectButtonCentered,
  SelectButtonCenteredProps,
} from './SelectButtonCentered';
import { SelectOption } from './types';
import { decoratorPadding, disableControl } from '../../../../../storybook';
import { range } from '@gmjs/array-create';
import { PrettyDisplay } from '../../display/PrettyDisplay';

type BaseSelectValue = string;
type AllowUndefined = true;
// type SelectValue = TwSelectValue<BaseSelectValue, AllowUndefined>;
type StringSelectOption = SelectOption<string>;
type Props = SelectButtonCenteredProps<BaseSelectValue, AllowUndefined> & {
  readonly widthOption: 'number' | 'string';
  readonly widthNumber: number;
  readonly widthString: NonNullable<CSSProperties['width']>;
};

function createOption(id: number): StringSelectOption {
  return {
    label: `Option ${id}`,
    value: `option-${id}`,
  };
}

function createOptions(count: number): readonly StringSelectOption[] {
  return range(1, count + 1).map((id) => createOption(id));
}

const OPTIONS: readonly StringSelectOption[] = createOptions(5);

const STORY_META: Meta<Props> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: SelectButtonCentered as any,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {
    value: disableControl(),
    onValueChange: disableControl(),
    width: disableControl(),
    widthOption: {
      control: 'radio',
      options: ['number', 'string'],
    },
  },
  args: {
    placeholder: 'Select an option...',
    options: OPTIONS,
    widthOption: 'number',
    widthNumber: 400,
    widthString: '50vw',
  },
};
export default STORY_META;

export const Primary: StoryObj<Props> = {
  render: (args: Props) => {
    const {
      value: _ignore1,
      onValueChange: _ignore2,
      widthNumber,
      widthOption,
      widthString,
      ...rest
    } = args;

    const [value, setValue] = useState<string | undefined>(undefined);

    const width: CSSProperties['width'] =
      widthOption === 'number' ? widthNumber : widthString;

    return (
      <div>
        <SelectButtonCentered<BaseSelectValue, AllowUndefined>
          {...rest}
          value={value}
          onValueChange={setValue}
          width={width}
        />
        <br />
        <br />
        <PrettyDisplay content={value} />
      </div>
    );
  },
};
