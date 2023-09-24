import React from 'react';
import { Link } from 'react-router-dom';
import { AnotherScreenContent } from '../components/AnotherScreenContent';

export function AnotherScreen(): React.ReactElement {
  return (
    <div>
      <div>
        <Link to='/'>Home Screen</Link>
      </div>
      <br />
      <AnotherScreenContent text='Another Screen' />
    </div>
  );
}
