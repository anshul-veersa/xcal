import React, { useMemo } from "react";

import { useConfig, useData, useLocale, useRenderer } from "@/providers";
import { DayGridTiler } from "@/core/tilers/day-grid-tiler";
import { adaptConfig } from "./config";

import * as dfn from "@/core/temporal";

import s from "./styles.module.scss";

export default function MonthView() {
  const locale = useLocale();
  const config = useConfig(adaptConfig);
  const data = useData();
  const renderer = useRenderer();

  const fmt = locale.format;

  /**
   * All days of a week
   */
  const weekDays = useMemo(() => {
    return dfn.getWeekDates(dfn.today(locale), locale).map((d) => ({
      date: d,
      day: dfn.format(d, "EEEEEE", locale),
      label: dfn.format(d, locale.format.weekDay, locale),
    }));
  }, [locale]);

  /**
   * Flat array of each date shown on the calendar.
   */
  const calendarDates = useMemo(() => {
    const calendarStart = dfn.startOfWeek(
      dfn.startOfMonth(data.date, locale),
      locale
    ); // tz
    const calendarEnd = dfn.endOfWeek(
      dfn.endOfMonth(data.date, locale),
      locale
    ); // tz

    const dates = dfn.eachDayBetween(
      {
        start: calendarStart,
        end: calendarEnd,
      },
      locale
    );

    return dates.map((date) => ({
      id: date.valueOf(),
      date,
      dayLabel: dfn.format(date, fmt.day),
      isToday: dfn.isToday(date, locale),
    }));
  }, [data.date, fmt.day, locale]);

  /**
   * Dates of the month arranged week wise.
   */

  const monthWeeks = useMemo(() => {
    const daysByWeek = Object.groupBy(calendarDates, ({ date }) =>
      dfn.getWeek(date, locale)
    );

    const weeks = Object.entries(daysByWeek).map(([weekNumber, dates]) => {
      return {
        id: weekNumber,
        weekLabel: dfn.format(dates![0].date, fmt.weekNumber),
        dates: dates!,
      };
    });

    return weeks;
  }, [calendarDates, fmt.weekNumber, locale]);

  const tiler = useMemo(
    () => new DayGridTiler({ maxPerSlot: config.maxEventsPerSlot }, locale),
    [config.maxEventsPerSlot, locale]
  );

  /**
   * Record of event tiles in series for each week of the month.
   * Used with CSS grid to place on the week layout.
   */
  const layoutEventTiles = useMemo(() => {
    const layoutTiles = tiler.getLayoutTiles(data.events, {
      range: {
        start: calendarDates.at(0)!.date,
        end: calendarDates.at(-1)!.date,
      },
    });

    return layoutTiles;
  }, [calendarDates, data.events, tiler]);

  const backgroundEventsByDate = useMemo(() => {
    const backgroundEventOccurrences = data.backgroundEvents
      .flatMap((event) =>
        dfn.getOccurrencesBetween(
          { start: calendarDates.at(0)!.date, end: calendarDates.at(-1)!.date },
          event,
          locale
        )
      )
      .toSorted((e1, e2) => e2.priority - e1.priority);
  }, [data.backgroundEvents, locale, calendarDates]);

  return (
    <div data-xc-element='month-layout' className={s.monthLayout}>
      <header data-xc-element='month-header' className={s.monthHeader}>
        {weekDays.map((weekDay) => (
          <React.Fragment key={weekDay.day}>
            {renderer.renderHeaderItem?.({
              view: "month",
              data: { weekDate: weekDay.date },
            }) ?? (
              <div className={s.headerItem} data-week-day={weekDay.label}>
                {weekDay.label}
              </div>
            )}
          </React.Fragment>
        ))}
      </header>

      <div data-xc-element='day-grid-layout' className={s.monthWeeks}>
        {monthWeeks.map((week) => (
          <div
            data-xc-element='day-grid-week-days'
            key={week.id}
            className={s.monthWeek}
            data-week={week.weekLabel}
          >
            <div
              data-xc-element='day-grid-week-days-slots-layer'
              className={s.weekDays}
            >
              {week.dates.map((date) => (
                <div
                  data-xc-element='day-grid-week-day-cell'
                  key={date.id}
                  data-today={date.isToday ? "" : undefined}
                  data-date={date.dayLabel}
                  className={s.dayCell}
                >
                  {renderer.renderTimeSlot?.({
                    view: "month",
                    data: { backgroundEvents: [], date: date.date },
                  }) ?? (
                    <>
                      <div
                        data-xc-element='day-grid-week-day-cell-header'
                        className={s.dayCellHeader}
                      >
                        <span className={s.dayLabel}>{date.dayLabel}</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div
              data-xc-element='day-grid-week-days-events-layer'
              className={s.weekEventsOverlay}
            >
              {layoutEventTiles[week.id].eventTiles.map((tile) => (
                <div
                  data-xc-element='day-grid-event-tile'
                  key={tile.id}
                  className={s.eventTile}
                  style={{
                    gridColumnStart: tile.geometry.xStart + 1,
                    gridColumnEnd: tile.geometry.xEnd + 2,
                  }}
                >
                  {renderer.renderEventTile({ view: "month", data: tile })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
