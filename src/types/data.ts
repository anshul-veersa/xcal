import type { View } from "./config";
import type { BackgroundEvent, CalendarEvent } from "./event";

export type CalendarData<EventData, BackgroundEventData> = {
  /** Current date to show on calendar view. */
  date: Date;
  /** Current view to show on calendar. */
  view: View;
  /** An array of events to render as tiles.
   * Use `renderEventTile` render callback to display event tile
   * according to your preference.
   */
  events: CalendarEvent<EventData>[];
  /** An array of events to render as background slot events.
   * Limits to only one event per time slot.
   * Use `renderTimeSlot` render callback to display background event
   * for given time slot according to your preference. */
  backgroundEvents: BackgroundEvent<BackgroundEventData>[];
};
