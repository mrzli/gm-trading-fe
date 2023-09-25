import type { Meta, StoryObj } from '@storybook/react';
import { TooltipDisplay, TooltipDisplayProps } from './TooltipDisplay';
import { decoratorPadding, disableControl } from '../../../../storybook';

const STORY_META: Meta<TooltipDisplayProps> = {
  component: TooltipDisplay,
  decorators: [decoratorPadding()],
  argTypes: {
    children: disableControl(),
  },
};
export default STORY_META;

export const Primary: StoryObj<TooltipDisplayProps> = {
  render: (args: TooltipDisplayProps) => {
    const { children: _ignore1, ...rest } = args;

    return (
      <TooltipDisplay {...rest}>
        <div>Some Tooltip</div>
      </TooltipDisplay>
    );
  },
};
