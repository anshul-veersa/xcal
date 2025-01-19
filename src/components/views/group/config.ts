import type { LocaleOptions, RootConfig } from "@/types";
import type { GroupViewConfig } from "./types";
import * as dfn from "@/core/temporal";

export const getConfigAdapter =
  (locale: LocaleOptions) =>
  (xCalConfig: RootConfig): GroupViewConfig => {
    const viewConfig = xCalConfig.views?.group ?? {};
    const defaults = getDefaults(locale);

    return {
      maxEventsPerSlot:
        viewConfig.maxEventsPerSlot ??
        xCalConfig.config?.maxEventsPerSlot ??
        defaults.maxEventsPerSlot,
      initialTimeAtTop:
        viewConfig.initialTimeAtTop ??
        xCalConfig.config?.initialTimeAtTop ??
        defaults.initialTimeAtTop,
      showAllDaySlot:
        viewConfig.showAllDaySlot ??
        xCalConfig.config?.showAllDaySlot ??
        defaults.showAllDaySlot,
      showCurrentTimeMarker:
        viewConfig.showCurrentTimeMarker ??
        xCalConfig.config?.showCurrentTimeMarker ??
        defaults.showCurrentTimeMarker,
      showSlotIndicators:
        viewConfig.showSlotIndicators ??
        xCalConfig.config?.showSlotIndicators ??
        defaults.showSlotIndicators,
      showSlotSeparator:
        viewConfig.showSlotSeparator ??
        xCalConfig.config?.showSlotSeparator ??
        defaults.showSlotSeparator,
      slotDuration:
        viewConfig.slotDuration ??
        xCalConfig.config?.slotDuration ??
        defaults.slotDuration,
      slotHeight:
        viewConfig.slotHeight ??
        xCalConfig.config?.slotHeight ??
        defaults.slotHeight,
      dayRange: viewConfig.dayRange ?? defaults.dayRange,
      useTimeZonedEvents:
        viewConfig.useTimeZonedEvents ?? defaults.useTimeZonedEvents,
      groupSelector: viewConfig.groupSelector ?? defaults.groupSelector,
      groupOrderer: viewConfig.groupOrderer ?? defaults.groupOrderer,
    };
  };

const getDefaults = (locale: LocaleOptions): GroupViewConfig => {
  return {
    maxEventsPerSlot: 30,
    initialTimeAtTop: dfn.now(locale),
    showAllDaySlot: true,
    showCurrentTimeMarker: true,
    showSlotIndicators: false,
    showSlotSeparator: false,
    slotDuration: 30,
    slotHeight: "32px",
    dayRange: {
      start: dfn.startOfDay(dfn.today(locale), locale),
      end: dfn.endOfDay(dfn.today(locale), locale),
    },
    groupSelector: () => "default",
    groupOrderer: (groups) => groups,
    useTimeZonedEvents: false,
  };
};
