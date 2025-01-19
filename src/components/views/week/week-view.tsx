import { useCallback, useMemo } from "react";

import { useConfig, useData, useLocale, useRenderer } from "@/providers";

import type { Tile } from "@/core/tilers/time-grid-tiler";
import { TimeGrid, type TimeSlot } from "@/components/abstract-views";
import type { TileEvent } from "@/types";
import type { WeekViewHeaderItem } from "./types";
import { getConfigAdapter } from "./config";
import * as dfn from "@/core/temporal";

import s from "./styles.module.scss";

export default function WeekView() {
  const locale = useLocale();
  const config = useConfig(useMemo(() => getConfigAdapter(locale), [locale]));
  const data = useData();
  const renderer = useRenderer();

  const weekDates = useMemo(() => {
    return dfn.getWeekDates(data.date, locale);
  }, [data.date, locale]);

  const weekDayColumns = useMemo(() => {
    return weekDates.map((date) => {
      const isToday = dfn.isToday(date, locale);

      return {
        id: +date,
        date: date,
        header: {
          data: { date },
          attributes: {
            "data-week-day": dfn.format(date, locale.format.weekDay),
            "data-date": dfn.format(date, locale.format.date.abbr),
            "data-is-today": isToday ? "" : undefined,
          },
        },
        events: data.events,
        backgroundEvents: data.backgroundEvents,
        attributes: { "data-is-today": isToday ? "" : undefined },
      };
    });
  }, [data, weekDates, locale]);

  const renderHeaderItem = useCallback(
    (data: WeekViewHeaderItem) => {
      if (renderer.renderHeaderItem)
        return renderer.renderHeaderItem({ view: "week", data });

      return (
        <div className={s.weekDayHeader}>
          <span className={s.dayName}>
            {dfn.format(data.date, locale.format.weekDay)}
          </span>
          <span className={s.dayDate}>
            {dfn.format(data.date, locale.format.day)}
          </span>
        </div>
      );
    },
    [renderer, locale.format]
  );

  const renderEventTile = useCallback(
    (tile: Tile<TileEvent>) => {
      return renderer.renderEventTile({ view: "week", data: tile });
    },
    [renderer]
  );

  const renderTimeSlot = useCallback(
    (slot: TimeSlot) => {
      if (renderer.renderTimeSlot)
        return renderer.renderTimeSlot({
          view: "week",
          data: slot,
        });
    },
    [renderer]
  );

  return (
    <TimeGrid
      locale={locale}
      columns={weekDayColumns}
      config={config}
      renderEventTile={renderEventTile}
      renderHeaderItem={renderHeaderItem}
      renderTimeSlot={renderTimeSlot}
      renderCorner={renderer.renderTimeGridCorner}
    />
  );
}
