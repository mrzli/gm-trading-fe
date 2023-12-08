export const TYPES_OF_X_AXIS_LOCATIONS = ['top', 'bottom'] as const;

export type XAxisLocation = (typeof TYPES_OF_X_AXIS_LOCATIONS)[number];

export const TYPES_OF_Y_AXIS_LOCATIONS = ['left', 'right'] as const;

export type YAxisLocation = (typeof TYPES_OF_Y_AXIS_LOCATIONS)[number];

export interface AxisTickItem {
  readonly offset: number;
  readonly textLines: readonly string[];
}
