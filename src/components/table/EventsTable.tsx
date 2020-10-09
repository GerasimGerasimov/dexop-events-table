import React, { Component } from "react";
import { IEventItem} from "../../server/ieventsdata";
import Markers from "../markers/markers";
import './EventsTable.css'

interface IEventTableProps {
  items: Array<IEventItem>;
}

interface IEventsTableState {

}

export default class EventsTable extends Component<IEventTableProps ,IEventsTableState> {
  constructor(props: IEventTableProps) {
    super(props)
  }

  render () {
    return (
      <div className='events-wrapper'>
        <table className='events'>
          <thead>
            <tr>
                <th>Type</th>
                <th>Tag</th>
                <th>Date/Time</th>
                <th>Comment</th>
            </tr>
            </thead>
            <tbody>
              {
                this.props.items.map((item, index)=>{
                  const {tag, datetime, details} = {... item};
                  const {type, initialValue, comment, todo} = {... details}
                  return (
                    <tr key={index}>
                      <td className='center'>
                        <Markers type={type}/>
                      </td>
                      <td align="left">{tag}</td>
                      <td >{datetime}</td>
                      <td align="left">{comment}</td>
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