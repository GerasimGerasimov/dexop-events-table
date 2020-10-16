import React, { Component } from "react"
import './search.css'

export interface ISearchQuery {
  dateFrom: number;
  dateTo: number;
  event: number;
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
  //datetime-local
  private refFromDate = React.createRef<HTMLInputElement>();
  private refToDate   = React.createRef<HTMLInputElement>();

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

  private getQuery(): ISearchQuery | undefined {
    return undefined;
  }

  private chahgeDateTime(e: any) {
    if (!e.target['validity'].valid) return;
    const dt:string= e.target['value'] + ':00Z';
    console.log(dt)
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
          onChange={(e)=>this.chahgeDateTime(e)}
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
          <select id="events-select">
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
          onClick={()=>this.props.onExitHandler(this.getQuery())}
        >Search</button>
        <button
          className="btn btn-secondary btn-xs search Cancel"
          onClick={()=>this.props.onExitHandler(undefined)}
        >Cancel</button>
      </div>
    )
  }  
}