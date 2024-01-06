import React, { useState } from 'react';
import { Popover } from './Popover';

export interface PopupMenuProps {
  readonly triggerContent: React.ReactNode;
  readonly content: React.ReactNode;
}

export function PopupMenu({
  triggerContent,
  content,
}: PopupMenuProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  const trigger = (
    <div className='text-sm border rounded border-slate-400 bg-slate-100 cursor-pointer outline-none inline-flex items-center min-h-[24px] min-w-[24px] select-none px-1'>
      {triggerContent}
    </div>
  );

  const contentWrapper = (
    <div className='border rounded border-slate-400 shadow-sm p-1'>
      {content}
    </div>
  );

  return (
    <Popover
      trigger={trigger}
      content={contentWrapper}
      open={isOpen}
      onOpenChange={setIsOpen}
    />
  );
}
