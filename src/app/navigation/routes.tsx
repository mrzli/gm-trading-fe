import { RouteData } from './route-data';
import { HomeScreen } from '../screens/HomeScreen';
import { AnotherScreen } from '../screens/AnotherScreen';
import { TickerDataScreen } from '../screens/TickerDataScreen';

// eslint-disable-next-line react-refresh/only-export-components
export const ROUTES: readonly RouteData[] = [
  {
    path: '/',
    element: <TickerDataScreen />,
  },
  {
    path: '/home',
    element: <HomeScreen />,
  },
  {
    path: '/another',
    element: <AnotherScreen />,
  },
  {
    path: '/ticker-data',
    element: <TickerDataScreen />,
  },
];
