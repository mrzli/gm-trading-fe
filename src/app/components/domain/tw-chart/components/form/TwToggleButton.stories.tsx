import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TwToggleButton, TwToggleButtonProps } from './TwToggleButton';
import { decoratorPadding, disableControl } from '../../../../../../storybook';
import { PrettyDisplay } from '../../../../shared/display/PrettyDisplay';

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
        <PrettyDisplay content={value} />
      </div>
    );
  },
};
