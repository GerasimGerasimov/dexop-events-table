import React, { Component } from "react";
import './markers.css';

export interface IMarkersProps {
  type: string;
}

export default class Markers extends Component <IMarkersProps,{}> {

  render () {
    return (
      <div>
        <p className='legend-item'>{this.props.type}</p>
      </div>
    )
  }
}