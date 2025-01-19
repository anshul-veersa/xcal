import { useEffect, useMemo } from "react";

import type { BackgroundEvent, TimeRange } from "@/types";
import * as dfn from "@/core/temporal";
import { ScrollSync } from "@/core/scroll-sync";
import { TimeGridTiler } from "@/core/tilers/time-grid-tiler";
import type { TimeGridProps } from "./types";

import s from "./styles.module.scss";

export function TimeGrid<HeaderData>(props: TimeGridProps<HeaderData>) {
  const computedConfig = useMemo(() => {
    const dayStartsAt = dfn.inTz(
      props.config.dayRange.start,
      props.locale.timeZone
    );
    const dayEndsAt = dfn.inTz(
      props.config.dayRange.end,
      props.locale.timeZone
    );

    const dayDuration = dfn.differenceInMinutes(dayEndsAt, dayStartsAt);
    const totalSlots = Math.ceil(dayDuration / props.config.slotDuration);
    return {
      dayStartsAt,
      dayEndsAt,
      totalSlots,
    };
  }, [props.config.slotDuration, props.config.dayRange, props.locale]);

  const tiler = useMemo(() => {
    return new TimeGridTiler(
      {
        maxPerSlot: props.config.maxEventsPerSlot,
        slotDuration: props.config.slotDuration,
        useEventTimeZone: props.config.useTimeZonedEvents,
      },
      props.locale
    );
  }, [props.config, props.locale]);

  const eventTilesByColumn = useMemo(() => {
    return props.columns.map((column) => {
      return {
        id: column.id,
        eventTiles: tiler.getLayoutTiles(column.events, {
          range: {
            start: dfn.imposeTimeOn(column.date, computedConfig.dayStartsAt),
            end: dfn.imposeTimeOn(column.date, computedConfig.dayEndsAt),
          },
        }),
      };
    });
  }, [props.columns, tiler, computedConfig]);

  const slotsByColumn = useMemo(() => {
    function getSlotKey(time: Date) {
      return Math.floor(
        dfn.minutesSinceEpochFrom(time, props.locale) /
          props.config.slotDuration
      );
    }

    return props.columns.map((column) => {
      const dayRange: TimeRange = {
        start: dfn.imposeTimeOn(column.date, computedConfig.dayStartsAt),
        end: dfn.imposeTimeOn(column.date, computedConfig.dayEndsAt),
      };

      const backgroundEventOccurrences = column.backgroundEvents
        .flatMap((event) =>
          dfn.getOccurrencesBetween(dayRange, event, props.locale)
        )
        .toSorted((e1, e2) => e2.priority - e1.priority);

      const backgroundEventsByKey: Record<number, BackgroundEvent[]> = {};
      backgroundEventOccurrences.forEach((event) => {
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
          const startTime = dfn.addMinutes(
              column.date,
              i * props.config.slotDuration,
              props.locale
            ),
            endTime = dfn.addMinutes(
              column.date,
              (i + 1) * props.config.slotDuration,
              props.locale
            );
          return {
            id: i,
            startTime,
            endTime,
            backgroundEvents:
              backgroundEventsByKey[getSlotKey(startTime)] ?? [],
          };
        }),
      };
    });
  }, [props.columns, props.config.slotDuration, props.locale, computedConfig]);

  const slotIndicators = useMemo(() => {
    const slotInterval = props.config.showSlotIndicators
      ? props.config.slotDuration
      : 60;

    const intervals = dfn.eachMinuteBetween(
      {
        start: computedConfig.dayStartsAt,
        end: computedConfig.dayEndsAt,
      },
      { step: slotInterval, ...props.locale }
    );

    // Adds additional slot ending interval
    intervals.push(
      dfn.addMinutes(intervals.at(-1)!, slotInterval, props.locale)
    );

    const indicators = intervals.map((time) => {
      return {
        id: +time,
        time,
        isHour: time.getMinutes() === 0,
        label: dfn.format(time, props.locale.format.time.short),
      };
    });

    return indicators;
  }, [props.config, computedConfig, props.locale]);

  useEffect(() => {
    const scrollSync = new ScrollSync("data-xc-scroll-sync");
    scrollSync.mount();

    return () => scrollSync.destroy();
  }, []);

  return (
    <div
      data-xc-element='time-grid-layout'
      className={s.timeGridLayout}
      style={
        {
          "--slots-count": computedConfig.totalSlots,
          "--slot-height": props.config.slotHeight,
          "--indicators-count": slotIndicators.length,
        } as React.CSSProperties
      }
    >
      <div data-xc-element='time-grid-corner' className={s.corner}>
        {props.renderCorner?.(undefined) ?? (
          <div className={s.cornerContent}></div>
        )}
      </div>

      <div
        data-xc-scroll-sync='x'
        data-xc-element='time-grid-header'
        className={s.header}
      >
        <div data-xc-element='time-grid-header-items' className={s.headerItems}>
          {props.columns.map((column) => (
            <div
              data-xc-element='time-grid-header-item'
              key={column.id}
              className={s.headerItem}
              {...column.attributes}
            >
              {props.renderHeaderItem(column.header.data)}
            </div>
          ))}
        </div>
      </div>

      <div data-xc-element='time-grid-content' className={s.content}>
        <div
          data-xc-element='time-grid-content-layout'
          className={s.contentLayout}
        >
          <div
            data-xc-element='time-grid-time-indicators'
            className={s.timeIndicators}
          >
            {slotIndicators.map((indicator) => (
              <div
                data-xc-element='time-grid-time-indicator'
                key={indicator.id}
                className={s.indicator}
                data-is-hour={indicator.isHour ? "" : undefined}
              >
                <span
                  data-xc-element='time-grid-time-indicator-label'
                  className={s.indicatorLabel}
                >
                  {indicator.label}
                </span>
                <div
                  data-xc-element='time-grid-time-indicator-rule'
                  className={s.indicatorRule}
                />
              </div>
            ))}
          </div>
          <div className={s.columns} data-xc-scroll-sync='x'>
            {props.columns.map((column, colIdx) => (
              <div
                data-xc-element='time-grid-column'
                key={column.id}
                className={s.column}
                {...column.attributes}
              >
                <div
                  data-xc-element='time-grid-slots-layer'
                  className={s.slotsLayer}
                >
                  {slotsByColumn[colIdx].slots.map((timeSlot) => (
                    <div
                      data-xc-element='time-grid-time-slot'
                      key={timeSlot.id}
                      className={s.slot}
                    >
                      {props.renderTimeSlot(timeSlot)}
                    </div>
                  ))}
                </div>

                <div
                  data-xc-element='time-grid-slot-separators-layer'
                  className={s.separatorsLayer}
                >
                  {slotIndicators.map((hourIndicator) => (
                    <div
                      data-xc-element='time-grid-slot-separator'
                      className={s.separator}
                      key={hourIndicator.id}
                      data-is-hour={hourIndicator.isHour ? "" : undefined}
                    >
                      <span
                        data-xc-element='time-grid-slot-separator-rule'
                        className={s.separatorRule}
                      />
                    </div>
                  ))}
                </div>

                <div
                  data-xc-element='time-grid-events-layer'
                  className={s.eventsLayer}
                >
                  {eventTilesByColumn[colIdx].eventTiles.map((tile) => (
                    <div
                      data-xc-element='time-grid-event-tile'
                      key={tile.id}
                      className={s.eventTile}
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
