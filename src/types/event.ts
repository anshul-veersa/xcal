export type EventID = number | string | bigint;

/**
 *  Must haves for any kind of event
 */
export type BaseEvent = {
  id: EventID;
  priority?: number;
  recurrencePattern?: string;
  startsAt: Date;
  endsAt: Date;
};

/**
 * Primary kind of events that are shown as tiles
 */
export type TileEvent<EventData = unknown> = {
  /** User data for the event */
  data?: EventData;
  config?: {
    isDraggable: boolean;
    isResizable: boolean;
  };
} & BaseEvent;

/**
 * Secondary kind of events that are shown in the background
 */
export type BackgroundEvent<EventData = unknown> = {
  /**
   * User data for the event
   */
  data?: EventData;
  priority: number;
} & BaseEvent;

/**
 * Base tile, varies across views
 */
export type BaseEventTile<Event extends TileEvent> = {
  id: number;
  /**
   * Specifies if the tile is continuing from start and/or end slots when it is clamped
   */
  continuous: { start: boolean; end: boolean };
  event: Event;
};
