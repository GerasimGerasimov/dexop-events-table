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

        <label className='search LabelFrom' htmlFor="fromDate">from:</label>
        <input className='search InputFrom' id='fromDate' type="datetime-local"/>
        <label className='search LabelTo' htmlFor="toDate">to:</label>
        <input className='search InputTo' id='toDate' type="datetime-local"/>

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

        <div className='search EventPicker'>
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
          className="btn btn-primary btn-xs search Search"
          onClick={()=>this.props.onExitHandler(undefined)}
        >Search</button>
        <button
          className="btn btn-secondary btn-xs search Cancel"
          onClick={()=>this.props.onExitHandler(undefined)}
        >Cancel</button>
      </div>
    )
  }  
}