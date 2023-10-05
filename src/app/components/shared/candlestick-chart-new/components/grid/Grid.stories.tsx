import type { Meta, StoryObj } from '@storybook/react';
import { Grid, GridProps } from './Grid';
import { decoratorPadding, decoratorSvg } from '../../../../../../storybook';

const STORY_META: Meta<GridProps> = {
  component: Grid,
  tags: ['autodocs'],
  decorators: [decoratorSvg(840, 640), decoratorPadding()],
  args: {
    x: 20,
    y: 20,
    width: 800,
    height: 600,
    horizontal: [100, 200, 300, 400, 500],
    vertical: [100, 200, 350, 400, 500],
  }
};
export default STORY_META;

export const Primary: StoryObj<GridProps> = {
  render: (args: GridProps) => {
    return <Grid {...args} />;
  },
};
