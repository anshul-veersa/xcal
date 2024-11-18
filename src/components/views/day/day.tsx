import { useCallback } from "react";

import { useConfig } from "@/providers/config";
import { useData } from "@/providers/data";
import { useRenderer } from "@/providers/renderer";
import { useTime } from "@/providers/temporal";
import { useCallbacks } from "@/providers/callbacks";
import { adaptConfig } from "./config";
import type { DayViewHeaderItem } from "./types";
import type { Tile } from "@/core/tilers/day-tiler";
import type { TileEvent } from "@/types";
import { ColumnGrid, type TimeSlot } from "@/components/abstract-views";

import s from "./styles.module.scss";

export default function DayView() {
  const config = useConfig(adaptConfig);
  const data = useData();
  const renderer = useRenderer();
  const callbacks = useCallbacks();

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
        onEventUpdate={callbacks.onEventUpdate}
        onSlotClick={callbacks.onSlotClick}
      />
    </div>
  );
}
