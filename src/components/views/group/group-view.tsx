import { useCallback, useMemo } from "react";

import { useConfig, useData, useLocale, useRenderer } from "@/providers";
import type { TileEvent } from "@/types";
import type { Tile } from "@/core/tilers/time-grid-tiler";
import { TimeGrid, type TimeSlot } from "@/components/abstract-views";
import { getConfigAdapter } from "./config";
import type { GroupViewHeaderItem } from "./types";
import * as dfn from "@/core/temporal";

import s from "./styles.module.scss";

export default function GroupView() {
  const locale = useLocale();
  const config = useConfig(useMemo(() => getConfigAdapter(locale), [locale]));
  const data = useData();
  const renderer = useRenderer();

  const groups = useMemo(() => {
    const tileEvents = data.events.map(
      (e) =>
        ({
          type: "tile",
          ...e,
        } as const)
    );

    const backgroundEvents = data.backgroundEvents.map(
      (e) =>
        ({
          type: "background",
          ...e,
        } as const)
    );

    const eventsByGroup = Object.groupBy(tileEvents, config.groupSelector);
    const backgroundEventsByGroup = Object.groupBy(
      backgroundEvents,
      config.groupSelector
    );

    const groupIds = Array.from(
      new Set([
        ...Object.keys(eventsByGroup),
        ...Object.keys(backgroundEventsByGroup),
      ])
    );

    const groupsWithData = groupIds.map((id) => ({
      id,
      events: eventsByGroup[id] ?? [],
      backgroundEvents: backgroundEventsByGroup[id] ?? [],
    }));

    const sortedGroups = config.groupOrderer(groupsWithData);

    return sortedGroups;
  }, [config, data.backgroundEvents, data.events]);

  const isToday = dfn.isToday(data.date, locale);

  const groupColumns = useMemo(() => {
    return groups.map((group) => {
      return {
        id: group.id,
        date: data.date,
        header: {
          data: { group, date: data.date },
          attributes: {
            "data-is-today": isToday ? "" : undefined,
          },
        },
        events: group.events,
        backgroundEvents: group.backgroundEvents ?? [],
        attributes: {
          "data-is-today": isToday ? "" : undefined,
        },
      };
    });
  }, [data.date, groups, isToday]);

  const renderHeaderItem = useCallback(
    (data: GroupViewHeaderItem) => {
      if (renderer.renderHeaderItem)
        return renderer.renderHeaderItem({ view: "group", data });

      return (
        <div className={s.groupHeader}>
          <span className={s.label}>{data.group.id}</span>
        </div>
      );
    },
    [renderer]
  );

  const renderEventTile = useCallback(
    (tile: Tile<TileEvent>) => {
      return renderer.renderEventTile({ view: "group", data: tile });
    },
    [renderer]
  );

  const renderTimeSlot = useCallback(
    (slot: TimeSlot) => {
      if (renderer.renderTimeSlot)
        return renderer.renderTimeSlot({
          view: "group",
          data: slot,
        });
    },
    [renderer]
  );

  return (
    <TimeGrid
      locale={locale}
      columns={groupColumns}
      config={config}
      renderEventTile={renderEventTile}
      renderHeaderItem={renderHeaderItem}
      renderTimeSlot={renderTimeSlot}
      renderCorner={renderer.renderTimeGridCorner}
    />
  );
}
