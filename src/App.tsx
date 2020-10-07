import React, { Component } from 'react';
import EventsTable from './components/table/EventsTable';
import { IEventQueryDirection, IEventsQuery, IEventsRespond } from './server/ieventsdata';
import { EventsModel } from './server/server';
import './App.css'

interface IAppProps{
}

interface IAppState{
  query: IEventsQuery;
  respond: IEventsRespond;
}

const minItemsOnPage: number = 10;
const maxItemsOnPage: number = 30;
const TenItemsOnPage: number = 10;

export default class App extends Component<IAppProps,IAppState> {

  constructor(props: IAppProps){
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

  private addItemsOnPage(quantity: number): number {
    const remainingItems: number = this.state.query.QueriedQuantity + quantity;
    return (remainingItems > maxItemsOnPage)
            ? maxItemsOnPage
            : remainingItems;
  }

  private subItemsOnPage(quantity: number): number {
    const remainingItems: number = this.state.query.QueriedQuantity - quantity;
    return (remainingItems < minItemsOnPage)
            ? minItemsOnPage
            : remainingItems;
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
        <div className='b1pxdgr'>
          <span>{this.state.respond.ItemsBefore}</span>
          <button onClick={()=>this.nextItems(IEventQueryDirection.Prev)}>Pred</button>
          <button onClick={()=>this.nextItems(IEventQueryDirection.Next)}>Next</button>
          <span>{this.state.respond.ItemsAfter}</span>
          <button onClick={()=>this.setNumberOfItemsOnPage(this.addItemsOnPage(TenItemsOnPage))}>+10</button>
          <button onClick={()=>this.setNumberOfItemsOnPage(this.subItemsOnPage(TenItemsOnPage))}>-10</button>
        </div>
      </div>
    );
  }
}