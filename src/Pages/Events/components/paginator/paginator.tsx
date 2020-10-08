import React, { Component } from "react";
import { IEventQueryDirection } from "../../../../server/ieventsdata";
import './paginator.css'

interface IPaginatorProps {
  ItemsBefore: number;
  ItemsAfter: number;
  ItemsPortion: number;
  QueriedQuantity: number;
  nextItemsHandler: any;
  setNumberOfItemsOnPageHandler: any;
}

const minItemsOnPage: number = 10;
const maxItemsOnPage: number = 40;

export default class Paginator extends Component <IPaginatorProps,{}> {

  private addItemsOnPage(quantity: number): number {
    const remainingItems: number = this.props.QueriedQuantity + quantity;
    return (remainingItems > maxItemsOnPage)
            ? maxItemsOnPage
            : remainingItems;
  }

  private subItemsOnPage(quantity: number): number {
    const remainingItems: number = this.props.QueriedQuantity - quantity;
    return (remainingItems < minItemsOnPage)
            ? minItemsOnPage
            : remainingItems;
  }

  render () {
    return (
      <div className='flex alitcn jcsa'>
        <span>{this.props.ItemsBefore}</span>
        <button onClick={()=>this.props.nextItemsHandler(IEventQueryDirection.Prev)}>Pred</button>
        <button onClick={()=>this.props.nextItemsHandler(IEventQueryDirection.Next)}>Next</button>
        <span>{this.props.ItemsAfter}</span>
        <button onClick={()=>this.props.setNumberOfItemsOnPageHandler(this.addItemsOnPage(this.props.ItemsPortion))}>+10</button>
        <button onClick={()=>this.props.setNumberOfItemsOnPageHandler(this.subItemsOnPage(this.props.ItemsPortion))}>-10</button>
      </div>
    )
  }
}