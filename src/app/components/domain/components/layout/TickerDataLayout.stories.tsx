import type { Meta, StoryObj } from '@storybook/react';
import { TickerDataLayout } from './TickerDataLayout';
import {
  EXAMPLE_CONTENT,
  EXAMPLE_FILL_CONTENT,
  EXAMPLE_TALL_CONTENT,
  EXAMPLE_TALL_WIDE_CONTENT,
  decoratorFullHeight,
} from '../../../../../storybook';

const TYPES_OF_CONTENT_TYPE = ['regular', 'tall'] as const;
const TYPES_OF_OPTIONAL_CONTENT_TYPE = [
  ...TYPES_OF_CONTENT_TYPE,
  'none',
] as const;

type ContentType = (typeof TYPES_OF_CONTENT_TYPE)[number];
type OptionalContentType = (typeof TYPES_OF_OPTIONAL_CONTENT_TYPE)[number];

type Props = {
  readonly main: ContentType;
  readonly top: boolean;
  readonly bottom: boolean;
  readonly left: OptionalContentType;
  readonly right: OptionalContentType;
};

const STORY_META: Meta<Props> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: TickerDataLayout as any,
  tags: ['autodocs'],
  decorators: [decoratorFullHeight()],
  argTypes: {
    main: {
      control: {
        type: 'inline-radio',
      },
      options: TYPES_OF_CONTENT_TYPE,
    },
    left: {
      control: {
        type: 'inline-radio',
      },
      options: TYPES_OF_OPTIONAL_CONTENT_TYPE,
    },
    right: {
      control: {
        type: 'inline-radio',
      },
      options: TYPES_OF_OPTIONAL_CONTENT_TYPE,
    },
  },
  args: {
    main: 'regular',
    top: true,
    bottom: true,
    left: 'regular',
    right: 'regular',
  },
};
export default STORY_META;

export const Primary: StoryObj<Props> = {
  render: (args: Props) => {
    const { main, top, bottom, left, right } = args;

    const mainContent = getContent(main, true);
    const topContent = top ? EXAMPLE_CONTENT : undefined;
    const bottomContent = bottom ? EXAMPLE_CONTENT : undefined;
    const leftContent = getContent(left, false);
    const rightContent = getContent(right, false);

    return (
      <TickerDataLayout
        main={mainContent}
        top={topContent}
        bottom={bottomContent}
        left={leftContent}
        right={rightContent}
      />
    );
  },
};

function getContent(
  type: OptionalContentType,
  isFill: boolean,
): React.ReactElement | undefined {
  switch (type) {
    case 'regular': {
      return isFill ? EXAMPLE_FILL_CONTENT : EXAMPLE_CONTENT;
    }
    case 'tall': {
      return isFill ? EXAMPLE_TALL_WIDE_CONTENT : EXAMPLE_TALL_CONTENT;
    }
    case 'none': {
      return undefined;
    }
  }
}
