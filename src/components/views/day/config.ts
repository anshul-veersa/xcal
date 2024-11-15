import type { RootConfig } from "@/types";
import type { DayViewConfig } from "./types";

export function adaptConfig<T, B>(xCalConfig: RootConfig<T, B>): DayViewConfig {
  const viewConfig = xCalConfig.views?.day ?? {};

  return {
    hourIndicatorLabelFormat:
      viewConfig.hourIndicatorLabelFormat ??
      xCalConfig.common?.hourIndicatorLabelFormat ??
      defaults.hourIndicatorLabelFormat,
    maxEventsPerSlot:
      viewConfig.maxEventsPerSlot ??
      xCalConfig.common?.maxEventsPerSlot ??
      defaults.maxEventsPerSlot,
    scrollTimeIntoView:
      viewConfig.scrollTimeIntoView ??
      xCalConfig.common?.scrollTimeIntoView ??
      defaults.scrollTimeIntoView,
    showAllDaySlot:
      viewConfig.showAllDaySlot ??
      xCalConfig.common?.showAllDaySlot ??
      defaults.showAllDaySlot,
    showCurrentTimeMarker:
      viewConfig.showCurrentTimeMarker ??
      xCalConfig.common?.showCurrentTimeMarker ??
      defaults.showCurrentTimeMarker,
    showSlotIndicators:
      viewConfig.showSlotIndicators ??
      xCalConfig.common?.showSlotIndicators ??
      defaults.showSlotIndicators,
    showSlotSeparator:
      viewConfig.showSlotSeparator ??
      xCalConfig.common?.showSlotSeparator ??
      defaults.showSlotSeparator,
    slotDuration:
      viewConfig.slotDuration ??
      xCalConfig.common?.slotDuration ??
      defaults.slotDuration,
    slotHeight:
      viewConfig.slotHeight ??
      xCalConfig.common?.slotHeight ??
      defaults.slotHeight,
  };
}

const defaults: DayViewConfig = {
  hourIndicatorLabelFormat: "hh:mm",
  maxEventsPerSlot: 30,
  scrollTimeIntoView: new Date(),
  showAllDaySlot: true,
  showCurrentTimeMarker: true,
  showSlotIndicators: false,
  showSlotSeparator: false,
  slotDuration: 30,
  slotHeight: 32,
};
