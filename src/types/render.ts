import type {
  DayViewEventTile,
  DayViewHeaderItem,
  DayViewTimeSlot,
} from "@/components/views/day/types";
import type {
  WeekViewEventTile,
  WeekViewHeaderItem,
  WeekViewTimeSlot,
} from "@/components/views/week/types";
import type {
  GroupViewTileEvent,
  GroupViewHeaderItem,
  GroupViewTimeSlot,
} from "@/components/views/group/types";
import type {
  MonthViewTileEvent,
  MonthViewHeaderItem,
  MonthViewTimeSlot,
} from "@/components/views/month/types";
import type { View } from "./data";
import type { TileEvent } from "./event";

export type RenderFunction<T = unknown> = (props: T) => React.ReactNode;

type ViewSpecificEventTile<ForView extends View, TileData> = {
  view: ForView;
  tile: TileData;
};

export type EventTileRenderFunction<Event extends TileEvent> = RenderFunction<
  | ViewSpecificEventTile<"day", DayViewEventTile<Event>>
  | ViewSpecificEventTile<"week", WeekViewEventTile<Event>>
  | ViewSpecificEventTile<"group", GroupViewTileEvent<Event>>
  | ViewSpecificEventTile<"month", MonthViewTileEvent<Event>>
>;

type ViewSpecificHeaderItem<ForView extends View, Data> = {
  view: ForView;
  data: Data;
};

export type HeaderItemRenderFunction = RenderFunction<
  | ViewSpecificHeaderItem<"day", DayViewHeaderItem>
  | ViewSpecificHeaderItem<"week", WeekViewHeaderItem>
  | ViewSpecificHeaderItem<"group", GroupViewHeaderItem>
  | ViewSpecificHeaderItem<"month", MonthViewHeaderItem>
>;

type ViewSpecificTimeSlot<ForView extends View, TimeSlotData> = {
  view: ForView;
  slot: TimeSlotData;
};

export type TimeSlotRenderFunction<BackgroundEventData = unknown> =
  RenderFunction<
    | ViewSpecificTimeSlot<"day", DayViewTimeSlot<BackgroundEventData>>
    | ViewSpecificTimeSlot<"week", WeekViewTimeSlot<BackgroundEventData>>
    | ViewSpecificTimeSlot<"group", GroupViewTimeSlot<BackgroundEventData>>
    | ViewSpecificTimeSlot<"month", MonthViewTimeSlot<BackgroundEventData>>
  >;

export type DataAttributes = Record<string, unknown>;
