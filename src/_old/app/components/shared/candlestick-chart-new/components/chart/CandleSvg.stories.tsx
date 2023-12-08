import type { Meta, StoryObj } from '@storybook/react';
import { CandleSvg, CandleSvgProps } from './CandleSvg';
import { decoratorSvg, decoratorPadding } from '../../../../../../storybook';

const STORY_META: Meta<CandleSvgProps> = {
  component: CandleSvg,
  tags: ['autodocs'],
  decorators: [decoratorSvg(500, 500), decoratorPadding()],
};
export default STORY_META;

export const Primary: StoryObj<CandleSvgProps> = {
  render: (args: CandleSvgProps) => {
    return <CandleSvg {...args} />;
  },
  args: {
    x: 100,
    w: 20,
    y1: 100,
    y2: 150,
    y3: 250,
    y4: 300,
    isBull: false,
  }
};
