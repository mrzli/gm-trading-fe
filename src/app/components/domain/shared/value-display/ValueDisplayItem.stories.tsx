import type { Meta, StoryObj } from '@storybook/react';
import { ValueDisplayItem, ValueDisplayItemProps } from './ValueDisplayItem';
import { decoratorBorder, decoratorPadding } from '../../../../../storybook';
import { VALUE_DISPLAY_DATA_NONE } from '../../util';

const STORY_META: Meta<ValueDisplayItemProps> = {
  component: ValueDisplayItem,
  tags: ['autodocs'],
  decorators: [decoratorPadding(), decoratorBorder(), decoratorPadding()],
  argTypes: {},
  args: {},
};
export default STORY_META;

const Template: StoryObj<ValueDisplayItemProps> = {
  render: (args: ValueDisplayItemProps) => {
    return <ValueDisplayItem {...args} />;
  },
};

export const String: StoryObj<ValueDisplayItemProps> = {
  ...Template,
  args: {
    item: {
      kind: 'string',
      label: 'Label',
      value: 'Value',
    },
  },
};

export const Decimal: StoryObj<ValueDisplayItemProps> = {
  ...Template,
  args: {
    item: {
      kind: 'decimal',
      label: 'Label',
      value: 12.3456,
      precision: 2,
    },
  },
};

export const Date: StoryObj<ValueDisplayItemProps> = {
  ...Template,
  args: {
    item: {
      kind: 'date',
      label: 'Label',
      value: 1_703_014_214, // 2023-12-19T19:30:14Z
      timezone: 'UTC',
    },
  },
};

export const None: StoryObj<ValueDisplayItemProps> = {
  ...Template,
  args: {
    item: VALUE_DISPLAY_DATA_NONE,
  },
};
