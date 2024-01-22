import { useContext, useEffect, useState } from 'react';
import { AppContextData, AppContext } from '../../app-setup';
import { invariant } from '@gmjs/assert';

export function useAppContext(): AppContextData {
  return useContext(AppContext);
}

export interface UseElementRectResult {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

const DEFAULT_ELEMENT_RECT: UseElementRectResult = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

export function useElementRect(
  ref: React.RefObject<Element>,
): UseElementRectResult {
  const [rect, setRect] = useState<UseElementRectResult>(DEFAULT_ELEMENT_RECT);

  useEffect(
    () => {
      invariant(ref.current !== null, 'ref.current is undefined');

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const rect = entry.contentRect;
          setRect({
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
          });
        }
      });
      resizeObserver.observe(ref.current);
      return () => {
        resizeObserver.disconnect();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return rect;
}
