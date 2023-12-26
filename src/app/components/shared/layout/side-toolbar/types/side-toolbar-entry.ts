import React from 'react';

export interface SideToolbarEntry<TValue extends string> {
  readonly value: TValue;
  readonly tab: React.ReactNode;
  readonly content: React.ReactNode;
}
