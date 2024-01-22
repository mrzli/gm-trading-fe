import React, { useCallback } from 'react';
import {
  FloatingFocusManager,
  FloatingPortal,
  flip,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react';
import { useElementRect } from '../../../util';

export interface PopoverProps {
  readonly trigger: React.ReactNode;
  readonly content: React.ReactNode;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly disabled?: boolean;
}

export function Popover({
  trigger,
  content,
  open,
  onOpenChange,
  disabled,
}: PopoverProps): React.ReactElement {
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (disabled) {
        return;
      }
      onOpenChange(open);
    },
    [disabled, onOpenChange],
  );

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-start',
    open,
    onOpenChange: handleOpenChange,
    middleware: [offset(2), flip({ padding: 10 })],
  });

  const referenceRect = useElementRect(refs.domReference);
  const { width: referenceWidth } = referenceRect;

  const click = useClick(context, { event: 'mousedown' });
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    dismiss,
    click,
  ]);

  return (
    <div className='inline-flex'>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className='inline-flex w-full'
      >
        {trigger}
      </div>
      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={{ ...floatingStyles, width: referenceWidth }}
              {...getFloatingProps()}
              className='outline-none z-20'
            >
              {content}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  );
}
