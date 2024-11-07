import {
  type Locale,
  endOfWeek,
  startOfWeek,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  getWeek,
  format,
  differenceInCalendarDays,
  eachWeekOfInterval,
  isAfter,
  addDays,
  isBefore,
  addWeeks,
  isSameDay,
  isWithinInterval,
  startOfDay,
  endOfDay,
  addMinutes,
  differenceInMinutes,
  eachMinuteOfInterval,
  roundToNearestHours,
  roundToNearestMinutes,
  isSameMinute,
} from "date-fns";

export class TimeUtils {
  constructor(private readonly locale: Partial<Locale>) {}

  withLocale(locale: Partial<Locale>) {
    return new TimeUtils(locale);
  }

  /**
   * COMPARISON UTILITIES
   */
  isAfter = isAfter;
  isBefore = isBefore;
  isSameDay = isSameDay;
  isBetween = isWithinInterval;
  isSameMinute = isSameMinute

  /**
   * ARITHMETIC UTILITIES
   */
  addDays = addDays;
  addWeeks = addWeeks;
  addMinutes = addMinutes;
  differenceInMinutes = differenceInMinutes;

  /**
   * CONVERSION UTILITIES
   */
  startOfMonth = startOfMonth;
  endOfMonth = endOfMonth;
  startOfWeek = (date: Date) =>
    startOfWeek(date, { weekStartsOn: this.locale.options?.weekStartsOn });
  endOfWeek = (date: Date) =>
    endOfWeek(date, { weekStartsOn: this.locale.options?.weekStartsOn });
  startOfDay = startOfDay;
  endOfDay = endOfDay;
  roundToNearestMinutes = roundToNearestMinutes

  /**
   * RANGE & INTERVAL UTILITIES
   */
  eachMinuteOfInterval = eachMinuteOfInterval;
  eachDayOfInterval = eachDayOfInterval;
  eachWeekOfInterval = (range: { start: Date; end: Date }) =>
    eachWeekOfInterval(range, {
      weekStartsOn: this.locale.options?.weekStartsOn,
    });
  differenceInCalendarDays = differenceInCalendarDays;
  minutesSinceEpoch(time: Date) {
    const msSinceEpoch = time.valueOf();
    return msSinceEpoch / 60_000;
  }

  /**
   * PARSING & FORMATTING UTILITIES
   */
  // Add default formats
  format(date: Date, formatString: string) {
    return format(date, formatString, {
      // locale options
    });
  }

  getWeek = (date: Date) =>
    getWeek(date, { weekStartsOn: this.locale.options?.weekStartsOn });
  getWeekDay = (date: Date) =>
    differenceInCalendarDays(date, this.startOfWeek(date));
  getMinutesPassedInDay = (date: Date) =>
    date.getHours() * 60 + date.getMinutes();


  daysOfWeek(format: string = "EEE") {
    const date = new Date();
    const datesOfWeek = this.eachDayOfInterval({
      start: this.startOfWeek(date),
      end: this.endOfWeek(date),
    });
    return datesOfWeek.map((d, i) => ({
      index: i,
      name: this.format(d, "EEEEEE"),
      label: this.format(d, format),
    }));
  }

  getTimeOffsetFromDateInMinutes(date: Date, time: Date): number {
    const offset = time.valueOf() - date.valueOf();
    return offset / 60_000;
  }

  /** Today's date */
  get today() {
    return this.startOfDay(new Date());
  }

  /** Current timestamp */
  get now() {
    return new Date();
  }

  get minutesInDay() {
    return 1440;
  }
}
