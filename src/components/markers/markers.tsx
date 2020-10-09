import React, { Component } from "react";
import { getIconAlarm, getIconInfo, getIconWarning } from "./icons";
import './markers.css';

export interface IMarkersProps {
  type: string;
}
/* https://ruseller.com/lessons.php?id=2077&rub=2 */

export default class Markers extends Component <IMarkersProps,{}> {

  private getSVG(type: string) {
    switch (type) {
      case 'a':
        return getIconAlarm();
      case 'w':
        return getIconWarning();
      case 'i':
        return getIconInfo();
    }
  }

  render () {
    return (
      <div className='div-item'>
        <div className='legend-item'>
          {this.getSVG(this.props.type)}
        </div>
      </div>
    )
  }
}
