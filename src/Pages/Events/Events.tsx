import React, { Component } from "react";
import EventsTable from "../../components/table/EventsTable";
import { IEventQueryDirection, ISortDirection, IEventsQuery, IEventsRespond, IEventSortMode, ISortMode } from "../../server/ieventsdata";
import { EventsModel } from "../../server/server";
import Paginator from "./components/paginator/paginator";
import './Events.css'

interface IEventsProps{
}

interface IEventsState{
  query: IEventsQuery;
  respond: IEventsRespond;
}

const TenItemsOnPage: number = 10;

export default class Events extends Component <IEventsProps,IEventsState> {

  constructor(props: IEventsProps){
    super(props)
    this.state = {
      query: {
        FromIndex:0,
        QueriedQuantity: 10,
        SortMode: {
          DateTimeSortDirection: ISortDirection.Up,
          EventsSortMode:  IEventSortMode.All
        }
      },
      respond: {
        ClientID: '',
        DateTime: '',
        TotalItemsQuantity: 0,
        ItemsBefore: 0,
        ItemsAfter: 0,
        ItemsInRespond: 0,
        Items: []
      }
    }
  }

  private getNextIndex(direction: IEventQueryDirection): number {
    let nextIndex: number = this.state.query.FromIndex;
    switch (direction) {
      case IEventQueryDirection.Next:
        nextIndex  += this.state.query.QueriedQuantity;//ItemsOnPage;
        const max: number = (this.state.respond.TotalItemsQuantity === 0)
                            ? 0
                            : this.state.respond.TotalItemsQuantity - 1;
        nextIndex = (nextIndex > max)? max : nextIndex;
        break;
      case IEventQueryDirection.Prev:
        nextIndex  -= this.state.query.QueriedQuantity;//ItemsOnPage;
        nextIndex = (nextIndex < 0)? 0 : nextIndex;
        break;
    }
    return nextIndex;
  }

  private isNextPossible(direction: IEventQueryDirection): boolean {
    return !((direction === IEventQueryDirection.Next)
           && (this.state.respond.ItemsAfter === 0))
  }

  private readPortionOfItems(direction: IEventQueryDirection) {
    this.setState((state)=>({
      query:{
        ...state.query,
        FromIndex: this.getNextIndex(direction)
      }
    }), ()=>this.getData())
  }
  
  private getPortionOfItems(direction: IEventQueryDirection) {
    if (this.isNextPossible(direction)) {
      this.readPortionOfItems(direction)
    }
  }

  componentDidMount(){
    this.getData()
  }

  getData(){
    const respond:IEventsRespond = EventsModel.getItems(this.state.query);
    this.setState({respond})
  }

  private setNumberOfItemsOnPage(QueriedQuantity: number){
    this.setState((state)=>({
      query:{
        ...state.query,
        QueriedQuantity
      }
    }), ()=>this.getData())
  }

  private tougleSortDirection(direction: ISortDirection): ISortDirection {
    return  (direction === ISortDirection.Up)
            ? ISortDirection.Down
            : ISortDirection.Up
  }

  private tougleEventsSortDirection(mode: IEventSortMode): IEventSortMode {
    return mode;
  }

  private isSortModeDateTimeAndTougle(SortMode: ISortMode): IEventsQuery | undefined{
    if (SortMode === ISortMode.datetime) {
      const query = {... this.state.query}
      const { DateTimeSortDirection }  =  { ...query.SortMode};
      query.SortMode.DateTimeSortDirection = this.tougleSortDirection(DateTimeSortDirection);
      return query;
    }
    return undefined;
  }

  private isSortModeDateEvensAndTougle(SortMode: ISortMode): IEventsQuery | undefined{
    if (SortMode === ISortMode.events) {
      const query = {... this.state.query}
      const { EventsSortMode }  =  { ...query.SortMode};
      query.SortMode.EventsSortMode = this.tougleEventsSortDirection(EventsSortMode);
      return query;
    }
    return undefined;
  }

  private changeSortMode(SortMode: ISortMode): void {
    const query: IEventsQuery | undefined = 
      this.isSortModeDateTimeAndTougle(SortMode) ||
      this.isSortModeDateEvensAndTougle(SortMode)
    if (query !== undefined) {
      this.setState({query})
    }
  }

  render() {
    return (
      <div className='flex-column'>
        <div>
          <button>Search</button>
          <input type="datetime-local"/>
        </div>
        <div className='flex-all-client b1pxdgr'>
          <EventsTable
            items = {this.state.respond.Items}
            dateSortDirection = {this.state.query.SortMode?.DateTimeSortDirection}
            eventsSortMode = {this.state.query.SortMode?.EventsSortMode}
            changeSortModeHandler = {this.changeSortMode.bind(this)}
          />
        </div>
          <Paginator
            ItemsAfter = {this.state.respond.ItemsAfter}
            ItemsBefore = {this.state.respond.ItemsBefore}
            ItemsPortion = {TenItemsOnPage}
            QueriedQuantity = {this.state.query.QueriedQuantity}
            nextItemsHandler = {this.getPortionOfItems.bind(this)}
            setNumberOfItemsOnPageHandler = {this.setNumberOfItemsOnPage.bind(this)}
          />
      </div>
    );
  }
}