import React from 'react';
import EventsTable from './components/table/EventsTable';
import { EventsModel } from './server/server';

function App() {
  return (
    <div>
      <EventsTable items={EventsModel.Items}/>
    </div>
  );
}

export default App;
