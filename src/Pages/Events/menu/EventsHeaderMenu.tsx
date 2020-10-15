import React, { Component } from "react";
import { IToolButtonProps } from "../../../components/ToolMenu/buttons/iToolButton";
import ToolMenu from "../../../components/ToolMenu/ToolMenu";

interface IToolMenuHandler {
  (name: string, status: boolean): void;
}

export interface IToolMenuProps {
  ToolMenuHandler: IToolMenuHandler;
  isTougle: boolean;
}

export default class EventsHeaderMenu extends Component <IToolMenuProps,{}> {
  private ToolMenu: Array<IToolButtonProps> = [
    { name: 'Search', type:'ToolButton', icon:['fa-search'], onClick:this.props.ToolMenuHandler}
  ]
    
  render () {
    return (
      <div>
        <ToolMenu elements = {this.ToolMenu}/>
      </div>
    )
  }
}