import type {
  DayViewEventTileData,
  DayViewHeaderItem,
  DayViewTimeSlot,
} from "@/components/views/day/types";
import type { View } from "./data";
import type { BaseEvent } from "./event";
import type { WeekViewEventTileData } from "@/components/views/week/types";
import type { GroupViewTileEventData } from "@/components/views/group/types";
import type { MonthViewTileEventData } from "@/components/views/month/types";

export type RenderFunction<T = unknown> = (props: T) => React.ReactNode;

type ViewSpecificEventTileData<ForView extends View, TileData> = {
  view: ForView;
  tile: TileData;
};

export type EventTileRenderFunction<TileEvent extends BaseEvent> =
  RenderFunction<
    | ViewSpecificEventTileData<"day", DayViewEventTileData<TileEvent>>
    | ViewSpecificEventTileData<"week", WeekViewEventTileData<TileEvent>>
    | ViewSpecificEventTileData<"group", GroupViewTileEventData<TileEvent>>
    | ViewSpecificEventTileData<"month", MonthViewTileEventData<TileEvent>>
  >;

type ViewSpecificHeaderItemData<ForView extends View, Data> = {
  view: ForView;
  data: Data;
};

export type HeaderItemRenderFunction = RenderFunction<
  | ViewSpecificHeaderItemData<"day", DayViewHeaderItem>
  | ViewSpecificHeaderItemData<"week", unknown>
  | ViewSpecificHeaderItemData<"group", unknown>
  | ViewSpecificHeaderItemData<"month", unknown>
>;

type ViewSpecificTimeSlotData<ForView extends View, TimeSlotData> = {
  view: ForView;
  slot: TimeSlotData;
};

export type TimeSlotRenderFunction<BackgroundEventData> = RenderFunction<
  | ViewSpecificTimeSlotData<"day", DayViewTimeSlot<BackgroundEventData>>
  | ViewSpecificTimeSlotData<"week", unknown>
  | ViewSpecificTimeSlotData<"group", unknown>
  | ViewSpecificTimeSlotData<"month", unknown>
>;

export type DataAttributes = Record<string, unknown>;
