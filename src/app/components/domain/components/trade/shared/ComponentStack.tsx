import React from 'react';
import cls from 'classnames';

export interface ComponentStackProps {
  readonly className?: string;
  readonly children: React.ReactNode;
}

export function ComponentStack({
  className,
  children,
}: ComponentStackProps): React.ReactElement {
  const childrenArray = React.Children.toArray(children);

  const classes = cls('flex flex-col gap-2', className);

  return (
    <div className={classes}>
      {childrenArray.map((component, index) => (
        <React.Fragment key={index}>
          {component}
          {index < childrenArray.length - 1 ? <hr /> : undefined}
        </React.Fragment>
      ))}
    </div>
  );
}
