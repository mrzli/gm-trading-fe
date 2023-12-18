import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ToggleButton, ToggleButtonProps } from './ToggleButton';
import { decoratorPadding, disableControl } from '../../../../storybook';
import { PrettyDisplay } from '../display/PrettyDisplay';

const STORY_META: Meta<ToggleButtonProps> = {
  component: ToggleButton,
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

export const Primary: StoryObj<ToggleButtonProps> = {
  render: (args: ToggleButtonProps) => {
    const { value: _ignore1, onValueChange: _ignore2, ...rest } = args;

    const [value, setValue] = useState(false);

    return (
      <div>
        <ToggleButton {...rest} value={value} onValueChange={setValue} />
        <br />
        <br />
        <PrettyDisplay content={value} />
      </div>
    );
  },
};
