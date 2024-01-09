import { CanvasRenderingTarget2D } from 'fancy-canvas';
import {
  Coordinate,
  DataChangedScope,
  ISeriesPrimitivePaneRenderer,
  ISeriesPrimitivePaneView,
  SeriesAttachedParameter,
  SeriesDataItemTypeMap,
  SeriesPrimitivePaneViewZOrder,
  SeriesType,
  Time,
} from 'lightweight-charts';
import { PluginBase } from '../plugin-base';

interface SessionHighlightingRendererData {
  readonly x: Coordinate | number;
  readonly color: string;
}

class SessionHighlightingPaneRenderer implements ISeriesPrimitivePaneRenderer {
  private _viewData: SessionHighlightingViewData;

  public constructor(data: SessionHighlightingViewData) {
    this._viewData = data;
  }

  public draw(target: CanvasRenderingTarget2D): void {
    const points: SessionHighlightingRendererData[] = this._viewData.data;
    target.useBitmapCoordinateSpace((scope) => {
      const ctx = scope.context;
      const yTop = 0;
      const height = scope.bitmapSize.height;
      const halfWidth =
        (scope.horizontalPixelRatio * this._viewData.barWidth) / 2;
      const cutOff = -1 * (halfWidth + 1);
      const maxX = scope.bitmapSize.width;
      for (const point of points) {
        const xScaled = point.x * scope.horizontalPixelRatio;
        if (xScaled < cutOff) continue;
        ctx.fillStyle = point.color || 'rgba(0, 0, 0, 0)';
        const x1 = Math.max(0, Math.round(xScaled - halfWidth));
        const x2 = Math.min(maxX, Math.round(xScaled + halfWidth));
        ctx.fillRect(x1, yTop, x2 - x1, height);
      }
    });
  }
}

interface SessionHighlightingViewData {
  data: SessionHighlightingRendererData[];
  options: Required<SessionHighlightingOptions>;
  barWidth: number;
}

class SessionHighlightingPaneView implements ISeriesPrimitivePaneView {
  private _source: SessionHighlighting;
  private _data: SessionHighlightingViewData;

  public constructor(source: SessionHighlighting) {
    this._source = source;
    this._data = {
      data: [],
      barWidth: 6,
      options: this._source.options,
    };
  }

  public update(): void {
    const timeScale = this._source.chart.timeScale();
    this._data.data = this._source.backgroundColors.map((d) => {
      return {
        x: timeScale.timeToCoordinate(d.time) ?? -100,
        color: d.color,
      };
    });
    this._data.barWidth =
      this._data.data.length > 1
        ? this._data.data[1].x - this._data.data[0].x
        : 6;
  }

  public renderer(): SessionHighlightingPaneRenderer {
    return new SessionHighlightingPaneRenderer(this._data);
  }

  public zOrder(): SeriesPrimitivePaneViewZOrder {
    return 'bottom';
  }
}

export interface SessionHighlightingOptions {}

const defaults: Required<SessionHighlightingOptions> = {};

interface BackgroundData {
  readonly time: Time;
  readonly color: string;
}

export type SessionHighlighter = (date: Time) => string;

export class SessionHighlighting extends PluginBase {
  private _paneViews: SessionHighlightingPaneView[];
  private _seriesData: SeriesDataItemTypeMap[SeriesType][] = [];
  private _backgroundColors: BackgroundData[] = [];
  private _options: Required<SessionHighlightingOptions>;
  private _highlighter: SessionHighlighter;

  public constructor(
    highlighter: SessionHighlighter,
    options: SessionHighlightingOptions = {},
  ) {
    super();
    this._highlighter = highlighter;
    this._options = { ...defaults, ...options };
    this._paneViews = [new SessionHighlightingPaneView(this)];
  }

  public updateAllViews(): void {
    for (const pw of this._paneViews) {
      pw.update();
    }
  }

  public paneViews(): SessionHighlightingPaneView[] {
    return this._paneViews;
  }

  public override attached(p: SeriesAttachedParameter<Time>): void {
    super.attached(p);
    this.dataUpdated('full');
  }

  public override dataUpdated(_scope: DataChangedScope): void {
    // plugin base has fired a data changed event
    // TODO: only update the last value if the scope is 'update'
    this._backgroundColors = this.series.data().map((dataPoint) => {
      return {
        time: dataPoint.time,
        color: this._highlighter(dataPoint.time),
      };
    });
    this.requestUpdate();
  }

  public get backgroundColors(): BackgroundData[] {
    return this._backgroundColors;
  }

  public get options(): Required<SessionHighlightingOptions> {
    return this._options;
  }
}
