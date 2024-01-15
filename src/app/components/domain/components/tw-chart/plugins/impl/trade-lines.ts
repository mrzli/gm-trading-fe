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
import { TradeLine } from '../../../../types';

export interface TradeLinesOptions {
  readonly color: string;
}

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

  const lineEndRadiuxX = LINE_END_RADIUS * horizontalPixelRatio;
  const lineEndRadiuxY = LINE_END_RADIUS * verticalPixelRatio;

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
    if (x1Uncropped >= 0) {
      ctx.ellipse(
        x1,
        yCenter,
        lineEndRadiuxX,
        lineEndRadiuxY,
        0,
        0,
        2 * Math.PI,
      );
    }
    if (x2Uncropped <= bitmapWidth) {
      ctx.ellipse(
        x2,
        yCenter,
        lineEndRadiuxX,
        lineEndRadiuxY,
        0,
        0,
        2 * Math.PI,
      );
    }
    ctx.stroke();
  }
  // ctx.restore();
}

const LINE_WIDTH = 1;
const LINE_END_RADIUS = 2;

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
