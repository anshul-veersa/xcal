import { useMemo } from "react";

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

  return (
    <div className={s.monthView}>
      <div className={s.monthLayout}>
        <header className={s.monthHeader}>
          {weekDays.map(
            (weekDay) =>
              renderer.renderHeaderItem?.({
                view: "month",
                data: { weekDate: weekDay.date },
              }) ?? (
                <div
                  className={s.headerItem}
                  key={weekDay.day}
                  data-week-day={weekDay.label}
                >
                  {weekDay.label}
                </div>
              )
          )}
        </header>

        <div className={s.monthWeeks}>
          {monthWeeks.map((week) => (
            <>
              <div
                key={week.id}
                className={s.monthWeek}
                data-week={week.weekLabel}
              >
                <div className={s.weekDays}>
                  {week.dates.map((date) => (
                    <div
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
                          <div className={s.dayCellInfo}>
                            <span className={s.dayLabel}>{date.dayLabel}</span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                <div className={s.weekEventsOverlay}>
                  {layoutEventTiles[week.id].eventTiles.map((tile) => (
                    <div
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
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
