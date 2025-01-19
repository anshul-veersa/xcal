import type { LocaleOptions, RootConfig } from "@/types";
import type { DayViewConfig } from "./types";
import * as dfn from "@/core/temporal";

export const getConfigAdapter =
  (locale: LocaleOptions) =>
  (rootConfig: RootConfig): DayViewConfig => {
    const viewConfig = rootConfig.views?.day ?? {};

    const defaults = getDefaults(locale);

    return {
      maxEventsPerSlot:
        viewConfig.maxEventsPerSlot ??
        rootConfig.config?.maxEventsPerSlot ??
        defaults.maxEventsPerSlot,
      initialTimeAtTop:
        viewConfig.initialTimeAtTop ??
        rootConfig.config?.initialTimeAtTop ??
        defaults.initialTimeAtTop,
      showAllDaySlot:
        viewConfig.showAllDaySlot ??
        rootConfig.config?.showAllDaySlot ??
        defaults.showAllDaySlot,
      showCurrentTimeMarker:
        viewConfig.showCurrentTimeMarker ??
        rootConfig.config?.showCurrentTimeMarker ??
        defaults.showCurrentTimeMarker,
      showSlotIndicators:
        viewConfig.showSlotIndicators ??
        rootConfig.config?.showSlotIndicators ??
        defaults.showSlotIndicators,
      showSlotSeparator:
        viewConfig.showSlotSeparator ??
        rootConfig.config?.showSlotSeparator ??
        defaults.showSlotSeparator,
      slotDuration:
        viewConfig.slotDuration ??
        rootConfig.config?.slotDuration ??
        defaults.slotDuration,
      slotHeight:
        viewConfig.slotHeight ??
        rootConfig.config?.slotHeight ??
        defaults.slotHeight,
      dayRange: viewConfig.dayRange ?? defaults.dayRange,
      useTimeZonedEvents:
        viewConfig.useTimeZonedEvents ?? defaults.useTimeZonedEvents,
    };
  };

const getDefaults = (locale: LocaleOptions): DayViewConfig => {
  return {
    maxEventsPerSlot: 30,
    initialTimeAtTop: dfn.now(locale),
    showAllDaySlot: true,
    showCurrentTimeMarker: true,
    showSlotIndicators: false,
    showSlotSeparator: false,
    slotDuration: 30,
    slotHeight: "32px",
    useTimeZonedEvents: false,
    dayRange: {
      start: dfn.startOfDay(dfn.today(locale), locale),
      end: dfn.endOfDay(dfn.today(locale), locale),
    },
  };
};
