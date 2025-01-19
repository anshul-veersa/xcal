import { useCallback, useMemo } from "react";

import { useConfig, useData, useLocale, useRenderer } from "@/providers";
import { getConfigAdapter } from "./config";
import type { DayViewHeaderItem } from "./types";
import type { Tile } from "@/core/tilers/time-grid-tiler";
import type { TileEvent } from "@/types";
import { TimeGrid, type TimeSlot } from "@/components/abstract-views";
import * as dfn from "@/core/temporal";

import s from "./styles.module.scss";

export default function DayView() {
  const locale = useLocale();
  const config = useConfig(useMemo(() => getConfigAdapter(locale), [locale]));
  const data = useData();
  const renderer = useRenderer();

  const isToday = dfn.isToday(data.date, locale);

  const dayColumn = {
    id: +data.date,
    date: data.date,
    header: {
      data: {
        date: data.date,
      },
      attributes: {
        "data-is-today": isToday ? "" : undefined,
      },
    },
    events: data.events,
    backgroundEvents: data.backgroundEvents,
    attributes: {
      "data-is-today": isToday ? "" : undefined,
    },
  };

  const renderHeaderItem = useCallback(
    (data: DayViewHeaderItem) => {
      if (renderer.renderHeaderItem)
        return renderer.renderHeaderItem({ view: "day", data });

      return (
        <div className={s.dayHeader}>
          <span className={s.date}>
            {dfn.format(data.date, locale.format.date.long)}
          </span>
          <span>{dfn.format(data.date, locale.format.weekDay)}</span>
        </div>
      );
    },
    [renderer, locale.format]
  );

  const renderEventTile = useCallback(
    (tile: Tile<TileEvent>) => {
      return renderer.renderEventTile({ view: "day", data: tile });
    },
    [renderer]
  );

  const renderTimeSlot = useCallback(
    (slot: TimeSlot) => {
      if (renderer.renderTimeSlot)
        return renderer.renderTimeSlot({
          view: "day",
          data: slot,
        });
    },
    [renderer]
  );

  return (
    <TimeGrid
      locale={locale}
      columns={[dayColumn]}
      config={config}
      renderEventTile={renderEventTile}
      renderHeaderItem={renderHeaderItem}
      renderTimeSlot={renderTimeSlot}
      renderCorner={renderer.renderTimeGridCorner}
    />
  );
}
