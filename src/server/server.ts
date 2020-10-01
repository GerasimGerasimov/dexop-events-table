import { dataset } from "../datasets/events";
import { IEventItem, IEventSortDirection, IEventSortItem, IEventsQuery, IEventsRespond, IEventsSortMode } from "./ieventsdata";

export const count = 10;

interface IEventsModelClient {
  ID: string;
  SortMode: IEventsSortMode;//как были отсортировваны данные
  Position: number;
}

export class TEventsModel {
  private Clients: Map<string, IEventsModelClient> = new Map();
  private items: Array<IEventItem> = [];
  
  constructor(Dataset: any){
    this.items = this.fillItemsFromDataset(Dataset);
  }

  private fillItemsFromDataset(Dataset: any): Array<IEventItem> {
    return Object.entries(Dataset).map((value)=>{
      const id = value[0] || '';
      const {tag, datetime, details} = {... value[1] as IEventItem};
      const res: IEventItem = {
        tag,
        datetime,
        details
      }
      return res;
    })
  }

  public get Items():Array<IEventItem> {
    return this.items;
  } 

  public authorize(): string {
    const client: IEventsModelClient = {
      ID:'gerasim',
      SortMode: {
        SortBy: IEventSortItem.Time,
        Direction: IEventSortDirection.Down
      },
      Position: 0
    }
    this.Clients.set(client.ID, client);
    return client.ID
  }

  private defaultEventRespind(): IEventsRespond {
    return {
      ClientID: '', //уникальный ID клиента
      DateTime: new Date().toISOString(), //время отправки данных сервером
      TotalItemsQuantity: 0,
      ItemsBefore: 0,
      ItemsAfter: 0,
      ItemsInRespond: 0,
      SortMode: {
        SortBy: IEventSortItem.Time,
        Direction: IEventSortDirection.Down
      },
      Items: {}
    }
  }

  public getItems(query: IEventsQuery): IEventsRespond {
    const result: IEventsRespond = this.defaultEventRespind();
    return result;
  }
}

export const EventsModel:TEventsModel = new TEventsModel(dataset);