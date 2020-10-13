import { dataset } from "../datasets/events";
import { IEventItem, IEventSortMode, IEventsQuery, IEventsRespond, IEventsSortMode, ISortDirection } from "./ieventsdata";

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
        DateTimeSortDirection: ISortDirection.Up,
        EventsSortMode: IEventSortMode.Alarm
      },
      Position: 0
    }
    this.Clients.set(client.ID, client);
    return client.ID
  }

  private defaultEventRespond(): IEventsRespond {
    return {
      ClientID: '', //уникальный ID клиента
      DateTime: new Date().toISOString(), //время отправки данных сервером
      TotalItemsQuantity: this.Items.length,
      ItemsBefore: 0,
      ItemsAfter: 0,
      ItemsInRespond: 0,
      SortMode: {
        DateTimeSortDirection: ISortDirection.Up,
        EventsSortMode: IEventSortMode.Alarm
      },
      Items: []
    }
  }

  public getItems(query: IEventsQuery): IEventsRespond {
    const result: IEventsRespond = this.defaultEventRespond();
    const ItemsArray: Array<IEventItem> = this.Items.slice(query.FromIndex, query.FromIndex+query.QueriedQuantity);
    result.Items = ItemsArray;
    result.ItemsBefore = query.FromIndex;
    result.ItemsAfter = result.TotalItemsQuantity - (query.FromIndex + ItemsArray.length) ;
    result.ItemsInRespond = ItemsArray.length;
    return result;
  }
}

export const EventsModel:TEventsModel = new TEventsModel(dataset);