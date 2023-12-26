const ARRAY_100 = Array.from({ length: 100 }, (_, i) => i);

function createTallContent(text: string): React.ReactElement {
  return (
    <>
      {ARRAY_100.map((i) => (
        <div key={i}>{text}</div>
      ))}
    </>
  );
}

export const EXAMPLE_CONTENT: React.ReactElement = (
  <div className={'bg-orange-300'}>Some Content</div>
);

export const EXAMPLE_TALL_CONTENT: React.ReactElement = (
  <div className={'bg-orange-300'}>{createTallContent('Some Content')}</div>
);

export const EXAMPLE_FILL_CONTENT: React.ReactElement = (
  <div className={'bg-orange-300 w-full h-full'}>Some Fill Content</div>
);

export const EXAMPLE_TALL_WIDE_CONTENT: React.ReactElement = (
  <div className={'bg-orange-300 w-full'}>
    {createTallContent('Some Tall Wide Content')}
  </div>
);
