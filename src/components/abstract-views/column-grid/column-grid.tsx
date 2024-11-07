import { useEffect, useMemo } from "react";
import { BackgroundEvent, CalendarEvent, SlotDuration } from "../../../types";
import styles from "./styles.module.scss";
import { DayTiler } from "../../../core/tilers";
import { useTime } from "../../../providers/providers/temporal";
import { ScrollSync } from "../../../core/scroll-sync";

export interface ColumnGridProps<
  TileEventData,
  BackgroundEventData,
  HeaderData
> {
  activeDate: Date;
  config: {
    slotDuration: SlotDuration;
    slotHeight: number;
    maxEventsPerSlot: number;
    showSlotSeparator: boolean;
    showSlotIndicators: boolean;
    showCurrentTimeMarker: boolean;
    showAllDaySlot: boolean;
    hourIndicatorLabelFormat: string;
    scrollTimeIntoView: Date;
  };
  columns: Array<{
    id: number | string;
    date: Date;
    header: { data: HeaderData; attributes?: Record<string, any> };
    events: Array<CalendarEvent<TileEventData>>;
    backgroundEvents: Array<BackgroundEvent<BackgroundEventData>>;
    attributes?: Record<string, any>;
  }>;
}

export function ColumnGrid<TileEventData, BackgroundEventData, HeaderData>(
  props: ColumnGridProps<TileEventData, BackgroundEventData, HeaderData>
) {
  const t = useTime();

  const tiler = useMemo(() => {
    return new DayTiler(
      {
        maxPerSlot: props.config.maxEventsPerSlot,
        slotDuration: props.config.slotDuration,
      },
      t
    );
  }, [props.config.maxEventsPerSlot, props.config.slotDuration, t]);

  const eventTilesByColumn = useMemo(() => {
    return props.columns.map((column) => {
      return {
        id: column.id,
        eventTiles: tiler.getLayoutTiles(column.events, { date: column.date }),
      };
    });
  }, [props.columns, tiler]);

  const slotsByColumn = useMemo(() => {
    function getSlotKey(time: Date) {
      return Math.floor(t.minutesSinceEpoch(time) / props.config.slotDuration);
    }

    return props.columns.map((column) => {
      const backgroundEventsByKey: Record<
        number,
        BackgroundEvent<BackgroundEventData>[]
      > = {};

      const backgroundEventsSortedByPriority = column.backgroundEvents.toSorted(
        (e1, e2) => e2.priority - e1.priority
      );
      backgroundEventsSortedByPriority.forEach((event) => {
        const keyRange = {
          from: getSlotKey(event.startsAt),
          to: getSlotKey(event.endsAt),
        };
        for (let key = keyRange.from; key <= keyRange.to; key++) {
          if (!backgroundEventsByKey[key]) backgroundEventsByKey[key] = [];
          backgroundEventsByKey[key].push(event);
        }
      });

      return {
        id: column.id,
        slots: Array.from(
          { length: computedConfig.value.totalSlots },
          (_, i) => {
            const startTime = t.addMinutes(
                column.date,
                i * props.config.slotDuration
              ),
              endTime = t.addMinutes(
                column.date,
                (i + 1) * props.config.slotDuration
              );
            return {
              id: i,
              startTime,
              endTime,
              backgroundEvents: backgroundEventsByKey[getSlotKey(startTime)],
            };
          }
        ),
      };
    });
  }, [props.columns, props.config.slotDuration, t]);

  const slotIndicators = useMemo(() => {
    const slotInterval = props.config.showSlotIndicators
      ? props.config.slotDuration
      : 60;

    const nearestSlotToScroll = t.roundToNearestMinutes(
      props.config.scrollTimeIntoView,
      { nearestTo: 30 }
    );

    const intervals = t.eachMinuteOfInterval(
      {
        start: computedConfig.value.slotsStartsAt,
        end: computedConfig.value.slotsEndsAt,
      },
      { step: slotInterval }
    );

    intervals.push(t.addMinutes(intervals.at(-1)!, slotInterval));

    const indicators = intervals.map((time) => {
      return {
        id: +time,
        time,
        isHour: time.getMinutes() === 0,
        label: t.format(time, props.config.hourIndicatorLabelFormat),
        scrollIntoView: t.isSameMinute(nearestSlotToScroll, time),
      };
    });

    return indicators;
  }, [props.config, t]);

  useEffect(() => {
    const scrollSync = new ScrollSync("data-scroll-sync");
    scrollSync.mount();

    document.querySelector(`[data-scroll-into-view="true"]`)?.scrollIntoView();

    return () => {
      scrollSync.destroy();
    };
  }, []);

  return <div className={styles.columnGridLayout}></div>;
}
