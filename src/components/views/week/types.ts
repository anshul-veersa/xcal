import type { Tile } from "@/core/tilers/day-tiler";
import type { ConfigOptions, TileEvent } from "@/types";

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
