import type { SlotDuration, XCalConfig } from "@/types";

type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type WeekViewConfig = {
  slotDuration: SlotDuration;
  maxEventsPerSlot: number;
  showCurrentTimeMarker: boolean;
  showAllDaySlot: boolean;
  showSlotIndicators: boolean;
  showSlotSeparator: boolean;
  scrollTimeIntoView: Date;
  hourIndicatorLabelFormat: string;
  slotHeight: number;
  showDays: Weekday[];
};

export function adaptConfig<T, B>(
  xCalConfig: XCalConfig<T, B>
): WeekViewConfig {
  const viewConfig = xCalConfig.views?.week ?? {};

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
    showDays: viewConfig.showDays ?? defaults.showDays,
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

const defaults: WeekViewConfig = {
  hourIndicatorLabelFormat: "hh:mm",
  maxEventsPerSlot: 30,
  scrollTimeIntoView: new Date(),
  showAllDaySlot: true,
  showCurrentTimeMarker: true,
  showDays: [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ],
  showSlotIndicators: false,
  showSlotSeparator: false,
  slotDuration: 30,
  slotHeight: 32,
};
