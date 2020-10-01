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

export enum IEventSortDirection {
  Up,
  Down
}

export enum IEventSortItem {
  Time,
  Type
}

export interface IEventsSortMode {
  Direction: IEventSortDirection;
  SortBy: IEventSortItem;
}

export enum IEventQueryDirection {
  Prev,
  Next
}

export interface IEventsQuery {
  ClientID: string; //уникальный ID клиента
  SortMode: IEventsSortMode;//как сортировать данные для этого клиента
  QueriedQuantity: number;
  Direction: IEventQueryDirection;
}

export interface IEventsRespond {
  ClientID: string; //уникальный ID клиента
  DateTime: string; //время отправки данных сервером
  TotalItemsQuantity: number;
  ItemsBefore: number;
  ItemsAfter: number;
  ItemsInRespond: number;
  SortMode: IEventsSortMode;//как были отсортировваны данные
  Items: any;
}