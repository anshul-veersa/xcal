import type { TileEvent } from "./event";
import type { View } from "./data";
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

/**
 * Generic render function
 */
export type RenderFunction<T> = (props: T) => React.ReactNode;

/**
 * Helper type to create a view specific data type
 * to be used in RenderFunction
 */
type ViewSpecificData<ForView extends View, Data> = {
  view: ForView;
  data: Data;
};

/**
 * Props passed to a tile rendering function.
 * Each view has its own type can be accessed using discriminated union check.
 */
type EventTileRenderFunctionProps<E extends TileEvent> =
  | ViewSpecificData<"day", DayViewEventTile<E>>
  | ViewSpecificData<"week", WeekViewEventTile<E>>
  | ViewSpecificData<"group", GroupViewTileEvent<E>>
  | ViewSpecificData<"month", MonthViewTileEvent<E>>;

export type EventTileRenderFunction<Event extends TileEvent> = RenderFunction<
  EventTileRenderFunctionProps<Event>
>;

/**
 * Props passed to a view header rendering function.
 * Each view has its own type can be accessed using discriminated union check.
 */
type HeaderItemRenderFunctionProps =
  | ViewSpecificData<"day", DayViewHeaderItem>
  | ViewSpecificData<"week", WeekViewHeaderItem>
  | ViewSpecificData<"group", GroupViewHeaderItem>
  | ViewSpecificData<"month", MonthViewHeaderItem>;

export type HeaderItemRenderFunction =
  RenderFunction<HeaderItemRenderFunctionProps>;

/**
 * Props passed to a time slot rendering function.
 * Each view has its own type can be accessed using discriminated union check.
 */
type TimeSlotRenderFunctionProps<BE> =
  | ViewSpecificData<"day", DayViewTimeSlot<BE>>
  | ViewSpecificData<"week", WeekViewTimeSlot<BE>>
  | ViewSpecificData<"group", GroupViewTimeSlot<BE>>
  | ViewSpecificData<"month", MonthViewTimeSlot<BE>>;

export type TimeSlotRenderFunction<BackgroundEventData = unknown> =
  RenderFunction<TimeSlotRenderFunctionProps<BackgroundEventData>>;

export type TimeGridCornerRenderFunction = RenderFunction<undefined>;

/**
 * Collection of render functions for different parts of the Calendar
 */
export type RenderFunctions<
  EventData = unknown,
  BackgroundEventData = unknown
> = {
  renderEventTile: EventTileRenderFunction<TileEvent<EventData>>;
  renderHeaderItem?: HeaderItemRenderFunction;
  renderTimeSlot?: TimeSlotRenderFunction<BackgroundEventData>;
  renderTimeGridCorner?: TimeGridCornerRenderFunction;
};
