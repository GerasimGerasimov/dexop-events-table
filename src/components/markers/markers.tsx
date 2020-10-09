import React, { Component } from "react";
import './markers.css';

export interface IMarkersProps {
  type: string;
}
/* https://ruseller.com/lessons.php?id=2077&rub=2 */

export default class Markers extends Component <IMarkersProps,{}> {

  private getSVG(type: string) {
    switch (type) {
      case 'a':
        return (
          <svg className='_svg' viewBox="0 0 1 1">
            <g transform='translate(0.15, 0.15) scale(0.85)'>
              <path d="M 0 0.5 L 0.5 0 L 1 0.5 L 0.5 1 Z"
                fill="red"/>
            </g>
          </svg>
        )
      case 'w':
        return (
          <svg className='_svg' viewBox="0 0 1 1">
            <g transform='translate(0.15, 0.15) scale(0.85)'>
              <rect x='0' y='0' width='1' height='1'
                fill="#ffba00"/>
            </g>
          </svg>
        )
      case 'i':
        return (
          <svg className='_svg' viewBox="0 0 1 1">
            <g transform='translate(0.15, 0.15) scale(0.85)'>
              <path d="M 0 1 L 0.5 0 L 1 1 Z"
                fill="#8000C0"/>
            </g>
          </svg>
        )
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
