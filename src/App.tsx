import React, { Component } from 'react';
import EventsTable from './components/table/EventsTable';
import { IEventItem, IEventQueryDirection, IEventsQuery, IEventsRespond } from './server/ieventsdata';
import { EventsModel } from './server/server';

interface IAppProps{
}

interface IAppState{
  query: IEventsQuery;
  Items: Array<IEventItem>;
}


const ItemsOnPage: number = 10;

export default class App extends Component<IAppProps,IAppState> {

  constructor(props: IAppProps){
    super(props)
    this.state = {
      query: {
        FromIndex:0,
        QueriedQuantity: 10
      },
      Items:[]
    }
  }

  private nextItems(direction: IEventQueryDirection) {
    let NextFromIndex: number = this.state.query.FromIndex;
    switch (direction) {
      case IEventQueryDirection.Next:
        NextFromIndex  += ItemsOnPage;
        break;
      case IEventQueryDirection.Prev:
        NextFromIndex  -= ItemsOnPage;
        NextFromIndex = (NextFromIndex < 0)? 0 : NextFromIndex;
        break;
    }
    
    this.setState((state)=>({
      query:{
        FromIndex: NextFromIndex,
        QueriedQuantity: state.query.QueriedQuantity
      }
    }), ()=>this.getRespond())
    console.log(NextFromIndex + this.state.query.QueriedQuantity);

  }

  componentDidMount(){
    this.getRespond()
  }

  getRespond(){
    const respond:IEventsRespond = EventsModel.getItems(this.state.query);
    this.setState({Items: respond.Items})
  }

  render() {
    return (
      <div className='flex-column'>
        <div><button>Search</button></div>
        <div className='flex-all-client'>
          <EventsTable items = {this.state.Items}/>
        </div>
        <div>
          <button onClick={()=>this.nextItems(IEventQueryDirection.Prev)}>Pred</button>
          <button onClick={()=>this.nextItems(IEventQueryDirection.Next)}>Next</button>
        </div>
      </div>
    );
  }
}