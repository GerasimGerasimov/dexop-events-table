import React, { Component, RefObject } from "react"
import './search.css'

export interface ISearchQuery {
  dateFrom?: number;
  dateTo?: number;
  event?: string;
}

export interface ISearchFormCloseHandler {
  (result: ISearchQuery | undefined): any;
}

export interface ISearchProps {
  onExitHandler:ISearchFormCloseHandler;
}

export interface ISearchState {
 useDataRangeInSearch: boolean;
 useEventTypeInSearch: boolean;
}

export default class Search extends Component<ISearchProps, ISearchState> {

  private refFromDate = React.createRef<HTMLInputElement>();
  private refToDate   = React.createRef<HTMLInputElement>();
  private refEvent    = React.createRef<HTMLSelectElement>();

  constructor (props: ISearchProps) {
    super(props);
    this.state={
      useDataRangeInSearch: true,
      useEventTypeInSearch: true
    }
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

  private validateSelectedEvent(event: string | undefined): string | undefined {
    return (['All', 'Alarm', 'Warning', 'Info'].includes(event || ''))
           ? event
           : undefined
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

  private getQuery(): ISearchQuery | undefined {
    const dateFrom: number | undefined = this.validateDateTime(this.refFromDate.current?.value);
    const dateTo  : number | undefined = this.validateDateTime(this.refToDate.current?.value);
    const event   : string | undefined = this.validateSelectedEvent(this.refEvent.current?.value);
    const useDate: boolean = this.state.useDataRangeInSearch;
    const useEvent: boolean = this.state.useEventTypeInSearch;
    if (this.setFocusOfNotValidElement(useDate, dateFrom, this.refFromDate)) { return undefined };
    if (this.setFocusOfNotValidElement(useDate, dateTo  , this.refToDate  )) { return undefined };
    if (this.setFocusOfNotValidElement(useEvent, event  , this.refEvent   )) { return undefined };
    const res: ISearchQuery = {}
    this.fillIfUsed(res, useDate,  'dateFrom', dateFrom);
    this.fillIfUsed(res, useDate,  'dateTo'  , dateTo);
    this.fillIfUsed(res, useEvent, 'event'   , event);
    return res;
  }

  private exitHandler() {
    const query: ISearchQuery | undefined = this.getQuery();
    if (query !== undefined) {
      this.props.onExitHandler(query);
    }
  }

  render(){
    return (
      <div className='search block grid-container'>
        <h3 className='search Header'>Search</h3>
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
            <option value="">--Please choose an Event--</option>
            <option value="All">All</option>
            <option value="Alarm">Alarms</option>
            <option value="Warning">Warnings</option>
            <option value="Info">Info</option>
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