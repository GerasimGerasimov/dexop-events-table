import React, { Component } from "react";
import { IEventItem, IEventSortMode, ISortDirection, ISortMode} from "../../server/ieventsdata";
import Markers from "../markers/event-icon";
import './EventsTable.css'

interface IEventTableProps {
  items: Array<IEventItem>;
  dateSortDirection: ISortDirection | undefined;
  eventsSortMode: IEventSortMode | undefined;
  changeSortModeHandler(SortMode: ISortMode): void;
}

interface IEventsTableState {

}

export default class EventsTable extends Component<IEventTableProps ,IEventsTableState> {
  constructor(props: IEventTableProps) {
    super(props)
  }

  private getFormatedDateTime(datetime: string): string {
    const time = new Date(datetime).toLocaleString();
    return time;
  }

  private getArrow(direction: ISortDirection | undefined):string {
    const dir: ISortDirection = direction || ISortDirection.Up;
    return  (dir === ISortDirection.Up)
            ? '▲'
            : '▼'
  }

  private getFigures(Mode: IEventSortMode | undefined):string {
    const mode: IEventSortMode = Mode || IEventSortMode.All;
    if (mode === IEventSortMode.Alarm)   { return '⬥'};
    if (mode === IEventSortMode.Warning) { return '∎'};
    if (mode === IEventSortMode.Info)    { return '▲'};
    return '⋮' //all
  }

  render () {
    return (
      <div className='events-wrapper'>
        <table className='events'>
          <thead>
            <tr>
                <th
                  onClick={()=>this.props.changeSortModeHandler(ISortMode.datetime)}>
                  Date/Time
                  {` ${this.getArrow(this.props.dateSortDirection)}`}
                </th>
                <th>AW</th>
                <th
                  onClick={()=>this.props.changeSortModeHandler(ISortMode.events)}>
                  Comment
                  {` ${this.getFigures(this.props.eventsSortMode)}`}
                </th>
                <th>Tag</th>
            </tr>
            </thead>
            <tbody>
              {
                this.props.items.map((item, index)=>{
                  const {tag, datetime, details} = {... item};
                  const {type, initialValue, comment, todo} = {... details}
                  return (
                    <tr key={index}>
                      <td align="left">{this.getFormatedDateTime(datetime)}</td>
                      <td className='center'><Markers type={type}/></td>
                      <td width="100%" align="left">{comment}</td>
                      <td align="left">{tag}</td>
                    </tr>
                  )
                })
              }
            </tbody>
        </table>
      </div>
    )
  }
}