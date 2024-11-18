import { useMemo } from "react";
import clsx from "clsx";

import { useConfig } from "@/providers/config";
import { useData } from "@/providers/data";
import { useRenderer } from "@/providers/renderer";
import { useCallbacks } from "@/providers/callbacks";
import { useTime } from "@/providers/temporal";
import { MonthTiler } from "@/core/tilers/month-tiler";
import { adaptConfig } from "./config";

import s from "./styles.module.scss";

export default function MonthView() {
  const config = useConfig(adaptConfig);
  const data = useData();
  const renderer = useRenderer();
  const t = useTime();
  const callbacks = useCallbacks();

  const weekDays = useMemo(() => {
    return t.daysOfWeek().map((d) => ({ ...d, label: d.label.toUpperCase() }));
  }, [t]);

  /**
   * Dates of the month arranged week wise with specified locale.
   */
  type MonthWeeks = Array<{
    id: number;
    days: Array<{
      id: string;
      date: Date;
      label: string;
      isToday: boolean;
    }>;
  }>;
  const monthWeeks = useMemo<MonthWeeks>(() => {
    const calendarStart = t.startOfWeek(t.startOfMonth(data.date));
    const calendarEnd = t.endOfWeek(t.endOfMonth(data.date));

    const datesOnCalendar = t.eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
    });

    const weeklyDates: Record<number, MonthWeeks[number]> = {};
    for (let d = 0; d < datesOnCalendar.length; d += 7) {
      const week = t.getWeek(datesOnCalendar[d]);
      const days = datesOnCalendar.slice(d, d + 7).map((d) => ({
        id: t.format(d, "yyyy-MM-dd"),
        date: d,
        label: t.format(d, "d"),
        isToday: t.isSameDay(d, t.today),
      }));
      weeklyDates[week] = {
        id: week,
        days,
      };
    }
    return Object.values(weeklyDates);
  }, [data.date, t]);

  /**
   * Flat array of each date shown on the calendar.
   */
  const calendarDates = useMemo(() => {
    return Object.entries(monthWeeks).flatMap(([_, d]) => d.days);
  }, [monthWeeks]);

  const tiler = useMemo(
    () => new MonthTiler({ maxPerSlot: config.maxEventsPerSlot }, t),
    [t, config.maxEventsPerSlot]
  );
  /**
   * Record of event tiles in series for each week of the month.
   * Used with CSS grid to place on the week layout.
   */
  const layoutEventTiles = useMemo(() => {
    const layoutTiles = tiler.getLayoutTiles(data.events, {
      range: {
        from: calendarDates.at(0)!.date,
        to: calendarDates.at(-1)!.date,
      },
    });

    return layoutTiles;
  }, [calendarDates, data.events, tiler]);

  return (
    <div className={s["month-view"]}>
      <div className={s["month-layout"]}>
        <header className={s["month-header"]}>
          {weekDays.map((weekDay) => (
            <div key={weekDay.name} data-week-day={weekDay.name}>
              {weekDay.label}
            </div>
          ))}
        </header>

        {monthWeeks.map((week) => (
          <div key={week.id} className={s["month-week"]} data-week={week.id}>
            <div className={s["week-layout__cells"]}>
              {week.days.map((day) => (
                <div
                  key={day.id}
                  className={clsx({ today: day.isToday }, s["day-cell"])}
                  data-date={day.id}
                  onClick={callbacks.onSlotClick?.()}
                >
                  <div className={s["day-cell__info"]}>
                    <span className={s["date-label"]}>{day.label}</span>
                  </div>

                  <div className={s["day-cell__footer"]}></div>
                </div>
              ))}
            </div>

            <div className={s["week-layout__overlay"]}>
              {layoutEventTiles[week.id].eventTiles.map((tile) => (
                <div
                  key={tile.id}
                  className={s["overlay__tile"]}
                  style={{
                    gridColumnStart: tile.geometry.xStart,
                    gridColumnEnd: tile.geometry.xEnd,
                  }}
                >
                  {renderer.renderEventTile({ tile, view: "month" })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
