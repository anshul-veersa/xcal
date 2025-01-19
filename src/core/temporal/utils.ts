import * as dateFns from "date-fns";
import * as tzFn from "@date-fns/tz";
import * as rrule from "rrule";
import type { LocaleOptions, TimeRange } from "@/types";

export const weekDays = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

const weekDaysMap = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
} as const;

export type WeekDay = (typeof weekDays)[number];

const adaptCtx = (locale: LocaleOptions) => {
  return {
    in: tz(locale.timeZone),
    weekStartsOn: weekDaysMap[locale.weekStartsOn],
  };
};

type TZContext = Pick<LocaleOptions, "timeZone">;
type LocaleContext = LocaleOptions;

// Constants and Getters values
export const MINUTES_IN_A_DAY = 1440;
export const userTimeZone = new Intl.DateTimeFormat().resolvedOptions()
  .timeZone;
export function today(ctx: TZContext) {
  return dateFns.startOfDay(new Date(), { in: tz(ctx.timeZone) });
}
export function now(ctx: TZContext) {
  return inTz(new Date(), ctx.timeZone);
}

// Segment Utilities
export const startOfMonth = (date: Date, ctx: TZContext): Date =>
  dateFns.startOfMonth(date, { in: tz(ctx.timeZone) });
export const endOfMonth = (date: Date, ctx: TZContext): Date =>
  dateFns.endOfMonth(date, { in: tz(ctx.timeZone) });
export const startOfWeek = (date: Date, ctx: LocaleContext): Date =>
  dateFns.startOfWeek(date, adaptCtx(ctx));
export const endOfWeek = (date: Date, ctx: LocaleContext): Date =>
  dateFns.endOfWeek(date, adaptCtx(ctx));
export const startOfDay = (date: Date, ctx: TZContext): Date =>
  dateFns.startOfDay(date, { in: tz(ctx.timeZone) });
export const endOfDay = (date: Date, ctx: TZContext): Date =>
  dateFns.endOfDay(date, { in: tz(ctx.timeZone) });
export const getWeek = (date: Date, ctx: LocaleContext) =>
  dateFns.getWeek(date, adaptCtx(ctx));
export const getWeekDayIndex = (date: Date, ctx: LocaleContext) => {
  const localeCtx = adaptCtx(ctx);
  const startOfWeekDay = dateFns.getDay(
    dateFns.startOfWeek(date, localeCtx),
    localeCtx
  );
  const weekDay = dateFns.getDay(date, localeCtx);
  return (weekDay - startOfWeekDay + 7) % 7;
};
export const normalizeToDate = (time: Date, ctx: TZContext): Date =>
  startOfDay(time, ctx);
export const imposeTimeOn = (date: Date, time: Date): Date =>
  dateFns.set(date, {
    hours: time.getHours(),
    minutes: time.getMinutes(),
    seconds: time.getSeconds(),
    milliseconds: time.getMilliseconds(),
  });

// Comparison Utilities
export const isBefore = dateFns.isBefore;
export const isAfter = dateFns.isAfter;
export const isBetween = (date: Date, range: TimeRange, ctx: TZContext) =>
  dateFns.isWithinInterval(date, range, { in: tz(ctx.timeZone) });
export const isSameDay = (dateA: Date, dateB: Date, ctx: LocaleContext) =>
  dateFns.isSameDay(dateA, dateB, adaptCtx(ctx));
export const isToday = (date: Date, ctx: LocaleContext) =>
  dateFns.isToday(date, adaptCtx(ctx));

// Arithmetic Utilities
export const addMinutes = (date: Date, amount: number, ctx: LocaleContext) =>
  dateFns.addMinutes(date, amount, adaptCtx(ctx));
export const addDays = (date: Date, amount: number, ctx: LocaleContext) =>
  dateFns.addDays(date, amount, adaptCtx(ctx));
export const addWeeks = (date: Date, amount: number, ctx: LocaleContext) =>
  dateFns.addWeeks(date, amount, adaptCtx(ctx));

// Distance/Relativity Utilities
export const differenceInMinutes = dateFns.differenceInMinutes;
export function minutesSinceEpochFrom(time: Date, ctx: TZContext) {
  const msSinceEpoch = inTz(time, ctx.timeZone).valueOf();
  return msSinceEpoch / 60_000;
}
export function numberOfDaysBetween(range: TimeRange, ctx: LocaleContext) {
  return dateFns.differenceInCalendarDays(range.end, range.start, {
    in: tz(ctx.timeZone),
  });
}

// Recurrence Utilities
export function parseRecurrencePattern(pattern: string, ctx: TZContext) {
  return rrule.rrulestr(pattern, { compatible: true, tzid: ctx.timeZone });
}

// Interval Expansion Utilities
export const eachMinuteBetween = (
  range: TimeRange,
  ctx: TZContext & { step?: number }
) => dateFns.eachMinuteOfInterval(range, ctx);
export const eachDayBetween = (
  range: TimeRange,
  ctx: TZContext & { step?: number }
) => dateFns.eachDayOfInterval(range, { in: tz(ctx.timeZone) });
export const eachWeekBetween = (
  range: TimeRange,
  ctx: LocaleContext & { step?: number }
) => dateFns.eachWeekOfInterval(range, adaptCtx(ctx));
export const eachMonthBetween = (
  range: TimeRange,
  ctx: TZContext & { step?: number }
) => dateFns.eachMonthOfInterval(range, { in: tz(ctx.timeZone) });
export function getWeekDates(forDate: Date, ctx: LocaleContext): Date[] {
  const localeCtx = adaptCtx(ctx);
  return dateFns.eachDayOfInterval({
    start: dateFns.startOfWeek(forDate, localeCtx),
    end: dateFns.endOfWeek(forDate, localeCtx),
  });
}
export function getOccurrencesBetween<
  T extends { startsAt: Date; endsAt: Date; recurrencePattern?: string }
>(range: TimeRange, event: T, ctx: TZContext) {
  if (!event.recurrencePattern) return [event];
  const rrule = parseRecurrencePattern(event.recurrencePattern, ctx);
  const occurrences = rrule.between(range.start, range.end, true);
  const eventDuration = +event.endsAt - +event.startsAt;
  return occurrences.map((occurrence) => ({
    ...event,
    startsAt: occurrence,
    endsAt: new Date(+occurrence + eventDuration),
  }));
}

// TimeZone Utilities
export const tz = tzFn.tz;
export const inTz = (date: Date, timeZone: string): Date =>
  dateFns.transpose(new tzFn.TZDateMini(date, timeZone), Date);

// Formatting
export const format = (date: Date, pattern: string, ctx?: LocaleContext) =>
  dateFns.format(date, pattern, ctx ? adaptCtx(ctx) : {});
