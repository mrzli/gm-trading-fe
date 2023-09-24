import { RouteData } from './route-data';
import { HomeScreen } from '../screens/HomeScreen';
import { AnotherScreen } from '../screens/AnotherScreen';

// eslint-disable-next-line react-refresh/only-export-components
export const ROUTES: readonly RouteData[] = [
  {
    path: '/',
    element: <HomeScreen />,
  },
  {
    path: '/another',
    element: <AnotherScreen />,
  },
];
