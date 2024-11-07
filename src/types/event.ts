export type EventID = number | string | bigint;

/** Must haves for any kind of event */
export type BaseEvent = {
  id: EventID;
  priority?: number;
  recurrencePattern?: string;
  startsAt: Date;
  endsAt: Date;
};

/** Primary kind of events that are shown as tiles */
export type CalendarEvent<EventData = unknown> = {
  type: "tile";
  data: EventData;
  config?: {
    isDraggable: boolean;
    isResizable: boolean;
  };
} & BaseEvent;

/** Secondary kind of events that are shown in the background */
export type BackgroundEvent<EventData = unknown> = {
  type: "background";
  data: EventData;
  priority: number;
} & BaseEvent;

/** Base tile, varies across views */
export type BaseEventTile<TileEvent extends BaseEvent> = {
  id: number;
  /** Specifies if the tile is continuing from start and/or end when it is clamped */
  continuous: { start: boolean; end: boolean };
  event: TileEvent;
};
