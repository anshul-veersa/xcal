import type { DayViewEventTileData } from "@/components/views/day/types";
import type { View } from "./config";
import type { BaseEvent } from "./event";
import type { WeekViewEventTileData } from "@/components/views/week/types";
import type { GroupViewTileEventData } from "@/components/views/group/types";
import type { MonthViewTileEventData } from "@/components/views/month/types";

type RenderFunction<T = unknown> = (props: T) => React.ReactNode;

type ViewSpecificEventTileData<ForView extends View, TileData> = {
  view: ForView;
  tile: TileData;
};

export type EventTileRenderFunction<CalendarEvent extends BaseEvent> =
  RenderFunction<
    | ViewSpecificEventTileData<"day", DayViewEventTileData<CalendarEvent>>
    | ViewSpecificEventTileData<"week", WeekViewEventTileData<CalendarEvent>>
    | ViewSpecificEventTileData<"group", GroupViewTileEventData<CalendarEvent>>
    | ViewSpecificEventTileData<"month", MonthViewTileEventData<CalendarEvent>>
  >;

type ViewSpecificHeaderItemData<ForView extends View, Data> = {
  view: ForView;
  data: Data;
};

export type HeaderItemRenderFunction = RenderFunction<
  | ViewSpecificHeaderItemData<"day", unknown>
  | ViewSpecificHeaderItemData<"week", unknown>
  | ViewSpecificHeaderItemData<"group", unknown>
  | ViewSpecificHeaderItemData<"month", unknown>
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
