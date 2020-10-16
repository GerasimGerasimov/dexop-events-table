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

}

export default class Search extends Component<ISearchProps, ISearchState> {

  constructor (props: ISearchProps) {
    super(props);
  }

  render(){
    return (
      <div className='search block grid-container'>
        <h1 className='search Header'>Search</h1>
        <label className='search LabelFrom' htmlFor="fromDate">from:</label>
        <input className='search InputFrom' id='fromDate' type="datetime-local"/>
        <label className='search LabelTo' htmlFor="toDate">to:</label>
        <input className='search InputTo' id='toDate' type="datetime-local"/>
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