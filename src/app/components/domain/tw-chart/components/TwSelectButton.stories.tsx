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
  readonly widthOption: 'number' | 'string';
  readonly widthNumber: number;
  readonly widthString: NonNullable<CSSProperties['width']>;
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
    widthOption: {
      control: 'radio',
      options: ['number', 'string'],
    },
  },
  args: {
    placeholder: 'Select an option...',
    options: OPTIONS,
    widthOption: 'number',
    widthNumber: 200,
    widthString: '50vw',
  },
};
export default STORY_META;

export const Primary: StoryObj<Props> = {
  render: (args: Props) => {
    const {
      widthOption,
      widthNumber,
      widthString,
      value: _ignore1,
      onValueChange: _ignore2,
      ...rest
    } = args;

    const [value, setValue] = useState<string | undefined>(undefined);

    const width: CSSProperties['width'] =
      widthOption === 'number' ? widthNumber : widthString;

    return (
      <div>
        <TwSelectButton<BaseSelectValue, AllowUndefined>
          {...rest}
          value={value}
          onValueChange={setValue}
          width={width}
        />
        <br />
        <PrettyDisplay content={value} />
      </div>
    );
  },
};
