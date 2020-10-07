import React, { Component } from "react";
import EventsTable from "../../components/table/EventsTable";
import { IEventQueryDirection, IEventsQuery, IEventsRespond } from "../../server/ieventsdata";
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
        QueriedQuantity: 10
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

  private nextItems(direction: IEventQueryDirection) {
    this.setState((state)=>({
      query:{
        ...state.query,
        FromIndex: this.getNextIndex(direction)
      }
    }), ()=>this.getData())
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

  render() {
    return (
      <div className='flex-column'>
        <div className='b1pxdgr'><button>Search</button></div>
        <div className='flex-all-client b1pxdgr'>
          <EventsTable items = {this.state.respond.Items}/>
        </div>
          <Paginator
            ItemsAfter = {this.state.respond.ItemsAfter}
            ItemsBefore = {this.state.respond.ItemsBefore}
            ItemsPortion = {TenItemsOnPage}
            QueriedQuantity = {this.state.query.QueriedQuantity}
            nextItemsHandler = {this.nextItems.bind(this)}
            setNumberOfItemsOnPageHandler = {this.setNumberOfItemsOnPage.bind(this)}
          />
      </div>
    );
  }
}