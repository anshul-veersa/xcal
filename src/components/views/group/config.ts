import type {
  BackgroundEvent,
  CalendarEvent,
  SlotDuration,
  XCalConfig,
} from "@/types";

export type GroupId = string | number;
export type Group<EventData, BackgroundEventData> = {
  id: GroupId;
  events: CalendarEvent<EventData>[];
  backgroundEvents?: BackgroundEvent<BackgroundEventData>[];
};

export type GroupViewConfig<T, B> = {
  slotDuration: SlotDuration;
  maxEventsPerSlot: number;
  showCurrentTimeMarker: boolean;
  showAllDaySlot: boolean;
  showSlotIndicators: boolean;
  showSlotSeparator: boolean;
  scrollTimeIntoView: Date;
  hourIndicatorLabelFormat: string;
  slotHeight: number;
  groupSelector: (event: CalendarEvent<T> | BackgroundEvent<B>) => GroupId;
  groupOrderer: (groups: Group<T, B>[]) => Group<T, B>[];
};

export function adaptConfig<T, B>(
  xCalConfig: XCalConfig<T, B>
): GroupViewConfig<T, B> {
  const viewConfig = xCalConfig.views?.group ?? {};

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
    groupSelector: viewConfig.groupSelector ?? defaults.groupSelector,
    groupOrderer: viewConfig.groupOrderer ?? defaults.groupOrderer,
  };
}

const defaults: GroupViewConfig<unknown, unknown> = {
  hourIndicatorLabelFormat: "hh:mm",
  maxEventsPerSlot: 30,
  scrollTimeIntoView: new Date(),
  showAllDaySlot: true,
  showCurrentTimeMarker: true,
  showSlotIndicators: false,
  showSlotSeparator: false,
  slotDuration: 30,
  slotHeight: 32,
  groupSelector: () => "default",
  groupOrderer: (groups) => groups,
};
