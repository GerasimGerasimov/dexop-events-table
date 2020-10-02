import React from 'react';
import EventsTable from './components/table/EventsTable';
import { EventsModel } from './server/server';

function App() {
  return (
    <div className="flex-column">
      <button>Search</button>
      <div className = 'flex-all-client'>
        <EventsTable items={EventsModel.Items}/>
      </div>
      <button>Prev-Next</button>
    </div>
  );
}

export default App;
