import { ColumnGrid, type TimeSlot } from "@/components/abstract-views";
import { useConfig } from "@/providers/config/context";
import { useData } from "@/providers/data/context";
import { useRenderer } from "@/providers/renderer/context";
import { adaptConfig } from "./config";
import type { DayViewHeaderItem } from "./types";
import { useCallback } from "react";
import type { TileEvent } from "@/types";
import type { Tile } from "@/core/tilers/day-tiler";

import s from "./styles.module.scss";
import { useTime } from "@/providers/temporal";

export default function DayView() {
  const config = useConfig(adaptConfig);
  const data = useData();
  const renderer = useRenderer();

  const t = useTime();

  const dayColumn = {
    id: data.date.getDate(),
    date: data.date,
    header: {
      data: {
        date: data.date,
      },
      attributes: {},
    },
    events: data.events,
    backgroundEvents: data.backgroundEvents,
    attributes: {},
  };

  const renderHeaderItem = useCallback(
    (data: DayViewHeaderItem) => {
      if (renderer.renderHeaderItem)
        return renderer.renderHeaderItem({ view: "day", data });

      return (
        <div className={s["day-view__header"]}>
          <span className={s["date"]}>
            {t.format(data.date, "dd MMMM yyyy")}
          </span>
          <span>{t.format(data.date, "EEEE")}</span>
        </div>
      );
    },
    [t, renderer]
  );

  const renderEventTile = useCallback(
    (tile: Tile<TileEvent>) => {
      return renderer.renderEventTile({ view: "day", tile });
    },
    [renderer]
  );

  const renderTimeSlot = useCallback(
    (slot: TimeSlot) => {
      if (renderer.renderTimeSlot)
        return renderer.renderTimeSlot({
          view: "day",
          slot: { ...slot, backgroundEvents: slot.backgroundEvents },
        });
    },
    [renderer]
  );

  return (
    <div className={s["day-view"]}>
      <ColumnGrid
        activeDate={data.date}
        columns={[dayColumn]}
        config={{ ...config }}
        renderEventTile={renderEventTile}
        renderHeaderItem={renderHeaderItem}
        renderTimeSlot={renderTimeSlot}
        renderCorner={renderer.renderTimeGridCorner}
      />
    </div>
  );
}
