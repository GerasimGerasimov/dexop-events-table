import React, { Component } from "react";
import { IEventItem} from "../../server/ieventsdata";
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
      <div className='vscroll-wrapper'>
        <table className='w100p grid vscroll-table'>
          <tbody>
            {
              this.props.items.map((item, index)=>{
                const {tag, datetime, details} = {... item};
                const {type, initialValue, comment, todo} = {... details}
                return (
                  <tr key={index}>
                    <td >{type}</td>
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