import type { WeekDay } from "@/core/temporal";

export type LocaleOptions = {
  /**
   * Locale of the calendar.
   * @default undefined
   */
  locale: string;
  /**
   * TimeZone of the calendar.
   * @default "local"
   */
  timeZone: string;
  /**
   * @default undefined
   */
  weekStartsOn: WeekDay;
  /**
   * Formatting options for date time components
   */
  format: {
    /**
     * Format of the time only component
     */
    time: {
      short: string;
      long: string;
    };
    /**
     * Format of the date only component
     */
    date: {
      short: string;
      abbr: string;
      long: string;
      wide: string;
    };
    /**
     * Format of the full data time component
     */
    dateTime: {
      short: string;
      abbr: string;
      long: string;
      wide: string;
    };
    /**
     * Standalone format of the day/date of month component of a time.
     */
    day: string;
    /**
     * Standalone format of the week number component of a time.
     */
    weekNumber: string;
    /**
     * Standalone format of the week day name component of a time.
     */
    weekDay: string;
    /**
     * Standalone format of the month component of a time.
     */
    month: {
      short: string;
      long: string;
    };
    /**
     * Standalone format of the year component of a time.
     */
    year: string;
  };
};
