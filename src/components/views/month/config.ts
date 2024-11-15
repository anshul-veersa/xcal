import type { RootConfig } from "@/types";
import type { MonthViewConfig } from "./types";

export function adaptConfig<T, B>(
  xCalConfig: RootConfig<T, B>
): MonthViewConfig {
  const viewConfig = xCalConfig.views?.month ?? {};

  return {
    maxEventsPerSlot:
      viewConfig.maxEventsPerSlot ??
      xCalConfig.common?.maxEventsPerSlot ??
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
