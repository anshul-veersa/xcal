import { useEffect, useMemo } from "react";
import type { BackgroundEvent } from "@/types";
import type { ColumnGridProps } from "./types";
import { DayTiler } from "@/core/tilers/day-tiler";
import { useTime } from "@/providers/temporal";
import { ScrollSync } from "@/core/scroll-sync";

import s from "./styles.module.scss";

export function ColumnGrid<HeaderData>(props: ColumnGridProps<HeaderData>) {
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

  const computedConfig = useMemo(() => {
    const slotsStartsAt = t.startOfDay(t.today);
    const slotsEndsAt = t.endOfDay(t.today);

    const slotsSpan = t.differenceInMinutes(slotsEndsAt, slotsStartsAt);
    const totalSlots = Math.ceil(slotsSpan / props.config.slotDuration);
    return {
      slotsStartsAt,
      slotsEndsAt,
      slotsSpan,
      totalSlots,
    };
  }, [t, props.config.slotDuration]);

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
      const backgroundEventsByKey: Record<number, BackgroundEvent[]> = {};

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
        slots: Array.from({ length: computedConfig.totalSlots }, (_, i) => {
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
        }),
      };
    });
  }, [props.columns, props.config.slotDuration, t, computedConfig.totalSlots]);

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
        start: computedConfig.slotsStartsAt,
        end: computedConfig.slotsEndsAt,
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
  }, [props.config, t, computedConfig]);

  useEffect(() => {
    const scrollSync = new ScrollSync("data-scroll-sync");
    scrollSync.mount();

    document.querySelector(`[data-scroll-into-view="true"]`)?.scrollIntoView();

    return () => {
      scrollSync.destroy();
    };
  }, []);

  return (
    <div
      className={s["column-grid-layout"]}
      style={
        {
          "--slots-count": computedConfig.totalSlots,
          "--slot-height": props.config.slotHeight + "px",
          "--indicators-count": slotIndicators.length,
        } as React.CSSProperties
      }
    >
      <div className={s["corner"]}></div>
      <div className={s["header"]}>
        <div className={s["header-items"]}>
          {props.columns.map((column) => (
            <div
              key={column.id}
              className={s["header-item"]}
              {...column.attributes}
            >
              {props.renderHeaderItem(column.header.data)}
            </div>
          ))}
        </div>
      </div>
      <div className={s["content"]}>
        <div className={s["content-layout"]}>
          <div className={s["time-indicators"]}>
            {slotIndicators.map((indicator) => (
              <div
                className={s["time-indicator"]}
                key={indicator.id}
                data-is-hour={indicator.isHour}
                data-scroll-into-view={indicator.scrollIntoView}
              >
                <span className={s["time-indicator__label"]}>
                  {indicator.label}
                </span>
                <div className={s["time-indicator__rule"]} />
              </div>
            ))}
          </div>
          <div className={s["columns"]}>
            {props.columns.map((column, colIdx) => (
              <div className={s["column"]} {...column.attributes}>
                <div className={s["slots-layer"]}>
                  {slotsByColumn[colIdx].slots.map((timeSlot) => (
                    <div key={timeSlot.id} className={s["slot"]}>
                      {props.renderTimeSlot(timeSlot)}
                    </div>
                  ))}
                </div>

                <div className={s["separators-layer"]}>
                  {slotIndicators.map((hourIndicator) => (
                    <div
                      className={s["separator"]}
                      key={hourIndicator.id}
                      data-is-hour={hourIndicator.isHour}
                    >
                      <span className={s["separator__rule"]}></span>
                    </div>
                  ))}
                </div>

                <div className={s["events-layer"]}>
                  {eventTilesByColumn[colIdx].eventTiles.map((tile) => (
                    <div
                      key={tile.id}
                      className={s["event-tile"]}
                      style={{
                        gridRowStart: tile.geometry.yStart + 1,
                        gridRowEnd: tile.geometry.yEnd + 1,
                        width: `calc(${
                          tile.geometry.width * 100
                        }% - (var(--tile-gap) * 2))`,
                        left: `calc(${
                          tile.geometry.xOffset * 100
                        }% + var(--tile-gap))`,
                      }}
                    >
                      {props.renderEventTile(tile)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
