import { ChartTimeStep } from "./chart-time-step";

export type ChartNavigatePayloadType =
  | 'start'
  | 'end'
  | 'move-by'
  | 'go-to';

export interface ChartNavigatePayloadBase {
  readonly type: ChartNavigatePayloadType;
}

export interface ChartNavigatePayloadStart extends ChartNavigatePayloadBase {
  readonly type: 'start';
}

export interface ChartNavigatePayloadEnd extends ChartNavigatePayloadBase {
  readonly type: 'end';
}

export interface ChartNavigatePayloadMoveBy extends ChartNavigatePayloadBase {
  readonly type: 'move-by';
  readonly timeStep: ChartTimeStep;
}

export interface ChartNavigatePayloadGoTo extends ChartNavigatePayloadBase {
  readonly type: 'go-to';
  readonly time: number;
}

export type ChartNavigatePayloadAny =
  | ChartNavigatePayloadStart
  | ChartNavigatePayloadEnd
  | ChartNavigatePayloadMoveBy
  | ChartNavigatePayloadGoTo;
