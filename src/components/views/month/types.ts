import type { Tile } from "@/core/tilers/month-tiler";
import type { ConfigOptions, TileEvent } from "@/types";

export type MonthViewTileEvent<Event extends TileEvent> = {} & Tile<Event>;

export type MonthViewConfig = {
  showSiblingMonthDatesEvents: boolean;
} & Pick<ConfigOptions, "maxEventsPerSlot">;
