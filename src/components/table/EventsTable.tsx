import React, { Component } from "react";

interface IEventsTableState {
  
}

export default class EventsTable extends Component<{},IEventsTableState> {
  constructor(props: any) {
    super(props)
  }

  render () {
    return (
      <div>
        <h1>Table of Events</h1>
      </div>
    )
  }
}