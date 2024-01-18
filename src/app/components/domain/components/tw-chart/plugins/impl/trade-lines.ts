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
import { applyFn } from '@gmjs/apply-function';
import { map, toMap } from '@gmjs/value-transformers';
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
import { TradeLine, TradeLineRepresentation } from '../../../../types';
import { mapGetOrThrow } from '@gmjs/data-container-util';
import { ensureNever } from '@gmjs/assert';

export interface TradeLinesOptions {}

export interface SeriesPrimitiveTradeLine
  extends ISeriesPrimitive<ChartHorizontalScaleItem> {
  readonly setTradeLines: (tradeLines: readonly TradeLine[]) => void;
}

export function createSeriesPrimitiveTradeLines(
  options: TradeLinesOptions,
): SeriesPrimitiveTradeLine {
  const [primitiveContextInitalize, primitiveContextDestroy, primitiveContext] =
    createChartPrimitiveContext();

  const _paneView: SeriesPrimitivePaneViewTradeLines =
    createPrimitivePaneViewTradeLines(primitiveContext, options);
  const _paneViews: readonly ISeriesPrimitivePaneView[] = [_paneView];

  return {
    paneViews: (): readonly ISeriesPrimitivePaneView[] => {
      return _paneViews;
    },
    attached: (
      p: SeriesAttachedParameter<ChartHorizontalScaleItem, ChartSeriesType>,
    ): void => {
      const { chart, series, requestUpdate } = p;
      primitiveContextInitalize(chart, series, requestUpdate);
    },
    detached: (): void => {
      primitiveContextDestroy();
    },
    setTradeLines: (tradeLines: readonly TradeLine[]): void => {
      _paneView.setTradeLines(tradeLines);
      primitiveContext.requestUpdate();
    },
  };
}

interface SeriesPrimitivePaneViewTradeLines extends ISeriesPrimitivePaneView {
  readonly setTradeLines: (tradeLines: readonly TradeLine[]) => void;
}

function createPrimitivePaneViewTradeLines(
  primitiveContext: ChartPrimitiveContext,
  options: TradeLinesOptions,
): SeriesPrimitivePaneViewTradeLines {
  const _renderer: SeriesPrimitivePaneRendererTradeLines =
    createPrimitivePaneRendererTradeLines(primitiveContext, options);

  return {
    renderer: (): ISeriesPrimitivePaneRenderer => {
      return _renderer;
    },
    zOrder: (): SeriesPrimitivePaneViewZOrder => {
      return 'top';
    },
    setTradeLines: (tradeLines: readonly TradeLine[]): void => {
      _renderer.setTradeLines(tradeLines);
    },
  };
}

interface SeriesPrimitivePaneRendererTradeLines
  extends ISeriesPrimitivePaneRenderer {
  readonly setTradeLines: (tradeLines: readonly TradeLine[]) => void;
}

function createPrimitivePaneRendererTradeLines(
  primitiveContext: ChartPrimitiveContext,
  options: TradeLinesOptions,
): SeriesPrimitivePaneRendererTradeLines {
  let _tradeLines: readonly TradeLine[] = [];

  return {
    draw: (target: CanvasRenderingTarget2D): void => {
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
          _tradeLines,
        );
      });
    },
    setTradeLines: (tradeLines: readonly TradeLine[]): void => {
      _tradeLines = tradeLines;
    },
  };
}

