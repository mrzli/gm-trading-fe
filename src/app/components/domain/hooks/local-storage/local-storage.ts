import { StorageWrapper } from '@gmjs/browser-storage';
import { LocalStorageKeys } from '../../../../../app-setup/dependencies';
import { useAppContext } from '../../../../util';
import {
  UseStorageValueAccessorResult,
  useLocalStorageAccessor,
} from './local-storage-accessor';
import { TradingInputs } from '../../components/trade/types';
import { TradingUiState } from '../../types';

export function useLocalStorage(): StorageWrapper<LocalStorageKeys> {
  const context = useAppContext();
  return context.dependencies.localStorage;
}

export function useLocalStorageTradingInputsAccessor(): UseStorageValueAccessorResult<TradingInputs> {
  return useLocalStorageAccessor('trading-inputs');
}

export function useLocalStorageTradingUiStateAccessor(): UseStorageValueAccessorResult<TradingUiState> {
  return useLocalStorageAccessor('trading-ui-state');
}
