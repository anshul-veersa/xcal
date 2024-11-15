import type { Tile } from "@/core/tilers";
import type {
  BackgroundEvent,
  BaseEvent,
  CalendarEvent,
  ConfigOptions,
} from "@/types";

export type GroupViewTileEventData<Event extends BaseEvent> = {} & Tile<Event>;

export type GroupId = string | number;
export type Group<EventData, BackgroundEventData> = {
  id: GroupId;
  events: CalendarEvent<EventData>[];
  backgroundEvents?: BackgroundEvent<BackgroundEventData>[];
};

export type GroupViewConfig<T, B> = {
  groupSelector: (event: CalendarEvent<T> | BackgroundEvent<B>) => GroupId;
  groupOrderer: (groups: Group<T, B>[]) => Group<T, B>[];
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
