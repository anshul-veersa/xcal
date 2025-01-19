import type { Views } from "@/components/views";
import type { BackgroundEvent, TileEvent } from "./event";

/**
 * Type of calendar view
 */
export type View = keyof typeof Views;

/**
 * Expected user data for the calendar to work.
 */
export type CalendarData<EventData, BackgroundEventData> = {
  /**
   * Current view date to show on calendar.
   */
  date: Date;
  /**
   * Current view to show on calendar.
   */
  view: View;
  /**
   * An array of events to render as tiles.
   * Use `renderEventTile` render function to display event tile
   * according to your preference.
   */
  events: TileEvent<EventData>[];
  /**
   * An array of events to render as background slot events.
   * Limits to only one event per time slot.
   * Use `renderTimeSlot` render function to display background event
   * for given time slot according to your preference.
   */
  backgroundEvents: BackgroundEvent<BackgroundEventData>[];
};
