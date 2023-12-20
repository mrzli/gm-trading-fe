import React, { CSSProperties } from 'react';

export interface PrettyDisplayProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly content: any;
}

const STYLE: CSSProperties = {
  border: '1px solid black',
  padding: 10,
  backgroundColor: '#EEEEEE',
  fontSize: 14,
  maxHeight: 400,
  overflow: 'auto',
};

export function PrettyDisplay({
  content,
}: PrettyDisplayProps): React.ReactElement {
  return (
    <pre style={STYLE}>
      <code>{JSON.stringify(content, undefined, 2)}</code>
    </pre>
  );
}
