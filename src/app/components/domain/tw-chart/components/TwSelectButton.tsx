/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useCallback, useState } from 'react';
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

export interface TwSelectOption {
  readonly label: string;
  readonly value: string;
}

export interface TwSelectButtonProps {
  readonly options: readonly TwSelectOption[];
  readonly value: string;
  readonly onValueChange: (value: string) => void;
}

export function TwSelectButton({
  options,
  value,
  onValueChange,
}: TwSelectButtonProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-start',
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(2), flip({ padding: 10 })],
  });

  const click = useClick(context, { event: 'mousedown' });
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [dismiss, click],
  );

  const handleSelect = useCallback(
    (v: string, _index: number) => {
      setIsOpen(false);
      onValueChange(v);
    },
    [onValueChange, setIsOpen],
  );

  return (
    <div>
      <div
        ref={refs.setReference}
        className='px-1 text-sm border rounded border-slate-400 bg-slate-100 cursor-pointer outline-none inline-flex items-center justify-center min-h-[24px] min-w-[24px]'
        {...getReferenceProps()}
      >
        {value}
      </div>
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className='text-sm border rounded border-slate-400 bg-slate-100 overflow-y-auto bg-white outline-none'
              {...getFloatingProps()}
            >
              {options.map((o, i) => (
                <div
                  key={o.value}
                  className={'cursor-pointer px-1 hover:bg-slate-200'}
                  onClick={() => {
                    handleSelect(o.value, i);
                  }}
                  {...getItemProps()}
                >
                  {o.label}
                </div>
              ))}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  );
}
