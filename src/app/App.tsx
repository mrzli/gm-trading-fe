import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './navigation';

export function App(): React.ReactElement {
  return (
    <div>
      <Routes>
        {ROUTES.map(({ path, element }) => (
          <Route key={path} path={path} element={element}></Route>
        ))}
        <Route path={'*'} element={<Navigate to={'/'} />} />
      </Routes>
    </div>
  );
}
