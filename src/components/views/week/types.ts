import type { Tile } from "@/core/tilers";
import type { BaseEvent, ConfigOptions } from "@/types";

export type WeekViewEventTileData<Event extends BaseEvent> = {} & Tile<Event>;

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
