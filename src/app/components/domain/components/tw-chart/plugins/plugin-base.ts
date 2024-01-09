import {
  DataChangedScope,
  IChartApi,
  ISeriesApi,
  ISeriesPrimitive,
  SeriesAttachedParameter,
  SeriesOptionsMap,
  Time,
} from 'lightweight-charts';
import { ensureDefined } from './helpers';

export abstract class PluginBase implements ISeriesPrimitive<Time> {

  protected __name: string = 'PluginBase';

  private _chart: IChartApi | undefined = undefined;
  private _series: ISeriesApi<keyof SeriesOptionsMap> | undefined = undefined;

  protected abstract dataUpdated(scope: DataChangedScope): void;
  protected requestUpdate(): void {
    if (this._requestUpdate) {
      this._requestUpdate();
    }
  }
  private _requestUpdate?: () => void;

  public attached({
    chart,
    series,
    requestUpdate,
  }: SeriesAttachedParameter<Time>): void {
    this._chart = chart;
    this._series = series;
    this._series.subscribeDataChanged((scope) => this._fireDataUpdated(scope));
    this._requestUpdate = requestUpdate;
    this.requestUpdate();
  }

  public detached(): void {
    this._chart = undefined;
    this._series = undefined;
    this._requestUpdate = undefined;
  }

  public get chart(): IChartApi {
    return ensureDefined(this._chart);
  }

  public get series(): ISeriesApi<keyof SeriesOptionsMap> {
    return ensureDefined(this._series);
  }

  private _fireDataUpdated(scope: DataChangedScope): void {
    this.dataUpdated(scope);
  }
}
