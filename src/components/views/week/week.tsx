import { useCallback, useMemo } from "react";

import { ColumnGrid, type TimeSlot } from "@/components/abstract-views";
import { useConfig } from "@/providers/config";
import { useData } from "@/providers/data";
import { useRenderer } from "@/providers/renderer";
import { adaptConfig } from "./config";
import type { WeekViewHeaderItem } from "./types";
import type { TileEvent } from "@/types";
import type { Tile } from "@/core/tilers/day-tiler";
import { useTime } from "@/providers/temporal";

import s from "./styles.module.scss";
import { useCallbacks } from "@/providers/callbacks";

export default function WeekView() {
  const config = useConfig(adaptConfig);
  const data = useData();
  const renderer = useRenderer();
  const callbacks = useCallbacks();

  const t = useTime();

  const weekDays = useMemo(() => {
    return t.eachDayOfInterval({
      start: t.startOfWeek(data.date),
      end: t.endOfWeek(data.date),
    });
  }, [t, data.date]);

  const columns = useMemo(() => {
    return weekDays.map((day) => {
      const isToday = t.isSameDay(t.today, day);

      return {
        id: +day,
        date: day,
        header: {
          data: { date: day },
          attributes: {
            "data-week-day": day,
            "data-date": day,
            "data-is-today": isToday,
          },
        },
        events: data.events,
        backgroundEvents: data.backgroundEvents,
        attributes: { "data-is-today": isToday },
      };
    });
  }, [t, data, weekDays]);

  const renderHeaderItem = useCallback(
    (data: WeekViewHeaderItem) => {
      if (renderer.renderHeaderItem)
        return renderer.renderHeaderItem({ view: "week", data });

      return (
        <div className={s["week-header-day"]}>
          <span className={s["week-header-day__name"]}>
            {t.format(data.date, "EEE")}
          </span>
          <span className={s["week-header-day__date"]}>
            {t.format(data.date, "dd")}
          </span>
        </div>
      );
    },
    [t, renderer]
  );

  const renderEventTile = useCallback(
    (tile: Tile<TileEvent>) => {
      return renderer.renderEventTile({ view: "week", tile });
    },
    [renderer]
  );

  const renderTimeSlot = useCallback(
    (slot: TimeSlot) => {
      if (renderer.renderTimeSlot)
        return renderer.renderTimeSlot({
          view: "week",
          slot: { ...slot, backgroundEvents: slot.backgroundEvents },
        });
    },
    [renderer]
  );

  return (
    <div className={s["week-view"]}>
      <ColumnGrid
        activeDate={data.date}
        columns={columns}
        config={{ ...config }}
        renderEventTile={renderEventTile}
        renderHeaderItem={renderHeaderItem}
        renderTimeSlot={renderTimeSlot}
        renderCorner={renderer.renderTimeGridCorner}
        onEventUpdate={callbacks.onEventUpdate}
        onSlotClick={callbacks.onSlotClick}
      />
    </div>
  );
}
