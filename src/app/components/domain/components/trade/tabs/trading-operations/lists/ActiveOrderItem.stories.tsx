import type { Meta, StoryObj } from '@storybook/react';
import { ActiveOrderItem, ActiveOrderItemProps } from './ActiveOrderItem';
import {
  argTypeInlineRadio,
  decoratorPadding,
  disableControl,
} from '../../../../../../../../storybook';
import { DEFAULT_TRADING_PARAMS } from '../../../util';
import { ActiveOrder, AmendOrderData } from '../../../types';
import { TYPES_OF_CHART_TIMEZONES } from '../../../../../types';
import { useState } from 'react';

const STORY_META: Meta<ActiveOrderItemProps> = {
  component: ActiveOrderItem,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {
    timezone: argTypeInlineRadio(TYPES_OF_CHART_TIMEZONES),
    item: disableControl(),
    onEdit: disableControl(),
    onCancel: disableControl(),
    isEditing: disableControl(),
    onEditOk: disableControl(),
    onEditCancel: disableControl(),
  },
  args: {
    timezone: 'UTC',
    tradingParams: DEFAULT_TRADING_PARAMS,
  },
};
export default STORY_META;

const TIME = 1_703_014_214; // 2023-12-19T19:30:14Z;

const ITEM: ActiveOrder = {
  id: 0,
  time: TIME,
  price: 1000,
  amount: 5,
  stopLossDistance: 10,
  limitDistance: 20,
};

export const Primary: StoryObj<ActiveOrderItemProps> = {
  render: (args: ActiveOrderItemProps) => {
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
      <ActiveOrderItem
        {...rest}
        item={item}
        onEdit={() => {
          setEditing(!editing);
        }}
        isEditing={editing}
        onEditOk={(data: AmendOrderData) => {
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
