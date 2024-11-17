import { ColumnGrid, type TimeSlot } from "@/components/abstract-views";
import { useConfig } from "@/providers/config/context";
import { useData } from "@/providers/data/context";
import { useRenderer } from "@/providers/renderer/context";
import { adaptConfig } from "./config";
import type { GroupViewHeaderItem } from "./types";
import { useCallback, useMemo } from "react";
import type { TileEvent } from "@/types";
import type { Tile } from "@/core/tilers/day-tiler";
import { groupBy } from "@/core/utils";

export default function GroupView() {
  const config = useConfig(adaptConfig);
  const data = useData();
  const renderer = useRenderer();

  const groups = useMemo(() => {
    const eventsByGroup = groupBy(data.events, config.groupSelector);
    const backgroundEventsByGroup = groupBy(
      data.backgroundEvents,
      config.groupSelector
    );

    const combinedGroupIds = Array.from(
      new Set([
        ...Object.keys(eventsByGroup),
        ...Object.keys(backgroundEventsByGroup),
      ])
    );

    const sortedGroups = config.groupOrderer(
      combinedGroupIds.map((groupId) => ({
        id: groupId,
        events: eventsByGroup[groupId] ?? [],
        backgroundEvents: backgroundEventsByGroup[groupId] ?? [],
      }))
    );

    return sortedGroups;
  }, [config, data.backgroundEvents, data.events]);

  const columns = useMemo(() => {
    return groups.map((group) => {
      return {
        id: group.id,
        date: data.date,
        header: { data: { group, date: data.date } },
        events: group.events,
        backgroundEvents: group.backgroundEvents ?? [],
      };
    });
  }, [data.date, groups]);

  const renderHeaderItem = useCallback(
    (data: GroupViewHeaderItem) => {
      if (renderer.renderHeaderItem)
        return renderer.renderHeaderItem({ view: "group", data });

      return <div>{data.group.id}</div>;
    },
    [renderer]
  );

  const renderEventTile = useCallback(
    (tile: Tile<TileEvent>) => {
      return renderer.renderEventTile({ view: "group", tile });
    },
    [renderer]
  );

  const renderTimeSlot = useCallback(
    (slot: TimeSlot) => {
      if (renderer.renderTimeSlot)
        return renderer.renderTimeSlot({
          view: "group",
          slot: { ...slot, backgroundEvents: slot.backgroundEvents },
        });
    },
    [renderer]
  );

  return (
    <div className='group-view'>
      <ColumnGrid
        activeDate={data.date}
        columns={columns}
        config={{ ...config }}
        renderEventTile={renderEventTile}
        renderHeaderItem={renderHeaderItem}
        renderTimeSlot={renderTimeSlot}
      />
    </div>
  );
}