function drawTradeLines(
  scope: BitmapCoordinatesRenderingScope,
  primitiveContext: ChartPrimitiveContext,
  _options: TradeLinesOptions,
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

  const { from: visibleFrom, to: visibleTo } = visibleRange;

  const timeScale = primitiveContext.timeScale();
  const series = primitiveContext.series();

  const patternMap = createPatternMap(horizontalPixelRatio);

  const lineEndRadiuxX = LINE_END_RADIUS * horizontalPixelRatio;
  const lineEndRadiuxY = LINE_END_RADIUS * verticalPixelRatio;

  // ctx.save();
  for (const tradeLine of tradeLines) {
    const { startIndex, endIndex, price, source, offset } = tradeLine;

    if (endIndex < visibleFrom || startIndex > visibleTo) {
      continue;
    }

    const finalStartIndex = Math.max(startIndex, visibleFrom - 1, 0);
    const finalEndIndex = Math.min(endIndex, visibleTo + 1, data.length - 1);

    const px1 = timeScale.timeToCoordinate(data[finalStartIndex].time);
    const px2 =
      source === 'proposed-order'
        ? px1 === null
          ? null // eslint-disable-line unicorn/no-null
          : px1 + PROPOSED_ORDER_LINE_LENGHT * horizontalPixelRatio
        : timeScale.timeToCoordinate(data[finalEndIndex].time);
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

    const linePattern = getPattern(patternMap, tradeLine);
    const color = getColor(tradeLine);

    const x1Uncropped = Math.round(x1Scaled);
    const x2Uncropped = Math.round(x2Scaled);

    const x1 = Math.max(0, x1Uncropped);
    const x2 = Math.min(bitmapWidth, x2Uncropped);
    const yCenter = yPosition.position + yPosition.length / 2;

    ctx.setLineDash(linePattern);
    ctx.strokeStyle = color;
    ctx.lineWidth = yPosition.length;
    ctx.beginPath();
    ctx.moveTo(x1, yCenter);
    ctx.lineTo(x2, yCenter);
    ctx.stroke();

    if (
      offset === 'execution' &&
      (x1Uncropped >= 0 || x2Uncropped <= bitmapWidth)
    ) {
      ctx.setLineDash(SOLID_PATTERN);
      ctx.fillStyle = color;
      if (x1Uncropped >= 0) {
        ctx.beginPath();
        ctx.ellipse(
          x1,
          yCenter,
          lineEndRadiuxX,
          lineEndRadiuxY,
          0,
          0,
          2 * Math.PI,
        );
        ctx.fill();
      }

      if (x2Uncropped <= bitmapWidth) {
        ctx.beginPath();
        ctx.ellipse(
          x2,
          yCenter,
          lineEndRadiuxX,
          lineEndRadiuxY,
          0,
          0,
          2 * Math.PI,
        );
        ctx.fill();
      }
    }
  }
  // ctx.restore();
}

const LINE_WIDTH = 2;
const LINE_END_RADIUS = 2;

const PROPOSED_ORDER_LINE_LENGHT = 50;

function getColor(tradeLine: TradeLine): string {
  const { source, direction } = tradeLine;

  switch (source) {
    case 'proposed-order': {
      return direction === 'buy'
        ? `rgba(0, 0, 255, 1)`
        : `rgba(80, 16, 120, 1)`;
    }
    case 'order': {
      return direction === 'buy'
        ? `rgba(127, 127, 0, 1)`
        : `rgba(127, 0, 127, 1)`;
    }
    case 'trade': {
      return direction === 'buy'
        ? `rgba(32, 178, 170, 1)`
        : `rgba(220, 20, 60, 1)`;
    }
    default: {
      return ensureNever(source);
    }
  }
}

const SOLID_PATTERN = [] as const;

type TradeLineDashPattern = TradeLineRepresentation | 'mid';

function getPattern(
  patternMap: ReadonlyMap<TradeLineDashPattern, readonly number[]>,
  tradeLine: TradeLine,
): readonly number[] {
  const { representation, offset } = tradeLine;

  if (offset === 'mid') {
    return mapGetOrThrow(patternMap, 'mid');
  }

  return mapGetOrThrow(patternMap, representation);
}

const RAW_PATTERN_MAP: ReadonlyMap<TradeLineDashPattern, readonly number[]> =
  new Map<TradeLineDashPattern, readonly number[]>([
    ['price', [0, 0]],
    ['stop-loss', [2, 2]],
    ['limit', [6, 2]],
    ['mid', [2, 6]],
  ]);

function createPatternMap(
  pixelRatio: number,
): ReadonlyMap<TradeLineDashPattern, readonly number[]> {
  return applyFn(
    RAW_PATTERN_MAP,
    map(([k, pat]) => [k, pat.map((v) => v * pixelRatio)] as const),
    toMap(),
  );
}

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
