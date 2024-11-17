import type { RootConfig } from "@/types";
import type { DayViewConfig } from "./types";

export function adaptConfig(rootConfig: RootConfig): DayViewConfig {
  const viewConfig = rootConfig.views?.day ?? {};

  return {
    hourIndicatorLabelFormat:
      viewConfig.hourIndicatorLabelFormat ??
      rootConfig.common?.hourIndicatorLabelFormat ??
      defaults.hourIndicatorLabelFormat,
    maxEventsPerSlot:
      viewConfig.maxEventsPerSlot ??
      rootConfig.common?.maxEventsPerSlot ??
      defaults.maxEventsPerSlot,
    scrollTimeIntoView:
      viewConfig.scrollTimeIntoView ??
      rootConfig.common?.scrollTimeIntoView ??
      defaults.scrollTimeIntoView,
    showAllDaySlot:
      viewConfig.showAllDaySlot ??
      rootConfig.common?.showAllDaySlot ??
      defaults.showAllDaySlot,
    showCurrentTimeMarker:
      viewConfig.showCurrentTimeMarker ??
      rootConfig.common?.showCurrentTimeMarker ??
      defaults.showCurrentTimeMarker,
    showSlotIndicators:
      viewConfig.showSlotIndicators ??
      rootConfig.common?.showSlotIndicators ??
      defaults.showSlotIndicators,
    showSlotSeparator:
      viewConfig.showSlotSeparator ??
      rootConfig.common?.showSlotSeparator ??
      defaults.showSlotSeparator,
    slotDuration:
      viewConfig.slotDuration ??
      rootConfig.common?.slotDuration ??
      defaults.slotDuration,
    slotHeight:
      viewConfig.slotHeight ??
      rootConfig.common?.slotHeight ??
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
