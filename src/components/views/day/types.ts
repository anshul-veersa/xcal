import type { Tile } from "@/core/tilers/day-tiler";
import type { BackgroundEvent, BaseEvent, ConfigOptions } from "@/types";

export type DayViewEventTileData<Event extends BaseEvent> = {} & Tile<Event>;

export type DayViewConfig = {} & Pick<
  ConfigOptions,
  | "slotDuration"
  | "maxEventsPerSlot"
  | "showCurrentTimeMarker"
  | "showAllDaySlot"
  | "showSlotIndicators"
  | "showSlotSeparator"
  | "scrollTimeIntoView"
  | "hourIndicatorLabelFormat"
  | "slotHeight"
>;

export type DayViewHeaderItem = {
  date: Date;
};

export type DayViewTimeSlot<BackgroundEventData> = {
  startTime: Date;
  endTime: Date;
  backgroundEvents: BackgroundEvent<BackgroundEventData>[];
};
