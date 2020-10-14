export interface IEventItemDetails {
  type: string;
  initialValue: string,
  comment: string,
  todo: string;
}

export interface IEventItem {
  datetime: string;
  tag: string;
  details: IEventItemDetails;
}

export enum ISortDirection {
  Up,
  Down
}

export enum IEventSortMode {
  All     = '',
  Alarm   ='a',
  Warning = 'w',
  Info    = 'i'
}

/*
export const IEventSortMode = new Map ([
  ['All',''],
  ['Alarm', 'a'],
  ['Warning', 'w'],
  ['Info','i']
])
*/

export interface IEventsSortMode {
  DateTimeSortDirection: ISortDirection;
  EventsSortMode: IEventSortMode;
}

export enum IEventQueryDirection {
  Prev,
  Next
}

export interface IEventsQuery {
  ClientID?: string; //уникальный ID клиента
  SortMode: IEventsSortMode;//как сортировать данные для этого клиента
  FromIndex: number;
  QueriedQuantity: number;
  Direction?: IEventQueryDirection;
}

export interface IEventsRespond {
  ClientID?: string; //уникальный ID клиента
  DateTime?: string; //время отправки данных сервером
  TotalItemsQuantity: number;
  ItemsBefore: number;
  ItemsAfter: number;
  ItemsInRespond: number;
  SortMode?: IEventsSortMode;//как были отсортировваны данные
  Items: Array<IEventItem>;
}