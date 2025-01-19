import type { Tile } from "@/core/tilers/time-grid-tiler";
import type {
  BackgroundEvent,
  ConfigOptions,
  LocaleOptions,
  RenderFunction,
  TileEvent,
  TimeRange,
} from "@/types";

type DataAttributes = Record<string, unknown>;

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

export interface TimeGridProps<HeaderData> {
  locale: LocaleOptions;
  config: Pick<
    ConfigOptions,
    | "slotDuration"
    | "slotHeight"
    | "maxEventsPerSlot"
    | "showSlotSeparator"
    | "showSlotIndicators"
    | "showCurrentTimeMarker"
    | "showAllDaySlot"
    | "initialTimeAtTop"
    | "useTimeZonedEvents"
  > & { dayRange: TimeRange };
  columns: Array<Column<HeaderData>>;
  renderHeaderItem: RenderFunction<HeaderData>;
  renderTimeSlot: RenderFunction<TimeSlot>;
  renderEventTile: RenderFunction<Tile<TileEvent>>;
  renderCorner?: RenderFunction<undefined>;
}
