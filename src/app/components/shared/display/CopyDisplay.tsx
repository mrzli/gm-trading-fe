import React, { CSSProperties, useCallback } from 'react';

export interface CopyDisplayProps {
  readonly content: string;
}

const STYLE: CSSProperties = {
  border: '1px solid black',
  padding: 10,
  backgroundColor: '#CCCCCC',
  fontSize: 14,
  maxHeight: 400,
  overflow: 'auto',
  cursor: 'pointer',
};

export function CopyDisplay({ content }: CopyDisplayProps): React.ReactElement {
  const handleClick = useCallback(() => {
    navigator.clipboard.writeText(content);
  }, [content]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <pre style={STYLE} onClick={handleClick}>
      <code>{content}</code>
    </pre>
  );
}
