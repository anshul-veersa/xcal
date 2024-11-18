import type { Tile } from "@/core/tilers/day-tiler";
import type {
  BackgroundEvent,
  ConfigOptions,
  DataAttributes,
  EventUpdateCallback,
  RenderFunction,
  SlotClickCallback,
  TileEvent,
} from "@/types";

export type Column<HeaderData> = {
  id: number | string;
  date: Date;
  header: { data: HeaderData; attributes?: DataAttributes };
  events: Array<TileEvent>;
  backgroundEvents: Array<BackgroundEvent>;
  attributes?: DataAttributes;
};

export type TimeSlot = {
  id: number;
  startTime: Date;
  endTime: Date;
  backgroundEvents: BackgroundEvent[];
};

export interface ColumnGridProps<HeaderData> {
  activeDate: Date;
  config: Pick<
    ConfigOptions,
    | "slotDuration"
    | "slotHeight"
    | "maxEventsPerSlot"
    | "showSlotSeparator"
    | "showSlotIndicators"
    | "showCurrentTimeMarker"
    | "showAllDaySlot"
    | "hourIndicatorLabelFormat"
    | "scrollTimeIntoView"
  >;
  columns: Array<Column<HeaderData>>;
  renderHeaderItem: RenderFunction<HeaderData>;
  renderTimeSlot: RenderFunction<TimeSlot>;
  renderEventTile: RenderFunction<Tile<TileEvent>>;
  renderCorner?: RenderFunction;
  onEventUpdate?: EventUpdateCallback<unknown>;
  onSlotClick?: SlotClickCallback;
}
