import React, { Component } from 'react';
import Events from './event-table/Pages/Events/Events';

export default class App extends Component<{},{}> {

  render() {
    return (
      <div>
        <Events/>
      </div>
    );
  }
}