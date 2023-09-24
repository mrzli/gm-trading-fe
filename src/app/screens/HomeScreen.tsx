import React, { useEffect, useState } from 'react';
import iconAsset from '../../assets/icon.svg';
import iconLogo from '/icon.svg';
import { useStoreExample } from '../../store';
import { useAppContext } from '../util';
import { Link } from 'react-router-dom';

export function HomeScreen(): React.ReactElement {
  const [count, setCount] = useState(0);

  const context = useAppContext();
  const { example, isLoadingExample, getExample } = useStoreExample();

  useEffect(() => {
    getExample();
  }, [getExample]);

  return (
    <>
      <div>
        <div>
          <Link to='/another'>Another Screen</Link>
        </div>
        <br />
        <div className='text-3xl font-bold underline'>Tailwind styled</div>
        <br />
        <a href='https://example.com' target='_blank' rel='noreferrer'>
          <img
            src={iconLogo}
            alt='Example logo'
            style={{ width: 64, height: 64 }}
          />
        </a>
        <a href='https://example.com' target='_blank' rel='noreferrer'>
          <img
            src={iconAsset}
            alt='example asset'
            style={{ width: 64, height: 64 }}
          />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div>
        <button
          onClick={(): void => {
            setCount((count) => count + 1);
          }}
        >
          count is {count}
        </button>
      </div>
      <div>{JSON.stringify(context.globals.config)}</div>
      <div>Is Loading: {isLoadingExample.toString()}</div>
      <div>Example: {example ?? '<undefined>'}</div>
    </>
  );
}
