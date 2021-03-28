import React, { Component} from "react"
import { getLocalDateFormValue} from "../../helpers/timeutils";
import { getKeyOfEnumByValue } from "../../helpers/utils";
import { IEventSortMode, ISearchRangeQuery } from "../../../server/ieventsdata";
import './FilterSettings.css'

export interface IFilterSettingsCloseHandler {
  (result: ISearchRangeQuery | undefined): any;
}

export interface IFilterSettingsProps {
  onExitHandler:IFilterSettingsCloseHandler;
  Range: ISearchRangeQuery;
}

export interface IFilterSettingsState {
 useDataRangeInSearch: boolean;
 useEventTypeInSearch: boolean;
}

export default class FilterSettings extends Component<IFilterSettingsProps, IFilterSettingsState> {

  private refFromDate = React.createRef<HTMLInputElement>();
  private refToDate   = React.createRef<HTMLInputElement>();
  private refEvent    = React.createRef<HTMLSelectElement>();

  constructor (props: IFilterSettingsProps) {
    super(props);
    this.state={
      useDataRangeInSearch: true,
      useEventTypeInSearch: true
    }
  }
 
  componentDidMount(){
    this.refFromDate.current!.value = getLocalDateFormValue(this.props.Range.dateFrom);
    this.refToDate.current!.value   = getLocalDateFormValue(this.props.Range.dateTo);
    let value: IEventSortMode = this.props.Range.event || IEventSortMode.All;
    let key = getKeyOfEnumByValue( IEventSortMode, value, 'All');
    this.refEvent.current!.value = key
  }

  private changeUseDateInSearch() {
    const checkerTougle: boolean = !this.state.useDataRangeInSearch;
    this.setState({useDataRangeInSearch:checkerTougle})
  }

  private changeUseEventTypeInSearch() {
    const checkerTougle: boolean = !this.state.useEventTypeInSearch;
    this.setState({useEventTypeInSearch:checkerTougle})
  }

  private showIfUsed(isUsed: boolean): string {
    return  (isUsed)
            ? ''
            : ' d-none'
  }

  private validateDateTime(DateTimeStr: string | undefined): number | undefined {
    const dateTimeStr: string = DateTimeStr || '';
    const ms = Date.parse(dateTimeStr);
    return  (isNaN(ms))
            ? undefined
            : ms
  }

  private validateSelectedEvent(event: string | undefined): IEventSortMode | undefined {
    return IEventSortMode[(event || 'All') as keyof typeof IEventSortMode];
  }

  private setFocusOfNotValidElement(used: boolean, value: any, element: any): boolean {
    if (!used) {return false};
    if (value === undefined) {
      element.current?.focus();
      return true
    }
    return false;
  }

  private fillIfUsed(result: any, used: boolean, name:string, value: any): void {
    if (used) {
      result[name] = value;
    }
  }

  private getQuery(): ISearchRangeQuery | undefined {
    const dateFrom: number | undefined = this.validateDateTime(this.refFromDate.current?.value);
    const dateTo  : number | undefined = this.validateDateTime(this.refToDate.current?.value);
    const event   : IEventSortMode | undefined = this.validateSelectedEvent(this.refEvent.current?.value);
    const useDate: boolean = this.state.useDataRangeInSearch;
    const useEvent: boolean = this.state.useEventTypeInSearch;
    if (this.setFocusOfNotValidElement(useDate, dateFrom, this.refFromDate)) { return undefined };
    if (this.setFocusOfNotValidElement(useDate, dateTo  , this.refToDate  )) { return undefined };
    if (this.setFocusOfNotValidElement(useEvent, event  , this.refEvent   )) { return undefined };
    const res: ISearchRangeQuery = {}
    this.fillIfUsed(res, useDate,  'dateFrom', dateFrom);
    this.fillIfUsed(res, useDate,  'dateTo'  , dateTo);
    this.fillIfUsed(res, useEvent, 'event'   , event);
    return res;
  }

  private exitHandler() {
    const query: ISearchRangeQuery | undefined = this.getQuery();
    if (query !== undefined) {
      this.props.onExitHandler(query);
    }
  }

  render(){
    return (
      <div className='search block grid-container'>
        <h3 className='search Header'>Filter Settings</h3>
        <div className='search DateConditionPicker'>
          <div className='custom-control custom-checkbox'>
            <input  type="checkbox"
                    className="custom-control-input"
                    id="useDataRangeInSearch"
                    checked={this.state.useDataRangeInSearch}
                    onChange={()=>this.changeUseDateInSearch()}/>
            <label  className="custom-control-label"
                    htmlFor="useDataRangeInSearch">
                    use DataRange In a Search
            </label>
          </div>
        </div>

        <label
          className={'search LabelFrom' + this.showIfUsed(this.state.useDataRangeInSearch)}
          htmlFor="fromDate">from:</label>
        <input
          type="datetime-local"
          ref = {this.refFromDate}
          id='fromDate'
          className={'search InputFrom' + this.showIfUsed(this.state.useDataRangeInSearch)}
          />
        <label
          className={'search LabelTo' + this.showIfUsed(this.state.useDataRangeInSearch)}
          htmlFor="toDate">to:</label>
        <input
          type="datetime-local"
          ref = {this.refToDate}
          id='toDate'
          className={'search InputTo' + this.showIfUsed(this.state.useDataRangeInSearch)}
          />

        <div className='search EventConditionPicker'>
          <div className=' custom-control custom-checkbox'>
            <input  type="checkbox"
                    className="custom-control-input"
                    id="useEventTypeInSearch"
                    checked={this.state.useEventTypeInSearch}
                    onChange={()=>this.changeUseEventTypeInSearch()}/>
            <label  className="custom-control-label"
                    htmlFor="useEventTypeInSearch">
                    use Events In a Search
            </label>
          </div>
        </div>

        <div className={'search EventPicker' + this.showIfUsed(this.state.useEventTypeInSearch)}>
          <label htmlFor="events-select">Choose an Event:</label>
          <select id="events-select" ref = {this.refEvent}>
            { Object.keys(IEventSortMode).map((value)=>
              <option key={value} value={value}>{value}</option>
            )}
          </select>
        </div>
        <button
          className={'btn btn-primary btn-xs search Search'+
                     this.showIfUsed(this.state.useDataRangeInSearch ||
                                     this.state.useEventTypeInSearch)}
          onClick={()=>this.exitHandler()}
        >Search</button>
        <button
          className="btn btn-secondary btn-xs search Cancel"
          onClick={()=>this.props.onExitHandler(undefined)}
        >Cancel</button>
      </div>
    )
  }  
}
