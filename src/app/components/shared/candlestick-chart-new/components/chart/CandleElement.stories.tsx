import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CandleElement, CandleElementProps } from './CandleElement';
import {
  decoratorPadding,
  decoratorSvg,
  disableControl,
} from '../../../../../../storybook';

const STORY_META: Meta<CandleElementProps> = {
  component: CandleElement,
  tags: ['autodocs'],
  decorators: [decoratorSvg(800, 800), decoratorPadding()],
  argTypes: {
    isSelected: disableControl(),
    onMouseOver: disableControl(),
  },
};
export default STORY_META;

export const Primary: StoryObj<CandleElementProps> = {
  render: (args: CandleElementProps) => {
    const { onMouseOver: _ignore1, isSelected: _ignore2, ...rest } = args;

    const [isSelected, setSelected] = useState(false);

    return (
      <CandleElement
        {...rest}
        isSelected={isSelected}
        onMouseOver={(index): void => {
          setSelected(index !== undefined);
        }}
      />
    );
  },
  args: {
    slotX: 320,
    slotWidth: 80,
    y1: 145,
    y2: 565,
    y3: 500,
    y4: 240,
    isBull: true,
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
