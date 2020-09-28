import React from 'react';
import EventsTable, { IEventItem } from './components/table/EventsTable';
import { dataset } from './datasets/events';

function App() {
  return (
    <div>
      <EventsTable items={Object.entries(dataset).map((value, index, array)=>{
        const id = value[0] || ''
        const {tag, datetime, details} = {... value[1]};
        const res: IEventItem = {
          tag,
          datetime,
          details
        }
        return res;
      })}/>
    </div>
  );
}

export default App;
