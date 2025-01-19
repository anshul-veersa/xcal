import type { RootConfig } from "@/types";
import type { MonthViewConfig } from "./types";

export function adaptConfig(xCalConfig: RootConfig): MonthViewConfig {
  const viewConfig = xCalConfig.views?.month ?? {};
  const defaults = getDefaults();

  return {
    maxEventsPerSlot:
      viewConfig.maxEventsPerSlot ??
      xCalConfig.config?.maxEventsPerSlot ??
      defaults.maxEventsPerSlot,
    showSiblingMonthDates:
      viewConfig.showSiblingMonthDates ?? defaults.showSiblingMonthDates,
    showWeekNumber: viewConfig.showWeekNumber ?? defaults.showWeekNumber,
  };
}

const getDefaults = (): MonthViewConfig => {
  return {
    maxEventsPerSlot: 10,
    showSiblingMonthDates: true,
    showWeekNumber: false,
  };
};
