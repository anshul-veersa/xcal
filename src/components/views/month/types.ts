import type { Tile } from "@/core/tilers/day-grid-tiler";
import type { BackgroundEvent, ConfigOptions, TileEvent } from "@/types";

export type MonthViewTileEvent<Event extends TileEvent> = {} & Tile<Event>;

export type MonthViewConfig = {
  /**
   * Shows the month dates from sibling or adjacent months.
   * @default true
   */
  showSiblingMonthDates: boolean;
  /**
   * Shows the week's number for each week row on the left column.
   * @default true
   */
  showWeekNumber: boolean;
} & Pick<ConfigOptions, "maxEventsPerSlot">;

export type MonthViewHeaderItem = {
  weekDate: Date;
};

export type MonthViewTimeSlot<BackgroundEventData> = {
  date: Date;
  backgroundEvents: BackgroundEvent<BackgroundEventData>[];
};
