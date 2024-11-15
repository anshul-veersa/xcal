import { MonthTiler } from "@/core/tilers";
import { useConfig } from "@/providers/config/context";
import { useData } from "@/providers/data/context";
import { useRenderer } from "@/providers/renderer/context";
import { useTime } from "@/providers/temporal";
import clsx from "clsx";
import { useMemo } from "react";

export default function MonthView() {
  const config = useConfig();
  const data = useData();
  const renderer = useRenderer();
  const t = useTime();

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

  const tiler = new MonthTiler({ maxPerSlot: config.maxEventsPerSlot }, t);
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
    <div className='month-view'>
      <div className='month-layout'>
        <header className='month-header'>
          {weekDays.map((weekDay) => (
            <div key={weekDay.name} data-week-day={weekDay.name}>
              {weekDay.label}
            </div>
          ))}
        </header>

        {monthWeeks.map((week) => (
          <div key={week.id} className='month-week' data-week={week.id}>
            <div className='week-layout__cells'>
              {week.days.map((day) => (
                <div
                  v-for='day in week.days'
                  key={day.id}
                  className={clsx({ today: day.isToday }, "day-cell")}
                  data-date={day.id}
                >
                  <div className='day-cell__info'>
                    <span className='date-label'>{day.label}</span>
                  </div>

                  <div className='day-cell__footer'></div>
                </div>
              ))}
            </div>

            <div className='week-layout__overlay'>
              {layoutEventTiles[week.id].eventTiles.map((tile) => (
                <div
                  v-for='tile in layoutEventTiles[week.id].eventTiles'
                  key={tile.id}
                  className='overlay__tile'
                  style={{
                    gridColumnStart: tile.geometry.xStart,
                    gridColumnEnd: tile.geometry.xEnd,
                  }}
                >
                  <slot
                    name='event-tile'
                    v-bind='{ event: tile.event, tile }'
                  />

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
