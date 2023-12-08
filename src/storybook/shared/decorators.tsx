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

export function decoratorAbsolute(
  left: number = 0,
  top: number = 0,
  right: number = 0,
  bottom: number = 0,
): Decorator {
  return (Story: StoryFn) => (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', left, top, right, bottom }}>
        <Story />
      </div>
    </div>
  );
}
