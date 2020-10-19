import { dataset } from "../datasets/events";
import { IEventItem, IEventSortMode, IEventsQuery, IEventsRespond, IEventsSortMode, ISortDirection } from "./ieventsdata";

export const count = 10;

const sequences = {
  [IEventSortMode.Alarm]  : [IEventSortMode.Alarm,   IEventSortMode.Warning, IEventSortMode.Info],
  [IEventSortMode.Warning]: [IEventSortMode.Warning, IEventSortMode.Alarm,   IEventSortMode.Info],
  [IEventSortMode.Info]:    [IEventSortMode.Info,    IEventSortMode.Warning, IEventSortMode.Alarm]
}

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

  private getSortedMap(Items:Array<IEventItem>, DateTimeSortDirection: ISortDirection):Map<string, Array<IEventItem>>{
    const res:Map<string, Array<IEventItem>> = new Map();
    const a: any = Object.entries(IEventSortMode);
    for (const [key, type] of a) {
        console.log(key, type)
        if (type) {
            res.set(type,Items
                        .filter(item=> item.details.type === type)
                        .sort(sortByDate(DateTimeSortDirection))
                  )
        }
    }
    return res;
  }

  private getSortedItems(Items: Array<IEventItem>, query: IEventsQuery): Array<IEventItem> {
    let items:Array<IEventItem> = Items;
    const SortMode: IEventsSortMode = query.SortMode;
    //если не надо сортировать по типам событий, а просто все события
    //в хронологическом порядке
    if (SortMode.EventsSortMode === IEventSortMode.All) {
      items.sort(sortByDate(SortMode.DateTimeSortDirection));//
    } else {
      //1) получаю от 1 до 3х (по типам событий) отсортированных по времени массивов
      const res:Map<string, Array<IEventItem>> = this.getSortedMap(Items, SortMode.DateTimeSortDirection);
      //2) Теперь надо собрать их в один массив в зависимости от типа события
      items = this.concatEventsArraysBy(res, sequences[SortMode.EventsSortMode])
    }
    items = this.filterByDataRange(items, query);
    items = this.filterByEvent(items, query)
    return items;
  }

  private concatEventsArraysBy(source: Map<string, Array<IEventItem>>, sequence:Array<IEventSortMode>): Array<IEventItem> {
    let result: Array<IEventItem> = [];
    sequence.forEach((mode)=>{
      const src: Array<IEventItem> = source.get(mode) || [];
      result = result.concat(src)
    })
    return result;
  }

  //Если указаны ограничения по времени в полях Range, то удалить все записи не входящие в диапазон
  private filterByDataRange(source: Array<IEventItem>, query: IEventsQuery):Array<IEventItem> {
    let res: Array<IEventItem> = source;
    const {dateFrom, dateTo} = {... query.Range};
    if ((dateFrom !== undefined) && (dateTo !== undefined)) {
      res = source.filter((item)=>{
        const itemDate: number = new Date(item.datetime).getTime();
        return ((itemDate >= dateFrom) && (itemDate <= dateTo))
      })
    }
    return res; 
  }

  //Если в Range есть НЕ All event то убрать все события кроме этого
  private filterByEvent(source: Array<IEventItem>, query: IEventsQuery):Array<IEventItem> {
    let res: Array<IEventItem> = source;
    const {event} = {... query.Range};
    if (event !== undefined) {
      if (event !== IEventSortMode.All) {
        res = source.filter(item => event === item.details.type)
      }
    }
    return res; 
  }

  public getItems(query: IEventsQuery): IEventsRespond {
    const result: IEventsRespond = this.defaultEventRespond();
    const unSortedItems:Array<IEventItem> = this.Items;
    const sortedItems: Array<IEventItem> = this.getSortedItems(unSortedItems, query);
    const ItemsArray: Array<IEventItem> = sortedItems.slice(query.FromIndex, query.FromIndex+query.QueriedQuantity);
    result.Items = ItemsArray;
    result.ItemsBefore = query.FromIndex;
    result.ItemsAfter = result.TotalItemsQuantity - (query.FromIndex + ItemsArray.length) ;
    result.ItemsInRespond = ItemsArray.length;
    return result;
  }
}

export const EventsModel:TEventsModel = new TEventsModel(dataset);

function sortByDate(direction: ISortDirection): any {
  return function sort(A:IEventItem, B:IEventItem): number {
      const a: number = new Date(A.datetime).getTime();
      const b: number = new Date(B.datetime).getTime();
      return  (direction === ISortDirection.Up)
              ? a-b
              : b-a
  }
}