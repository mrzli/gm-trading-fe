/* eslint-disable react/display-name */
import { Decorator, StoryFn } from '@storybook/react';

export function decoratorSvg(width: number, height: number): Decorator {
  return (Story: StoryFn) => {
    return (
      <svg width={width} height={height}>
        <Story />
      </svg>
    );
  };
}
