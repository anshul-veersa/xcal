import type { Tile } from "@/core/tilers";
import type { BaseEvent, ConfigOptions } from "@/types";

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
