import React, { Component } from "react";
import { IEventItem} from "../../../server/ieventsdata";
import Markers from "../markers/event-icon";
import './EventsTable.css'

interface IEventTableProps {
  items: Array<IEventItem>;
  DateSortDirectionIcon: string;
  EventsSortModeIcon: string;
  changeDateSortModeHandler(): void;
  changeEventsSortModeHandler(): void;
}

interface IEventsTableState {

}

export default class EventsTable extends Component<IEventTableProps ,IEventsTableState> {

  private getFormatedDateTime(datetime: string): string {
    const time = new Date(datetime).toLocaleString();
    return time;
  }

  render () {
    return (
      <div className='events-wrapper'>
        <table className='events'>
          <thead>
            <tr>
                <th
                  onClick={()=>this.props.changeDateSortModeHandler()}>
                  Date/Time {this.props.DateSortDirectionIcon}
                </th>
                <th>AW</th>
                <th
                  onClick={()=>this.props.changeEventsSortModeHandler()}>
                  Comment {this.props.EventsSortModeIcon}
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