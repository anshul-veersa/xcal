export type EventID = number | string | bigint | symbol;

/**
 *  Base properties for any kind of event
 */
export type BaseEvent<Data = unknown> = {
  id: EventID;
  /**
   * Priority is used to sort the events.
   * In case two events happen at the same time,
   * the one with higher priority (or lower number value) will be considered first.
   * @default 0
   */
  priority?: number;
  /**
   * User data for the event.
   */
  data: Data;
  /**
   * Start time of the event.
   */
  startsAt: Date;
  /**
   * End time of the event.
   */
  endsAt: Date;
  /**
   * iCalendar RFC 5545 compatible recurrence pattern string.
   */
  recurrencePattern?: string;
  /**
   * Represents the timeZone in which the event is occurring. \
   * Used with calendar config option `useTimeZonedEvents` to view the events in their specified timeZone.
   */
  timeZone?: string;
};

/**
 * Primary kind of events that are shown as tiles
 */
export type TileEvent<EventData = unknown> = {
  config?: {
    /**
     * Allows the tile to be dragged and dropped to any other slot.
     */
    isDraggable: boolean;
    /**
     * Allows the tile to be resizable using handles on the edges.
     */
    isResizable: boolean;
  };
} & BaseEvent<EventData>;

/**
 * Secondary kind of events that are shown in the background,
 * one per time slot
 */
export type BackgroundEvent<EventData = unknown> = {
  data?: EventData;
  priority: number;
} & BaseEvent<EventData>;

/**
 * Base tile, varies across views
 */
export type BaseEventTile<Event extends TileEvent> = {
  id: number;
  /**
   * Specifies if the tile is continuing from start and/or end slots
   * when it is clamped inside the view
   */
  continuous: { start: boolean; end: boolean };
  /**
   * Event represented by the Tile
   */
  event: Event;
};
