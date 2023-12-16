import React, { useMemo } from 'react';
import {
  TYPES_OF_TICKER_DATA_RESOLUTION,
  TickerDataResolution,
} from '@gmjs/gm-trading-shared';
import { TickerFilterData } from '../../../app/types';
import { SelectInput, SelectInputOption } from '../shared/inputs/SelectInput';
import { TextInput } from '../shared/inputs/TextInput';

export interface TickerDataFilterProps {
  readonly tickerNames: readonly string[];
  readonly data: TickerFilterData;
  readonly onDataChange: (data: TickerFilterData) => void;
}

export function TickerDataFilter({
  tickerNames,
  data,
  onDataChange,
}: TickerDataFilterProps): React.ReactElement {
  const { name, resolution, date } = data;

  const tickerNameOptions: readonly SelectInputOption[] = useMemo(
    () =>
      tickerNames.map((name) => ({
        value: name,
        label: name,
      })),
    [tickerNames],
  );

  const resolutionOptions: readonly SelectInputOption<TickerDataResolution>[] =
    useMemo(
      () =>
        TYPES_OF_TICKER_DATA_RESOLUTION.map((resolution) => ({
          value: resolution,
          label: resolution,
        })),
      [],
    );

  return (
    <div className='flex flex-row gap-2'>
      <SelectInput
        placeholder='Name'
        options={tickerNameOptions}
        value={name}
        onValueChange={(value: string): void => {
          onDataChange({
            ...data,
            name: value,
          });
        }}
      />
      <SelectInput<TickerDataResolution>
        placeholder='Resolution'
        options={resolutionOptions}
        value={resolution}
        onValueChange={(value: TickerDataResolution | ''): void => {
          onDataChange({
            ...data,
            resolution: value,
          });
        }}
      />
      <TextInput
        placeholder='Date'
        value={date}
        onValueChange={(value: string): void => {
          onDataChange({
            ...data,
            date: value,
          });
        }}
      />
    </div>
  );
}
