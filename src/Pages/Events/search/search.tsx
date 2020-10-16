import React, { Component } from "react"

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
      <div>
        <h1>Search</h1>
        <button
          className="btn btn-primary btn-xs"
          onClick={()=>this.props.onExitHandler(undefined)}
        >Close</button>
      </div>
    )
  }  
}