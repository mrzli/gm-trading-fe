import { useContext } from 'react';
import { AppContextData, AppContext } from '../../app-setup';

export function useAppContext(): AppContextData {
  return useContext(AppContext);
}
