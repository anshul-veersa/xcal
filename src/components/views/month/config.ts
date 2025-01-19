import type { RootConfig } from "@/types";
import type { MonthViewConfig } from "./types";

export function adaptConfig(rootConfig: RootConfig): MonthViewConfig {
  const viewConfig = rootConfig.views?.month ?? {};
  const defaults = getDefaults();

  return {
    maxEventsPerSlot:
      viewConfig.maxEventsPerSlot ??
      rootConfig.config?.maxEventsPerSlot ??
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
