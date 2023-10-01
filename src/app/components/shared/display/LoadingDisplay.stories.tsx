import type { Meta, StoryObj } from '@storybook/react';
import type { EmptyObject } from '@gmjs/generic-types';
import { LoadingDisplay } from './LoadingDisplay';

type LoadingDisplayProps = EmptyObject;

const STORY_META: Meta<LoadingDisplayProps> = {
  component: LoadingDisplay,
};
export default STORY_META;

export const Primary: StoryObj<LoadingDisplayProps> = {
  render: (_args: LoadingDisplayProps) => {
    return <LoadingDisplay />;
  },
};
