import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createChart } from 'lightweight-charts';
import { TickerDataRow } from '../../../types';
import { CrosshairMoveFn, TwChartSettings, TwInitInput } from './types';
import {
  DEFAULT_TW_CHART_SETTINGS,
  destroyChart,
  getTwInitInput,
  initChart,
} from './util';
import { TwOhlcLabel } from './components/TwOhlcLabel';
import { TwChartToolbar } from './components/TwChartToolbar';

export interface TwChartProps {
  readonly precision: number;
  readonly data: readonly TickerDataRow[];
}

export function TwChart({ precision, data }: TwChartProps): React.ReactElement {
  const continerRef = useRef<HTMLDivElement>(null);

  const [settings, setSettings] = useState<TwChartSettings>(
    DEFAULT_TW_CHART_SETTINGS,
  );

  const [currCrosshairItem, setCurrCrosshairItem] = useState<
    TickerDataRow | undefined
  >(undefined);

  const handleCrosshairMove = useCallback<CrosshairMoveFn>(
    (param) => {
      setCurrCrosshairItem(param);
    },
    [setCurrCrosshairItem],
  );

  const input = useMemo<TwInitInput>(
    () => getTwInitInput(precision, data, handleCrosshairMove),
    [precision, data, handleCrosshairMove],
  );

  useEffect(() => {
    const chart = continerRef.current
      ? createChart(continerRef.current)
      : undefined;
    initChart(chart, input);

    return () => {
      destroyChart(chart);
    };
  }, [input]);

  return (
    <div className='h-full flex flex-col'>
      <TwChartToolbar settings={settings} onSettingsChange={setSettings} />
      <div className='h-full overflow-hidden relative'>
        <div>{getOhlcLabelElement(currCrosshairItem, precision)}</div>
        <div ref={continerRef} className='h-full' />
      </div>
    </div>
  );
}

function getOhlcLabelElement(
  currCrosshairItem: TickerDataRow | undefined,
  precision: number,
): React.ReactElement | undefined {
  if (!currCrosshairItem) {
    return undefined;
  }

  const { open, high, low, close } = currCrosshairItem;

  return (
    <div className='absolute top-1 left-1 z-10'>
      <TwOhlcLabel o={open} h={high} l={low} c={close} precision={precision} />
    </div>
  );
}
