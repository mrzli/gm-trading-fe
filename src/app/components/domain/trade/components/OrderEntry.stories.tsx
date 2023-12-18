import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OrderEntry, OrderEntryProps } from './OrderEntry';
import { decoratorPadding, disableControl } from '../../../../../storybook';
import { OrderInput } from '../types';

const STORY_META: Meta<OrderEntryProps> = {
  component: OrderEntry,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {
    value: disableControl(),
    onValueChange: disableControl(),
  },
  args: {},
};
export default STORY_META;

export const Primary: StoryObj<OrderEntryProps> = {
  render: (args: OrderEntryProps) => {
    const { value: _ignore1, onValueChange: _ignore2, ...rest } = args;

    const [value, setValue] = useState<OrderInput>({
      price: undefined,
      amount: 1,
    });

    return (
      <OrderEntry {...rest} value={value} onValueChange={setValue} />
    );
  },
};
