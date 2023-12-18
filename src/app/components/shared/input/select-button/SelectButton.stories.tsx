import { CSSProperties, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SelectButton, SelectButtonProps } from './SelectButton';
import { range } from '@gmjs/array-create';
import { PrettyDisplay } from '../../display/PrettyDisplay';
import { decoratorPadding, disableControl } from '../../../../../storybook';
import { SelectOption } from './types';

type BaseSelectValue = string;
type AllowUndefined = true;
// type SelectValue = TwSelectValue<BaseSelectValue, AllowUndefined>;
type StringSelectOption = SelectOption<string>;
type Props = SelectButtonProps<BaseSelectValue, AllowUndefined> & {
  readonly selectionWidthOption: 'number' | 'string';
  readonly selectionWidthNumber: number;
  readonly selectionWidthString: NonNullable<CSSProperties['width']>;
  readonly selectItemWidthOption: 'number' | 'string';
  readonly selectItemWidthNumber: number;
  readonly selectItemWidthString: NonNullable<CSSProperties['width']>;
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
  component: SelectButton as any,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {
    value: disableControl(),
    onValueChange: disableControl(),
    selectionRenderer: disableControl(),
    selectItemRenderer: disableControl(),
    selectionWidth: disableControl(),
    selectionWidthOption: {
      control: 'radio',
      options: ['number', 'string'],
    },
    selectItemWidth: disableControl(),
    selectItemWidthOption: {
      control: 'radio',
      options: ['number', 'string'],
    },
  },
  args: {
    placeholder: 'Select an option...',
    options: OPTIONS,
    selectionWidthOption: 'number',
    selectionWidthNumber: 200,
    selectionWidthString: '50vw',
    selectItemWidthOption: 'number',
    selectItemWidthNumber: 200,
    selectItemWidthString: '50vw',
  },
};
export default STORY_META;

export const Primary: StoryObj<Props> = {
  render: (args: Props) => {
    const {
      value: _ignore1,
      onValueChange: _ignore2,
      selectionWidthNumber,
      selectionWidthOption,
      selectionWidthString,
      selectItemWidthNumber,
      selectItemWidthOption,
      selectItemWidthString,
      ...rest
    } = args;

    const [value, setValue] = useState<string | undefined>(undefined);

    const selectionWidth: CSSProperties['width'] =
      selectionWidthOption === 'number'
        ? selectionWidthNumber
        : selectionWidthString;

    const selectItemWidth: CSSProperties['width'] =
      selectItemWidthOption === 'number'
        ? selectItemWidthNumber
        : selectItemWidthString;

    return (
      <div>
        <SelectButton<BaseSelectValue, AllowUndefined>
          {...rest}
          value={value}
          onValueChange={setValue}
          selectionWidth={selectionWidth}
          selectItemWidth={selectItemWidth}
        />
        <br />
        <br />
        <PrettyDisplay content={value} />
      </div>
    );
  },
};
