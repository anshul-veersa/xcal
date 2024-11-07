import type { BackgroundEvent, CalendarEvent } from "./event";

export type CalendarData<EventData, BackgroundEventData> = {
  events: CalendarEvent<EventData>[];
  backgroundEvents: BackgroundEvent<BackgroundEventData>[];
  date: Date;
};
