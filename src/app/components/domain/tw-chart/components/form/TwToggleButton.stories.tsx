import type { Meta, StoryObj } from '@storybook/react';
import { TwToggleButton, TwToggleButtonProps } from './TwToggleButton';
import { decoratorPadding, disableControl } from '../../../../../../storybook';
import { useState } from 'react';

const STORY_META: Meta<TwToggleButtonProps> = {
  component: TwToggleButton,
  decorators: [decoratorPadding()],
  argTypes: {
    value: disableControl(),
    onValueChange: disableControl(),
  },
  args: {
    label: 'Toggle Button',
    disabled: false,
  },
};
export default STORY_META;

export const Primary: StoryObj<TwToggleButtonProps> = {
  render: (args: TwToggleButtonProps) => {
    const { value: _ignore1, onValueChange: _ignore2, ...rest } = args;

    const [value, setValue] = useState(false);

    return (
      <div>
        <TwToggleButton {...rest} value={value} onValueChange={setValue} />
        <br />
        <br />
        <div>Value: {value.toString()}</div>
      </div>
    );
  },
};
