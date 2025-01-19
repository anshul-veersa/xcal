import type {
  BaseEventTile,
  BaseEvent,
  TimeRange,
  LocaleOptions,
} from "@/types";
import * as dfn from "@/core/temporal";
import { getNewObjectId } from "../utils";

export type Tile<Event extends BaseEvent> = {
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

export class DayGridTiler<Event extends BaseEvent> {
  constructor(
    private readonly config: TilerConfig,
    private readonly locale: LocaleOptions
  ) {}

  private getEventPriority(event: Event) {
    return dfn.numberOfDaysBetween(
      {
        start: event.startsAt,
        end: event.endsAt,
      },
      this.locale
    );
  }

  private dateKeyFn = (date: Date) => {
    return dfn.format(date, "yyyyMMdd");
  };

  getLayoutTiles(events: Event[], options: { range: TimeRange }) {
    const { range } = options;

    const calendarStartDate = range.start;
    const calendarEndDate = range.end;

    // Splits the recurring events into individual occurrences/events
    const eventOccurrences = events.flatMap((event) =>
      dfn.getOccurrencesBetween(range, event, this.locale)
    );

    /** Events filtered for visible range, sorted by their row placement priority. */
    const eventsSorted = eventOccurrences.sort(
      (e1, e2) =>
        +dfn.normalizeToDate(e1.startsAt, this.locale) -
          +dfn.normalizeToDate(e2.startsAt, this.locale) ||
        this.getEventPriority(e2) - this.getEventPriority(e1)
    );

    /** A map of events keyed by their start date. */
    const eventsByDate: Record<string, Event[] | undefined> = Object.groupBy(
      eventsSorted,
      (event) => this.dateKeyFn(event.startsAt)
    );

    const eventsProcessed = {
      records: {} as Record<string, number | undefined>,
      getFor(date: string) {
        return this.records[date] ?? 0;
      },
      incFor(date: string) {
        if (!this.records[date]) this.records[date] = 0;
        this.records[date]!++;
      },
    };

    /** Layout of events */
    const eventSeries: Record<string, { eventTiles: Tile<Event>[] }> =
      Object.fromEntries(
        dfn
          .eachWeekBetween(
            {
              start: range.start,
              end: range.end,
            },
            this.locale
          )
          .map((d) => [dfn.getWeek(d, this.locale), { eventTiles: [] }])
      );

    let eventsTouched = 0;
    let currentDay = calendarStartDate;

    while (eventsTouched < eventsSorted.length) {
      // Move to next line, reiterate from first day
      if (dfn.isAfter(currentDay, range.end)) {
        currentDay = range.start;
        continue;
      }

      const dateKey = this.dateKeyFn(currentDay);

      const dayEventIndex = eventsProcessed.getFor(dateKey);
      if (dayEventIndex >= this.config.maxPerSlot) {
        eventsTouched++;
        continue;
      }

      // Get the highest priority event for this day
      const currentEvent = eventsByDate[dateKey]?.[dayEventIndex];
      // No event was found for this day, move to next day
      if (!currentEvent) {
        currentDay = dfn.addDays(currentDay, 1, this.locale);
        continue;
      }

      eventsProcessed.incFor(dateKey);

      let isContinuingFromLastWeek = false;
      while (dfn.isBefore(currentDay, calendarEndDate)) {
        // This event will continue after this week's end
        const willContinueAfterCurrentWeek = dfn.isAfter(
          currentEvent.endsAt,
          dfn.endOfWeek(currentDay, this.locale)
        );

        const currentWeek = dfn.getWeek(currentDay, this.locale);

        const tile: Tile<Event> = {
          id: getNewObjectId(),
          event: currentEvent,
          continuous: {
            start: isContinuingFromLastWeek,
            end: willContinueAfterCurrentWeek,
          },
          geometry: {
            xStart: dfn.getWeekDayIndex(
              isContinuingFromLastWeek
                ? dfn.startOfWeek(currentDay, this.locale)
                : currentDay,
              this.locale
            ),
            xEnd: dfn.getWeekDayIndex(
              willContinueAfterCurrentWeek
                ? dfn.endOfWeek(currentDay, this.locale)
                : currentEvent.endsAt,
              this.locale
            ),
          },
        };

        eventSeries[currentWeek].eventTiles.push(tile);

        if (!willContinueAfterCurrentWeek) {
          currentDay = dfn.addDays(currentEvent.endsAt, 1, this.locale);
          break;
        } else {
          currentDay = dfn.startOfWeek(
            dfn.addWeeks(currentDay, 1, this.locale),
            this.locale
          );
          isContinuingFromLastWeek = true;
        }
      }

      eventsTouched++;
    }

    return eventSeries;
  }
}
