import type { Tile } from "@/core/tilers/day-tiler";
import type { BackgroundEvent, ConfigOptions, TileEvent } from "@/types";

export type DayViewEventTile<Event extends TileEvent> = {} & Tile<Event>;

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
