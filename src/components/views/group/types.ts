import type { Tile } from "@/core/tilers/day-tiler";
import type { BackgroundEvent, TileEvent, ConfigOptions } from "@/types";

export type GroupViewTileEvent<Event extends TileEvent> = {} & Tile<Event>;

export type GroupId = string | number;
export type Group<EventData = unknown, BackgroundEventData = unknown> = {
  id: GroupId;
  events: TileEvent<EventData>[];
  backgroundEvents?: BackgroundEvent<BackgroundEventData>[];
};

export type GroupViewConfig = {
  groupSelector: (event: TileEvent | BackgroundEvent) => GroupId;
  groupOrderer: (groups: Group[]) => Group[];
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

export type GroupViewTimeSlot<BackgroundEventData> = {
  group: Group<unknown, BackgroundEventData>;
  startTime: Date;
  endTime: Date;
  backgroundEvents: BackgroundEvent<BackgroundEventData>[];
};
