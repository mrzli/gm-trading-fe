/* eslint-disable react/display-name */
import { CSSProperties } from 'react';
import { Decorator, StoryFn } from '@storybook/react';

export function decoratorContainer(properties: CSSProperties): Decorator {
  return (Story: StoryFn) => (
    <div style={properties}>
      <Story />
    </div>
  );
}

export function decoratorFullHeight(): Decorator {
  return (Story: StoryFn) => (
    <div style={{ height: '100vh' }}>
      <Story />
    </div>
  );
}

export function decoratorWidth(width: number = 200): Decorator {
  return (Story: StoryFn) => (
    <div style={{ width }}>
      <Story />
    </div>
  );
}

export function decoratorPadding(padding: number = 16): Decorator {
  return (Story: StoryFn) => (
    <div style={{ padding }}>
      <Story />
    </div>
  );
}

export function decoratorBorder(): Decorator {
  return (Story: StoryFn) => (
    <div style={{ border: '1px solid black', display: 'inline-flex' }}>
      <Story />
    </div>
  );
}
