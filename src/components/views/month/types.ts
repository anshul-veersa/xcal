import type { Tile } from "@/core/tilers/month-tiler";
import type { BackgroundEvent, ConfigOptions, TileEvent } from "@/types";

export type MonthViewTileEvent<Event extends TileEvent> = {} & Tile<Event>;

export type MonthViewConfig = {
  showSiblingMonthDatesEvents: boolean;
} & Pick<ConfigOptions, "maxEventsPerSlot">;

export type MonthViewHeaderItem = {};

export type MonthViewTimeSlot<BackgroundEventData> = {
  date: Date;
  backgroundEvents: BackgroundEvent<BackgroundEventData>[];
};
