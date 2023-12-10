import type { Meta, StoryObj } from '@storybook/react';
import { TwChartToolbar, TwChartToolbarProps } from './TwChartToolbar';
import { decoratorPadding, disableControl } from '../../../../../storybook';
import { useState } from 'react';
import { TwChartSettings } from '../types';
import { DEFAULT_TW_CHART_SETTINGS } from '../util';
import { PrettyDisplay } from '../../../shared/display/PrettyDisplay';

const STORY_META: Meta<TwChartToolbarProps> = {
  component: TwChartToolbar,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {
    settings: disableControl(),
    onSettingsChange: disableControl(),
  },
  args: {
  },
};
export default STORY_META;

export const Primary: StoryObj<TwChartToolbarProps> = {
  render: (args: TwChartToolbarProps) => {
    const { settings: _ignore1, onSettingsChange: _ignore2, ...rest } = args;

    const [settings, setSettings] = useState<TwChartSettings>(
      DEFAULT_TW_CHART_SETTINGS,
    );

    return (
      <div>
        <TwChartToolbar
          {...rest}
          settings={settings}
          onSettingsChange={setSettings}
        />
        <div style={{ marginTop: 20 }}>
          <PrettyDisplay content={settings} />
        </div>
      </div>
    );
  },
};
