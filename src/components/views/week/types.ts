import type { Tile } from "@/core/tilers/day-tiler";
import type { BackgroundEvent, ConfigOptions, TileEvent } from "@/types";

export type WeekViewEventTile<Event extends TileEvent> = {} & Tile<Event>;

type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type WeekViewConfig = {
  showDays: Weekday[];
} & Pick<
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

export type WeekViewHeaderItem = {
  date: Date;
};

export type WeekViewTimeSlot<BackgroundEventData> = {
  startTime: Date;
  endTime: Date;
  backgroundEvents: BackgroundEvent<BackgroundEventData>[];
};
