import type { Meta, StoryObj } from '@storybook/react';
import {
  TradeSequenceInputsDisplay,
  TradeSequenceInputsDisplayProps,
} from './TradeSequenceInputsDisplay';
import { decoratorPadding, disableControl } from '../../../../../storybook';
import { PrettyDisplay } from '../../../shared/display/PrettyDisplay';
import { TradeSequenceInput } from '../types';
import { useState } from 'react';

const STORY_META: Meta<TradeSequenceInputsDisplayProps> = {
  component: TradeSequenceInputsDisplay,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {
    value: disableControl(),
    onValueChange: disableControl(),
  },
  args: {},
};
export default STORY_META;

export const Primary: StoryObj<TradeSequenceInputsDisplayProps> = {
  render: (args: TradeSequenceInputsDisplayProps) => {
    const { value: _ignore1, onValueChange: _ignore2, ...rest } = args;

    const [value, setValue] = useState<TradeSequenceInput>({
      initialBalance: 100_000,
      spread: 0.5,
      marginPercent: 0.5,
      avgSlippage: 0,
    });

    return (
      <div>
        <TradeSequenceInputsDisplay
          {...rest}
          value={value}
          onValueChange={setValue}
        />
        <br />
        <br />
        <PrettyDisplay content={value} />
      </div>
    );
  },
};
