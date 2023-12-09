/* eslint-disable unicorn/no-null */
import type { Meta, StoryObj } from '@storybook/react';
import { PrettyDisplay, PrettyDisplayProps } from './PrettyDisplay';
import { decoratorPadding } from '../../../../storybook';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CONTENT: any = {
  Actors: [
    {
      name: 'Tom Cruise',
      age: 56,
      'Born At': 'Syracuse, NY',
      Birthdate: 'July 3, 1962',
      photo: 'https://jsonformatter.org/img/tom-cruise.jpg',
      wife: null,
      weight: 67.5,
      hasChildren: true,
      hasGreyHair: false,
      children: ['Suri', 'Isabella Jane', 'Connor'],
    },
    {
      name: 'Robert Downey Jr.',
      age: 53,
      'Born At': 'New York City, NY',
      Birthdate: 'April 4, 1965',
      photo: 'https://jsonformatter.org/img/Robert-Downey-Jr.jpg',
      wife: 'Susan Downey',
      weight: 77.1,
      hasChildren: true,
      hasGreyHair: false,
      children: ['Indio Falconer', 'Avri Roel', 'Exton Elias'],
    },
  ],
};

const STORY_META: Meta<PrettyDisplayProps> = {
  component: PrettyDisplay,
  tags: ['autodocs'],
  decorators: [decoratorPadding()],
  argTypes: {},
  args: {
    content: CONTENT,
  },
};
export default STORY_META;

export const Primary: StoryObj<PrettyDisplayProps> = {
  render: (args: PrettyDisplayProps) => {
    return <PrettyDisplay {...args} />;
  },
};
