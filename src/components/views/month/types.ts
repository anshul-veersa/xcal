import type { Tile } from "@/core/tilers/month-tiler";
import type { BaseEvent, ConfigOptions } from "@/types";

export type MonthViewTileEventData<Event extends BaseEvent> = {} & Tile<Event>;

export type MonthViewConfig = {
  showSiblingMonthDatesEvents: boolean;
} & Pick<ConfigOptions, "maxEventsPerSlot">;
