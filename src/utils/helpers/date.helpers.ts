import * as moment from 'moment';

type U = 'days' | 'weeks' | 'years';

export const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';
export const YEAR_MONTH_DAY_DATE_FORMAT = 'YYYY-MM-DD';
export const HOUR_MIN_SEC_TIME_FORMAT = 'HH:mm:ss';

export type Format =
  | typeof DEFAULT_DATE_FORMAT
  | typeof YEAR_MONTH_DAY_DATE_FORMAT
  | typeof HOUR_MIN_SEC_TIME_FORMAT;

export class DateHelpers {
  static now(timestamp?: boolean): moment.Moment | number {
    return (timestamp && Date.now()) || moment();
  }

  static diffBtwDates(
    unit: U,
    date1: Date | string,
    date2?: Date | string,
  ): number {
    const secDate: any = (date2 && moment(date2 as Date)) || moment();
    return secDate.diff(moment(date1 as Date), unit);
  }

  // eslint-disable-next-line class-methods-use-this
  static formatDate(date: string | Date, dateFormat?: Format): string {
    return (!date && '-') || dateFormat
      ? moment(date).format(dateFormat)
      : moment(date).format();
  }

  static isFirstDayOf(
    unitOfTime: moment.unitOfTime.StartOf = 'month',
    date?: Date,
  ): boolean {
    const currentDate = date ? moment(date) : moment();
    const firstDay = (date ? moment(date) : moment()).startOf(unitOfTime);
    // const currentDate = moment();
    // const firstDay = moment().startOf(unitOfTime);
    return currentDate.isSame(firstDay, 'day');
  }

  static getFirstDayOfWeek(date: Date): Date {
    const firstDayOfWeek = date;
    const day = firstDayOfWeek.getDay() || 7; // Get current day number, converting Sun. to 7
    if (day !== 1) {
      // Only manipulate the date if it isn't Mon.
      firstDayOfWeek.setHours(-24 * (day - 1));
    }
    return firstDayOfWeek;
  }

  static endOfWeek(date: string | Date): Date {
    return moment(date).endOf('week').add(1).toDate();
  }

  static startOfWeek(date: string | Date): Date {
    return moment(date).startOf('week').toDate();
  }

  static daysFromNow(date) {
    if (!date) return 0;
    const timeDiff = new Date(date).getTime() - Date.now();
    // To calculate the no. of days between two dates
    return timeDiff < 0 ? 0 : Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  static startOfLastWeek(date: string | Date): Date {
    return moment(date).subtract(1, 'weeks').startOf('week').toDate();
  }

  static endOfLastWeek(date: string | Date): Date {
    return moment(date).subtract(1, 'weeks').endOf('week').add(1).toDate();
  }

  static addToDate(date: Date, num: any, unit: string): Date {
    return moment(date).add(num, unit).toDate();
  }

  static removeFromDate(date: Date, num: any, unit: string): Date {
    return moment(date).subtract(num, unit).toDate();
  }

  static subtractDate(date: Date, num: any, unit: string): Date {
    return moment(date).subtract(num, unit).toDate();
  }

  static isFuture(date1: Date, date2: Date): boolean {
    return moment(date1).isAfter(date2);
  }

  static daysInRange(from: Date, to: Date): number {
    const difference = to.getTime() - from.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24));
  }

  static isBefore(date1: Date, date2: Date): boolean {
    return moment(date1).isBefore(moment(date2));
  }

  static isDate(str): boolean {
    const date = moment(str);
    return date.isValid();
  }
}
