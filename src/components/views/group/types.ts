import type { Tile } from "@/core/tilers/day-tiler";
import type {
  BackgroundEvent,
  BaseEvent,
  TileEvent,
  ConfigOptions,
} from "@/types";

export type GroupViewTileEventData<Event extends BaseEvent> = {} & Tile<Event>;

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
