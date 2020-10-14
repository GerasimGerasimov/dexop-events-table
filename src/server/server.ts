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

  private sortByDateTime(Items: Array<IEventItem>, direction: ISortDirection): Array<IEventItem>{
    function sort(A:IEventItem, B:IEventItem): number {
      const a: number = new Date(A.datetime).getTime();
      const b: number = new Date(B.datetime).getTime();
      return  (direction === ISortDirection.Up)
              ? a-b
              : b-a
    }

    return Items.sort(sort);
  }

  private getSortedItems(Items: Array<IEventItem>, SortMode: IEventsSortMode): Array<IEventItem> {
    console.log(SortMode.DateTimeSortDirection);
    const items:Array<IEventItem> = this.sortByDateTime(Items, SortMode.DateTimeSortDirection);
    return items;
  }

  public getItems(query: IEventsQuery): IEventsRespond {
    const result: IEventsRespond = this.defaultEventRespond();
    const unSortedItems:Array<IEventItem> = this.Items;
    const sortedItems: Array<IEventItem> = this.getSortedItems(unSortedItems, query.SortMode);
    const ItemsArray: Array<IEventItem> = sortedItems.slice(query.FromIndex, query.FromIndex+query.QueriedQuantity);
    result.Items = ItemsArray;
    result.ItemsBefore = query.FromIndex;
    result.ItemsAfter = result.TotalItemsQuantity - (query.FromIndex + ItemsArray.length) ;
    result.ItemsInRespond = ItemsArray.length;
    return result;
  }
}

export const EventsModel:TEventsModel = new TEventsModel(dataset);