export function toDatetimeLocal(date: Date): string {
  var
    ten = function (i:number) {
      return (i < 10 ? '0' : '') + i;
    },
    YYYY = date.getFullYear(),
    MM = ten(date.getMonth() + 1),
    DD = ten(date.getDate()),
    HH = ten(date.getHours()),
    II = ten(date.getMinutes()),
    SS = ten(date.getSeconds())
  ;
  return YYYY + '-' + MM + '-' + DD + 'T' +
           HH + ':' + II + ':' + SS;
};

export function getLocalDateFormValue(value: number | undefined): string {
  const dateFrom = value || new Date();
  const date = new Date(dateFrom);
  return toDatetimeLocal(date);
}