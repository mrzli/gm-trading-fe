import { invariant } from '@gmjs/assert';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { fromEvent, map, switchMap, takeUntil } from 'rxjs';
import { Position } from '../../../../../../app/types';

export type UseDragOffsetResult<TElement extends HTMLElement | SVGElement> =
  readonly [React.RefObject<TElement>, number, number];

export function useDragOffset<
  TElement extends HTMLElement | SVGElement,
>(): UseDragOffsetResult<TElement> {
  const ref = useRef<TElement>(null);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  useLayoutEffect(() => {
    invariant(ref.current !== null, 'Reference to set to an element.');

    const mouseDown$ = fromEvent<MouseEvent>(ref.current, 'mousedown');
    const mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove');
    const mouseUp$ = fromEvent<MouseEvent>(document, 'mouseup');

    const drag$ = mouseDown$.pipe(
      switchMap((startEvent: MouseEvent) => {
        const startX = startEvent.pageX;
        const startY = startEvent.pageY;

        return mouseMove$.pipe(
          map((moveEvent: MouseEvent) => ({
            x: moveEvent.pageX - startX,
            y: moveEvent.pageY - startY,
          })),
          takeUntil(mouseUp$),
        );
      }),
    );

    const subscription = drag$.subscribe((pos) => setPosition(pos));

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return [ref, position.x, position.y];
}
