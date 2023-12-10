import { CSSProperties, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  TwSelectButton,
  TwSelectButtonProps,
  TwSelectOption,
} from './TwSelectButton';
import { range } from '@gmjs/array-create';
import { PrettyDisplay } from '../../../shared/display/PrettyDisplay';
import { decoratorPadding, disableControl } from '../../../../../storybook';

type BaseSelectValue = string;
type AllowUndefined = true;
// type SelectValue = TwSelectValue<BaseSelectValue, AllowUndefined>;
type SelectOption = TwSelectOption<string>;
type Props = TwSelectButtonProps<BaseSelectValue, AllowUndefined> & {
  readonly selectionWidthOption: 'number' | 'string';
  readonly selectionWidthNumber: number;
  readonly selectionWidthString: NonNullable<CSSProperties['width']>;
  readonly selectItemWidthOption: 'number' | 'string';
  readonly selectItemWidthNumber: number;
  readonly selectItemWidthString: NonNullable<CSSProperties['width']>;
};

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: TwSelectButton as any,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {
    value: disableControl(),
    onValueChange: disableControl(),
    selectItemRenderer: disableControl(),
    selectionWidthOption: {
      control: 'radio',
      options: ['number', 'string'],
    },
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
      selectionWidthNumber,
      selectionWidthOption,
      selectionWidthString,
      selectItemWidthNumber,
      selectItemWidthOption,
      selectItemWidthString,
      value: _ignore1,
      onValueChange: _ignore2,
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
        <TwSelectButton<BaseSelectValue, AllowUndefined>
          {...rest}
          value={value}
          onValueChange={setValue}
          selectionWidth={selectionWidth}
          selectItemWidth={selectItemWidth}
        />
        <br />
        <PrettyDisplay content={value} />
      </div>
    );
  },
};
