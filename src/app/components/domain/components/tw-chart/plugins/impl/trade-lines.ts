import {
  ISeriesPrimitive,
  ISeriesPrimitivePaneRenderer,
  ISeriesPrimitivePaneView,
  Range,
  SeriesAttachedParameter,
  SeriesPrimitivePaneViewZOrder,
} from 'lightweight-charts';
import {
  BitmapCoordinatesRenderingScope,
  CanvasRenderingTarget2D,
} from 'fancy-canvas';
import {
  ChartHorizontalScaleItem,
  ChartPrimitiveContext,
  ChartSeriesType,
} from '../types';
import {
  createChartPrimitiveContext,
  getVisibleBarIndexRange,
} from '../shared';
import { ChartBars } from '../../types';

export interface TradeLinesOptions {
  readonly color: string;
}

export type TradeLineType = 'solid' | 'dashed';

export interface TradeLine {
  readonly startIndex: number;
  readonly endIndex: number;
  readonly price: number;
  readonly type: TradeLineType;
}

export function createSeriesPrimitiveTradeLines(
  options: TradeLinesOptions,
): ISeriesPrimitive<ChartHorizontalScaleItem> {
  const [primitiveContextInitalize, primitiveContextDestroy, primitiveContext] =
    createChartPrimitiveContext();

  const _paneView: ISeriesPrimitivePaneView = createPrimitivePaneViewTradeLines(
    primitiveContext,
    options,
  );
  const _paneViews: readonly ISeriesPrimitivePaneView[] = [_paneView];

  return {
    paneViews: (): readonly ISeriesPrimitivePaneView[] => {
      return _paneViews;
    },
    attached: (
      p: SeriesAttachedParameter<ChartHorizontalScaleItem, ChartSeriesType>,
    ): void => {
      const { chart, series } = p;
      primitiveContextInitalize(chart, series);
    },
    detached: (): void => {
      primitiveContextDestroy();
    },
  };
}

function createPrimitivePaneViewTradeLines(
  primitiveContext: ChartPrimitiveContext,
  options: TradeLinesOptions,
): ISeriesPrimitivePaneView {
  const _renderer: ISeriesPrimitivePaneRenderer =
    createPrimitivePaneRendererTradeLines(primitiveContext, options);

  return {
    renderer: (): ISeriesPrimitivePaneRenderer => {
      return _renderer;
    },
    zOrder: (): SeriesPrimitivePaneViewZOrder => {
      return 'top';
    },
  };
}

function createPrimitivePaneRendererTradeLines(
  primitiveContext: ChartPrimitiveContext,
  options: TradeLinesOptions,
): ISeriesPrimitivePaneRenderer {
  return {
    draw: (target: CanvasRenderingTarget2D): void => {
      const tradeLines: readonly TradeLine[] = [
        {
          startIndex: 5,
          endIndex: 15,
          price: 34_280,
          type: 'solid',
        },
        {
          startIndex: 5,
          endIndex: 15,
          price: 34_300,
          type: 'dashed',
        },
      ];

      const range = getVisibleBarIndexRange(primitiveContext.timeScale());
      if (!range) {
        return;
      }

      const data = primitiveContext.series().data() as ChartBars;

      target.useBitmapCoordinateSpace((scope): void => {
        drawTradeLines(
          scope,
          primitiveContext,
          options,
          data,
          range,
          tradeLines,
        );
      });
    },
  };
}

function drawTradeLines(
  scope: BitmapCoordinatesRenderingScope,
  primitiveContext: ChartPrimitiveContext,
  options: TradeLinesOptions,
  data: ChartBars,
  visibleRange: Range<number>,
  tradeLines: readonly TradeLine[],
): void {
  const {
    context: ctx,
    bitmapSize,
    horizontalPixelRatio,
    verticalPixelRatio,
  } = scope;
  const { width: bitmapWidth, height: bitmapHeight } = bitmapSize;
  const { color } = options;

  const { from: visibleFrom, to: visibleTo } = visibleRange;

  const timeScale = primitiveContext.timeScale();
  const series = primitiveContext.series();

  const solidLinePattern = SOLID_LINE_PATTERN.map(
    (v) => v * verticalPixelRatio,
  );
  const dashedLinePattern = DASHED_LINE_PATTERN.map(
    (v) => v * verticalPixelRatio,
  );

  // ctx.save();
  for (const tradeLine of tradeLines) {
    const { startIndex, endIndex, price, type } = tradeLine;

    if (endIndex < visibleFrom || startIndex > visibleTo) {
      continue;
    }

    const finalStartIndex = Math.max(startIndex, visibleFrom - 1, 0);
    const finalEndIndex = Math.min(endIndex, visibleTo + 1, data.length - 1);

    const linePattern = type === 'solid' ? solidLinePattern : dashedLinePattern;

    const px1 = timeScale.timeToCoordinate(data[finalStartIndex].time);
    const px2 = timeScale.timeToCoordinate(data[finalEndIndex].time);
    const py = series.priceToCoordinate(price);

    if (px1 === null || px2 === null || py === null) {
      continue;
    }

    const x1Scaled = px1 * horizontalPixelRatio;
    const x2Scaled = px2 * horizontalPixelRatio;
    const yPosition = positionsLine(py, verticalPixelRatio, LINE_WIDTH);

    if (yPosition.position < 0 || yPosition.position > bitmapHeight) {
      continue;
    }

    const x1 = Math.max(0, Math.round(x1Scaled));
    const x2 = Math.min(bitmapWidth, Math.round(x2Scaled));
    const yCenter = yPosition.position + yPosition.length / 2;

    ctx.setLineDash(linePattern);
    ctx.strokeStyle = color;
    ctx.lineWidth = yPosition.length;
    ctx.beginPath();
    ctx.moveTo(x1, yCenter);
    ctx.lineTo(x2, yCenter);
    ctx.stroke();
  }
  // ctx.restore();
}

const LINE_WIDTH = 1;

const SOLID_LINE_PATTERN: readonly number[] = [];
const DASHED_LINE_PATTERN: readonly number[] = [4, 2];


// the rest of the code is taken from:
//   lightweight-charts\plugin-examples\src\helpers\dimensions\positions.ts
// I do not fully understand it, but it seems to work
interface BitmapPositionLength {
  /** coordinate for use with a bitmap rendering scope */
  readonly position: number;
  /** length for use with a bitmap rendering scope */
  readonly length: number;
}

function positionsLine(
  positionMedia: number,
  pixelRatio: number,
  desiredWidthMedia: number,
): BitmapPositionLength {
  const scaledPosition = Math.round(pixelRatio * positionMedia);
  const lineBitmapWidth = Math.round(desiredWidthMedia * pixelRatio);
  const offset = centreOffset(lineBitmapWidth);
  const position = scaledPosition - offset;
  return { position, length: lineBitmapWidth };
}

function centreOffset(lineBitmapWidth: number): number {
  return Math.floor(lineBitmapWidth * 0.5);
}
