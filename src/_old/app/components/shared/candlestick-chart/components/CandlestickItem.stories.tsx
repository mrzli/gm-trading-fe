import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CandlestickItem, CandlestickItemProps } from './CandlestickItem';
import {
  decoratorPadding,
  decoratorSvg,
  disableControl,
} from '../../../../../../storybook';

const STORY_META: Meta<CandlestickItemProps> = {
  component: CandlestickItem,
  decorators: [decoratorSvg(800, 800), decoratorPadding()],
  argTypes: {
    isSelected: disableControl(),
    onMouseOver: disableControl(),
  },
};
export default STORY_META;

export const Primary: StoryObj<CandlestickItemProps> = {
  render: (args: CandlestickItemProps) => {
    const { onMouseOver: _ignore1, isSelected: _ignore2, ...rest } = args;

    const [isSelected, setSelected] = useState(false);

    return (
      <CandlestickItem
        {...rest}
        isSelected={isSelected}
        onMouseOver={(index): void => {
          setSelected(index !== undefined);
        }}
      />
    );
  },
  args: {
    x: 320,
    w: 40,
    o: 500,
    h: 145,
    l: 565,
    c: 240,
    i: 0,
    isSelected: false,
    precision: 1,
    tooltipData: {
      ts: 1_672_531_200,
      o: 50,
      h: 60,
      l: 20,
      c: 30,
    },
  },
};
