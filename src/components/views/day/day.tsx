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

export default function DayView() {
  const config = useConfig(adaptConfig);
  const data = useData();
  const renderer = useRenderer();

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

      return <div>{data.date.toDateString()}</div>;
    },
    [renderer]
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
      />
    </div>
  );
}
