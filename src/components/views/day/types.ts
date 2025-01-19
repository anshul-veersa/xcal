import type { Tile } from "@/core/tilers/time-grid-tiler";
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
  | "initialTimeAtTop"
  | "slotHeight"
  | "useTimeZonedEvents"
  | "dayRange"
>;

export type DayViewHeaderItem = {
  date: Date;
};

export type DayViewTimeSlot<BackgroundEventData> = {
  startTime: Date;
  endTime: Date;
  backgroundEvents: BackgroundEvent<BackgroundEventData>[];
};
