import React from "react";
import './markers.css';

export function getIconAlarm(): any{
  return (
    <svg className='_svg' viewBox="0 0 1 1">
      <g transform='translate(0.15, 0.15) scale(0.85)'>
        <path d="M 0 0.5 L 0.5 0 L 1 0.5 L 0.5 1 Z"
          fill="red"/>
      </g>
    </svg>
  )
}

export function getIconWarning(): any{
  return (
    <svg className='_svg' viewBox="0 0 1 1">
      <g transform='translate(0.15, 0.15) scale(0.85)'>
        <rect x='0' y='0' width='1' height='1'
          fill="#ffba00"/>
      </g>
    </svg>
  )
}

export function getIconInfo(): any{
  return (
    <svg className='_svg' viewBox="0 0 1 1">
      <g transform='translate(0.15, 0.15) scale(0.85)'>
        <path d="M 0 1 L 0.5 0 L 1 1 Z"
          fill="#8000C0"/>
      </g>
    </svg>
  )
}