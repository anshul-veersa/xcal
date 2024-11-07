import type { SlotDuration, XCalConfig } from "@/types";

export type DayViewConfig = {
  slotDuration: SlotDuration;
  maxEventsPerSlot: number;
  showCurrentTimeMarker: boolean;
  showAllDaySlot: boolean;
  showSlotIndicators: boolean;
  showSlotSeparator: boolean;
  scrollTimeIntoView: Date;
  hourIndicatorLabelFormat: string;
  slotHeight: number;
};

export function adaptConfig<T, B>(xCalConfig: XCalConfig<T, B>): DayViewConfig {
  const viewConfig = xCalConfig.views?.day ?? {};

  return {
    hourIndicatorLabelFormat:
      viewConfig.hourIndicatorLabelFormat ??
      xCalConfig.config.hourIndicatorLabelFormat ??
      defaults.hourIndicatorLabelFormat,
    maxEventsPerSlot:
      viewConfig.maxEventsPerSlot ??
      xCalConfig.config.maxEventsPerSlot ??
      defaults.maxEventsPerSlot,
    scrollTimeIntoView:
      viewConfig.scrollTimeIntoView ??
      xCalConfig.config.scrollTimeIntoView ??
      defaults.scrollTimeIntoView,
    showAllDaySlot:
      viewConfig.showAllDaySlot ??
      xCalConfig.config.showAllDaySlot ??
      defaults.showAllDaySlot,
    showCurrentTimeMarker:
      viewConfig.showCurrentTimeMarker ??
      xCalConfig.config.showCurrentTimeMarker ??
      defaults.showCurrentTimeMarker,
    showSlotIndicators:
      viewConfig.showSlotIndicators ??
      xCalConfig.config.showSlotIndicators ??
      defaults.showSlotIndicators,
    showSlotSeparator:
      viewConfig.showSlotSeparator ??
      xCalConfig.config.showSlotSeparator ??
      defaults.showSlotSeparator,
    slotDuration:
      viewConfig.slotDuration ??
      xCalConfig.config.slotDuration ??
      defaults.slotDuration,
    slotHeight:
      viewConfig.slotHeight ??
      xCalConfig.config.slotHeight ??
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
