import type { DayViewEventTileData } from "@/components/views/day/types";
import type { View } from "./config";
import type { BaseEvent } from "./event";

type RenderFunction<T = unknown> = (props: T) => React.ReactNode;

type ViewSpecificEventTileData<ForView extends View, TileData> = {
  view: ForView;
  tile: TileData;
};

export type EventTileRenderFunction<CalendarEvent extends BaseEvent> =
  RenderFunction<
    | ViewSpecificEventTileData<"day", DayViewEventTileData<CalendarEvent>>
    | ViewSpecificEventTileData<"week", DayViewEventTileData<CalendarEvent>>
    | ViewSpecificEventTileData<"group", DayViewEventTileData<CalendarEvent>>
    | ViewSpecificEventTileData<"month", DayViewEventTileData<CalendarEvent>>
  >;

type ViewSpecificHeaderItemData<ForView extends View, Data> = {
  view: ForView;
  data: Data;
};

export type HeaderItemRenderFunction = RenderFunction<
  | ViewSpecificHeaderItemData<"day", number>
  | ViewSpecificHeaderItemData<"week", string>
  | ViewSpecificHeaderItemData<"group", boolean>
  | ViewSpecificHeaderItemData<"month", object>
>;

type ViewSpecificTimeSlotData<ForView extends View, TimeSlotData> = {
  view: ForView;
  slot: TimeSlotData;
};

export type TimeSlotRenderFunction = RenderFunction<
  | ViewSpecificTimeSlotData<"day", unknown>
  | ViewSpecificTimeSlotData<"week", unknown>
  | ViewSpecificTimeSlotData<"group", unknown>
  | ViewSpecificTimeSlotData<"month", unknown>
>;
