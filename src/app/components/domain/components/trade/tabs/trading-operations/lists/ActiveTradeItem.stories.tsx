import type { Meta, StoryObj } from '@storybook/react';
import { ActiveTradeItem, ActiveTradeItemProps } from './ActiveTradeItem';
import {
  argTypeInlineRadio,
  decoratorPadding,
  disableControl,
} from '../../../../../../../../storybook';
import { DEFAULT_TRADING_PARAMS } from '../../../util';
import { ActiveTrade, AmendTradeData } from '../../../types';
import { TYPES_OF_CHART_TIMEZONES } from '../../../../../types';
import { useState } from 'react';
import { TEST_TICKER_BARS_MINUTE } from '../../../../../data';

const BAR = TEST_TICKER_BARS_MINUTE[10];

const STORY_META: Meta<ActiveTradeItemProps> = {
  component: ActiveTradeItem,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {
    timezone: argTypeInlineRadio(TYPES_OF_CHART_TIMEZONES),
    bar: disableControl(),
    item: disableControl(),
    onEdit: disableControl(),
    onClose: disableControl(),
    isEditing: disableControl(),
    onEditOk: disableControl(),
    onEditCancel: disableControl(),
  },
  args: {
    timezone: 'UTC',
    tradingParams: DEFAULT_TRADING_PARAMS,
    bar: BAR,
  },
};
export default STORY_META;

const TIME = 1_703_014_214; // 2023-12-19T19:30:14Z;

const ITEM: ActiveTrade = {
  id: 0,
  openTime: TIME,
  openPrice: 1000,
  amount: 5,
  stopLoss: 990,
  limit: 1020,
};

export const Primary: StoryObj<ActiveTradeItemProps> = {
  render: (args: ActiveTradeItemProps) => {
    const {
      item: _ignore1,
      onEdit: _ignore2,
      isEditing: _ignore3,
      onEditOk: _ignore4,
      onEditCancel: _ignore5,
      ...rest
    } = args;

    const [item, setItem] = useState(ITEM);

    const [editing, setEditing] = useState(false);

    return (
      <ActiveTradeItem
        {...rest}
        item={item}
        onEdit={() => {
          setEditing(!editing);
        }}
        isEditing={editing}
        onEditOk={(data: AmendTradeData) => {
          setItem({
            ...item,
            ...data,
          });
          setEditing(false);
        }}
        onEditCancel={() => {
          setEditing(false);
        }}
      />
    );
  },
};
