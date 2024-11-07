import type { CalendarEvent, XCalConfig } from "@/types";

export type GroupId = string | number;
export type Group<T> = { id: GroupId; events: CalendarEvent<T>[] };

export type MonthViewConfig = {
  maxEventsPerSlot: number;
  showSiblingMonthDatesEvents: boolean;
};

export function adaptConfig<T, B>(
  xCalConfig: XCalConfig<T, B>
): MonthViewConfig {
  const viewConfig = xCalConfig.views?.month ?? {};

  return {
    maxEventsPerSlot:
      viewConfig.maxEventsPerSlot ??
      xCalConfig.config.maxEventsPerSlot ??
      defaults.maxEventsPerSlot,
    showSiblingMonthDatesEvents:
      viewConfig.showSiblingMonthDatesEvents ??
      defaults.showSiblingMonthDatesEvents,
  };
}

const defaults: MonthViewConfig = {
  maxEventsPerSlot: 10,
  showSiblingMonthDatesEvents: true,
};
