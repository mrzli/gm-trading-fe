import React from 'react';

export interface TabLayoutEntry<TValue extends string> {
  readonly value: TValue;
  readonly tab: React.ReactNode;
  readonly content: React.ReactNode;
}
