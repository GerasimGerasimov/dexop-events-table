import React, { Component } from "react";
import Modal from "../../components/HOC/Modal";
import EventsTable from "../../components/table/EventsTable";
import { IEventQueryDirection, ISortDirection, IEventsQuery, IEventsRespond, IEventSortMode} from "../../server/ieventsdata";
import { EventsModel } from "../../server/server";
import Paginator from "./components/paginator/paginator";
import './Events.css'
import EventsHeaderMenu from "./menu/EventsHeaderMenu";
import Search, { ISearchQuery } from "./search/search";

interface IEventsProps{
}

interface IEventsState{
  query: IEventsQuery;
  respond: IEventsRespond;
  showModal: boolean;
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
      },
      showModal: false
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

  private tougleDateSortDirection(direction: ISortDirection): ISortDirection {
    return  (direction === ISortDirection.Up)
            ? ISortDirection.Down
            : ISortDirection.Up
  }

  private changeDateSortMode(): void {
    const query = {... this.state.query}
    const { DateTimeSortDirection }  =  { ...query.SortMode};
    query.SortMode.DateTimeSortDirection = this.tougleDateSortDirection(DateTimeSortDirection);
    if (query !== undefined) {
      this.setState({query}, ()=>this.getData())
    }
  }

  private getDateSortDirectionIcon(direction: ISortDirection | undefined):string {
    const dir: ISortDirection = direction || ISortDirection.Up;
    return  (dir === ISortDirection.Up)
            ? '▲'
            : '▼'
  }

  private tougleEventsSortMode(mode: IEventSortMode): IEventSortMode {
    if (mode === IEventSortMode.All)     { return IEventSortMode.Alarm };
    if (mode === IEventSortMode.Alarm)   { return IEventSortMode.Warning };
    if (mode === IEventSortMode.Warning) { return IEventSortMode.Info };
    if (mode === IEventSortMode.Info)    { return IEventSortMode.All };
    return IEventSortMode.All;
  }

  private changeEventsSortMode() {
    const query = {... this.state.query}
    const { EventsSortMode }  =  { ...query.SortMode};
    query.SortMode.EventsSortMode = this.tougleEventsSortMode(EventsSortMode);
    if (query !== undefined) {
      this.setState({query},(()=>{
        console.log(this.getEventSortModeIcon(query.SortMode.EventsSortMode));
        this.getData();
      }))
    }
  }

  private getEventSortModeIcon(Mode: IEventSortMode):string {
    const mode: IEventSortMode = Mode || IEventSortMode.All;
    if (mode === IEventSortMode.Alarm)   { return '⬥'};
    if (mode === IEventSortMode.Warning) { return '∎'};
    if (mode === IEventSortMode.Info)    { return '▲'};
    return '⋮' //All
  }

  private handlerToolMenu(name: string, status: boolean){
    console.log(name);
    this.setState({showModal: true})
    /*
    const handlers: {[handlerName: string]: any} = {
      'Search' : this.onSearch.bind(this),
      'default'   : ()=>{console.log(`${name} not found`)}
    }
    return (handlers[name] || handlers['default'])(status)
    */
  }

  private handlerSearchFormClose(result: ISearchQuery | undefined) {
    this.setState({showModal:false})
  }

  render() {
    const modal = this.state.showModal
    ? (
      <Modal classes='content-center'>
        <Search
          onExitHandler = {this.handlerSearchFormClose.bind(this)}
        />
      </Modal>
    )
    : null;
    
    return (
      <>
        <div className='flex-column'>
          <EventsHeaderMenu
              ToolMenuHandler = {this.handlerToolMenu.bind(this)}
              isTougle = {false}
            />
          <div className='flex-all-client b1pxdgr'>
            <EventsTable
              items = {this.state.respond.Items}
              DateSortDirectionIcon = {this.getDateSortDirectionIcon(this.state.query.SortMode?.DateTimeSortDirection)}
              EventsSortModeIcon = {this.getEventSortModeIcon(this.state.query.SortMode?.EventsSortMode)}
              changeDateSortModeHandler = {this.changeDateSortMode.bind(this)}
              changeEventsSortModeHandler = {this.changeEventsSortMode.bind(this)}
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
        {modal}
      </>
    );
  }
}
