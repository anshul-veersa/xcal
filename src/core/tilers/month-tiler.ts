import type { TimeUtils } from "@/core/temporal";
import type { BaseEventTile, TileEvent } from "@/types";

export type Tile<Event extends TileEvent> = {
  /**
   * Positional and dimensional properties of the tile
   */
  geometry: {
    /**
     * x-axis offset of the tile start in a week row
     */
    xStart: number;
    /**
     * x-axis offset of the tile end in a week row
     */
    xEnd: number;
  };
} & BaseEventTile<Event>;

type TilerConfig = {
  /** Limit the maximum number of events that can appear in a single row */
  maxPerSlot: number;
};

export class MonthTiler<Event extends TileEvent> {
  constructor(
    private readonly config: TilerConfig,
    private readonly time: TimeUtils
  ) {}

  private getEventPriority(event: Event) {
    return this.time.differenceInCalendarDays(event.startsAt, event.endsAt);
  }

  getLayoutTiles(
    events: Event[],
    options: { range: { from: Date; to: Date } }
  ) {
    const { range } = options;

    const t = this.time;
    const calendarStartDate = range.from;
    const calendarEndDate = range.to;

    // Splits the recurring events into individual occurrences/events
    const eventOccurrences = events.flatMap((event) => {
      if (!event.recurrencePattern) return [event];
      const rrule = this.time.parseRecurrencePattern(event.recurrencePattern);
      const occurrences = rrule.between(range.from, range.to, true);
      return occurrences.map((occurrence) => ({
        ...event,
        startsAt: occurrence,
        endsAt: new Date(
          occurrence.getTime() +
            (new Date(event.endsAt).getTime() -
              new Date(event.startsAt).getTime())
        ),
      }));
    });

    // TODO: Consider out of range events
    /** Events filtered for visible range, sorted by their row placement priority. */
    const eventsInRange = eventOccurrences
      .filter((e) =>
        t.isBetween(e.startsAt, {
          start: range.from,
          end: range.to,
        })
      )
      .sort((e1, e2) => this.getEventPriority(e1) - this.getEventPriority(e2));

    /** A map of events keyed by their start date. */
    const eventsByDate: Record<string, Event[] | undefined> = {};
    eventsInRange.forEach((e) => {
      const date = t.format(e.startsAt, "yyyy-MM-dd");
      if (!eventsByDate[date]) eventsByDate[date] = [];
      eventsByDate[date]!.push(e);
    });

    const eventsTouchedByDate = {
      records: {} as Record<string, number | undefined>,
      get(date: string) {
        return this.records[date] ?? 0;
      },
      inc(date: string) {
        if (!this.records[date]) this.records[date] = 0;
        this.records[date]!++;
      },
    };

    /** Layout of events */
    const eventSeries: Record<string, { eventTiles: Tile<Event>[] }> =
      Object.fromEntries(
        t
          .eachWeekOfInterval({
            start: range.from,
            end: range.to,
          })
          .map((d) => [t.getWeek(d), { eventTiles: [] }])
      );

    let eventsTouched = 0;
    let currentDay = calendarStartDate;

    // Add this offset to properly calculate grid column span
    const gridOffset = 1;

    while (eventsTouched < eventsInRange.length) {
      // Move to next line, reiterate from first day
      if (t.isAfter(currentDay, range.to)) {
        currentDay = range.from;
        continue;
      }

      const dateStr = t.format(currentDay, "yyyy-MM-dd");

      const dayEventIndex = eventsTouchedByDate.get(dateStr);
      if (dayEventIndex >= this.config.maxPerSlot) {
        eventsTouched++;
        continue;
      }

      // Get the highest priority event for this day
      const currentEvent = eventsByDate[dateStr]?.[dayEventIndex];
      // No event was found for this day, move to next day
      if (!currentEvent) {
        currentDay = t.addDays(currentDay, 1);
        continue;
      }

      eventsTouchedByDate.inc(dateStr);

      let isContinuingFromLastWeek = false;
      while (t.isBefore(currentDay, calendarEndDate)) {
        // This event will continue after this week's end
        const willContinueAfterCurrentWeek = t.isAfter(
          currentEvent.endsAt,
          t.endOfWeek(currentDay)
        );

        const currentWeek = t.getWeek(currentDay);

        const tile: Tile<Event> = {
          id: 0,
          event: currentEvent,
          continuous: {
            start: isContinuingFromLastWeek,
            end: willContinueAfterCurrentWeek,
          },
          geometry: {
            xStart:
              t.getWeekDay(
                isContinuingFromLastWeek
                  ? t.startOfWeek(currentDay)
                  : currentDay
              ) + gridOffset,
            xEnd:
              t.getWeekDay(
                willContinueAfterCurrentWeek
                  ? t.endOfWeek(currentDay)
                  : currentEvent.endsAt
              ) +
              1 +
              gridOffset,
          },
        };

        eventSeries[currentWeek].eventTiles.push(tile);

        if (!willContinueAfterCurrentWeek) {
          currentDay = t.addDays(currentEvent.endsAt, 1);
          break;
        } else {
          currentDay = t.startOfWeek(t.addWeeks(currentDay, 1));
          isContinuingFromLastWeek = true;
        }
      }

      eventsTouched++;
    }

    return eventSeries;
  }
}
