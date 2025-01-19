import type { Tile } from "@/core/tilers/time-grid-tiler";
import type { BackgroundEvent, TileEvent, ConfigOptions } from "@/types";

export type GroupViewTileEvent<Event extends TileEvent> = {} & Tile<Event>;

export type GroupId = string | number;
export type Group<EventData = unknown, BackgroundEventData = unknown> = {
  id: GroupId;
  events: ({ type: "tile" } & TileEvent<EventData>)[];
  backgroundEvents: ({
    type: "background";
  } & BackgroundEvent<BackgroundEventData>)[];
};

export type GroupViewConfig = {
  /**
   * A key selector function to group events with same keys.
   * Return a group id to allot the given event to that group.
   * @example Grouping events by organizer
   */
  groupSelector: (event: TileEvent | BackgroundEvent) => GroupId;
  /**
   * Groups formed using `groupSelector` key function needs an order
   * Therefore `groupOrderer` receives all the groups formed
   * and the groups returned are used in the same order.
   */
  groupOrderer: (groups: Group[]) => Group[];
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

export type GroupViewTimeSlot<BackgroundEventData> = {
  startTime: Date;
  endTime: Date;
  backgroundEvents: BackgroundEvent<BackgroundEventData>[];
};

export type GroupViewHeaderItem = {
  date: Date;
  group: Group;
};
