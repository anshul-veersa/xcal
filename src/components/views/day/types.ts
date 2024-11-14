import type { Tile } from "@/core/tilers";
import type { BaseEvent } from "@/types";

export type DayViewEventTileData<Event extends BaseEvent> = {} & Tile<Event>;
