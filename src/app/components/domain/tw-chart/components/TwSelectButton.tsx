/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useCallback, useMemo, useState } from 'react';
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

export interface TwSelectOption<TValue extends string> {
  readonly label: string;
  readonly value: TValue;
}

export interface TwSelectButtonProps<TValue extends string> {
  readonly placeholder?: string;
  readonly options: readonly TwSelectOption<TValue>[];
  readonly value: TValue | undefined;
  readonly onValueChange: (value: TValue | undefined) => void;
}

export function TwSelectButton<TValue extends string = string>({
  placeholder,
  options,
  value,
  onValueChange,
}: TwSelectButtonProps<TValue>): React.ReactElement {
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
    (v: TValue, _index: number) => {
      setIsOpen(false);
      onValueChange(v);
    },
    [onValueChange, setIsOpen],
  );

  const label = useMemo(() => {
    const option = options.find((o) => o.value === value);
    return option?.label;
  }, [options, value]);

  return (
    <div>
      <div
        ref={refs.setReference}
        className='px-1 text-sm border rounded border-slate-400 bg-slate-100 cursor-pointer outline-none inline-flex items-center justify-center min-h-[24px] min-w-[24px]'
        {...getReferenceProps()}
      >
        {label ?? placeholder}
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
