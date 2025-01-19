import type { WeekDay } from "@/core/temporal";
import type { Tile } from "@/core/tilers/time-grid-tiler";
import type { BackgroundEvent, ConfigOptions, TileEvent } from "@/types";

export type WeekViewEventTile<Event extends TileEvent> = {} & Tile<Event>;

export type WeekViewConfig = {
  /**
   * Days to show on the calendar as columns in week view.
   * @default all
   */
  showDays: WeekDay[];
} & Pick<
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

export type WeekViewHeaderItem = {
  date: Date;
};

export type WeekViewTimeSlot<BackgroundEventData> = {
  startTime: Date;
  endTime: Date;
  backgroundEvents: BackgroundEvent<BackgroundEventData>[];
};
