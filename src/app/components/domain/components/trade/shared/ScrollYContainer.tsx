import React from 'react';

export interface ScrollYContainerProps {
  readonly children: React.ReactNode;
}

export function ScrollYContainer({
  children,
}: ScrollYContainerProps): React.ReactElement {
  return <div className='overflow-y-auto'>{children}</div>;
}
