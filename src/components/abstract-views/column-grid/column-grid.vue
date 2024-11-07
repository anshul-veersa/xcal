<template>
  <div class="column-grid-layout">
    <div class="corner"></div>

    <div class="header" data-scroll-sync="x">
      <div class="header-items">
        <div
          v-for="column in props.columns"
          :key="column.id"
          class="header-item"
          v-bind="column.header.attributes"
        >
          <slot name="header-item" v-bind="column.header.data" />
        </div>
      </div>
    </div>

    <div class="content" data-scroll-sync="x">
      <div class="content-layout">
        <div class="time-indicators">
          <div
            class="time-indicator"
            v-for="indicator in slotIndicators"
            :key="indicator.id"
            :data-is-hour="indicator.isHour"
            :data-scroll-into-view="indicator.scrollIntoView"
          >
            <span class="time-indicator__label">{{ indicator.label }}</span>
            <div class="time-indicator__rule" />
          </div>
        </div>
        <div class="columns">
          <div
            v-for="(column, colIdx) in columns"
            class="column"
            v-bind="column.attributes"
          >
            <div class="slots-layer">
              <div
                v-for="timeSlot in slotsByColumn[colIdx].slots"
                :key="timeSlot.id"
                class="slot"
              >
                <slot name="time-slot" v-bind="{ timeSlot }" />
              </div>
            </div>

            <div class="separators-layer">
              <div
                class="separator"
                v-for="hourIndicator in slotIndicators"
                :key="hourIndicator.id"
                :data-is-hour="hourIndicator.isHour"
              >
                <span class="separator__rule"></span>
              </div>
            </div>

            <div class="events-layer">
              <div
                v-for="tile in eventTilesByColumn[colIdx].eventTiles"
                :key="tile.id"
                class="event-tile"
                :style="{
                  gridRowStart: tile.geometry.yStart + 1,
                  gridRowEnd: tile.geometry.yEnd + 1,
                  width: `calc(${
                    tile.geometry.width * 100
                  }% - (var(--tile-gap) * 2))`,
                  left: `calc(${
                    tile.geometry.xOffset * 100
                  }% + var(--tile-gap))`,
                }"
              >
                <slot name="event-tile" v-bind="{ event: tile.event, tile }" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
  generic="TileEventData, BackgroundEventData, HeaderData"
>
import { computed, inject, onMounted, onUnmounted, ref } from "vue";
import type { BackgroundEvent, CalendarEvent, SlotDuration } from "@/types";
import { TimeUtils } from "@/core/time";
import { DayTiler } from "@/core/tilers";
import { ScrollSync } from "@/core/scroll-sync";
import { keys } from "@/assets/providers/keys";

const props = defineProps<{
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
}>();

const t = inject<TimeUtils>(keys.TimeUtils)!;

const computedConfig = computed(() => {
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
});

const tiler = new DayTiler(
  {
    maxPerSlot: props.config.maxEventsPerSlot,
    slotDuration: props.config.slotDuration,
  },
  t
);
const eventTilesByColumn = computed(() => {
  return props.columns.map((column) => {
    return {
      id: column.id,
      eventTiles: tiler.getLayoutTiles(column.events, { date: column.date }),
    };
  });
});

const slotsByColumn = computed(() => {
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
      slots: Array.from({ length: computedConfig.value.totalSlots }, (_, i) => {
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
});

const slotIndicators = computed(() => {
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
});

const scrollSync = ref<ScrollSync>();
onMounted(() => {
  scrollSync.value = new ScrollSync("data-scroll-sync");
  scrollSync.value.mount();

  document.querySelector(`[data-scroll-into-view="true"]`)?.scrollIntoView();
});
onUnmounted(() => scrollSync.value?.destroy());
</script>

<style lang="scss" scoped>
.column-grid-layout {
  --slots-count: v-bind("computedConfig.totalSlots");
  --slot-height: calc(v-bind("config.slotHeight") * 1px);
  --slot-background: #fbfbfb;
  --slot-active-background: #d5eaea79;
  --slot-gutter: 5%;

  --indicators-count: v-bind("slotIndicators.length");

  --content-breathing-space: 16px 0;

  --side-bar-background: #fff;
  --side-bar-width: 100px;
  --column-min-width: 100px;

  --header-background: #fff;

  --separator-color: rgba(0, 0, 0, 0.2);
  --separator-color-secondary: rgba(0, 0, 0, 0.05);
  --separator-thickness: 1px;

  --tile-gap: 2px;
  --tile-min-width: 10px;
}

.column-grid-layout {
  display: grid;
  grid-template: auto 1fr / var(--side-bar-width) 1fr;
  height: 100%;
}

.content {
  grid-row: 2 / -1;
  grid-column: 1 / -1;
  overflow-y: auto;
}

.content-layout {
  position: relative;
  display: grid;
  grid-template-columns: var(--side-bar-width) 1fr;
}

.content-layout {
  .indicators {
    grid-column: 1 / 2;
  }
  .columns {
    grid-column: 2 / 3;
  }
}

.time-indicators {
  display: grid;
  grid-template-rows: repeat(
    calc(var(--indicators-count) - 1),
    calc(
      var(--slots-count) * var(--slot-height) / (var(--indicators-count) - 1)
    )
  );
  left: 0;
  position: sticky;
  z-index: 1;
  border-right: var(--separator-thickness) solid var(--separator-color);
  background-color: var(--side-bar-background);
  padding: var(--content-breathing-space);

  .time-indicator {
    display: flex;
    align-items: center;
    height: 0px;

    &__label {
      flex-shrink: 0;
      text-align: right;
      margin-right: 16px;
      width: 64%;
    }

    &__rule {
      width: 100%;
      height: var(--separator-thickness);
      background-color: var(--separator-color);
    }

    &:not([data-is-hour]) {
      .time-indicator__rule {
        background-color: var(--separator-color-secondary);
      }

      .time-indicator__label {
        font-size: 0.8rem;
      }
    }
  }
}

.columns {
  display: flex;

  .column {
    padding: var(--content-breathing-space);
    background-color: var(--slot-background);

    flex: 1 1 0;
    min-width: var(--column-min-width);
    display: grid;

    &:not(:last-child) {
      border-right: var(--separator-thickness) solid var(--separator-color);
    }

    .separators-layer {
      pointer-events: none;
      grid-row-start: 1;
      grid-column-start: 1;
      display: grid;

      grid-template-rows: repeat(
        calc(var(--indicators-count) - 1),
        calc(
          var(--slots-count) * var(--slot-height) /
            (var(--indicators-count) - 1)
        )
      );
      .separator {
        display: flex;
        align-items: center;
        height: 0px;

        &__rule {
          width: 100%;
          height: var(--separator-thickness);
          background-color: var(--separator-color);
        }

        &:not([data-is-hour]) {
          .separator__rule {
            background-color: var(--separator-color-secondary);
          }
        }
      }
    }

    .slots-layer,
    .events-layer {
      grid-row-start: 1;
      grid-column-start: 1;
      display: grid;
      grid-template-rows: repeat(var(--slots-count), var(--slot-height));
    }

    .events-layer {
      padding-right: var(--slot-gutter);
      pointer-events: none;
      .event-tile {
        grid-column-start: 1;
        position: relative;
        margin: var(--tile-gap) 0;
        min-width: var(--tile-min-width);
        pointer-events: all;
      }
    }

    .slots-layer {
      .slot {
        &:hover {
          background-color: var(--slot-active-background);
        }
      }
    }
  }
}

.corner {
  border-bottom: 1px solid var(--separator-color);
}

.header {
  grid-row: 1 / 2;
  grid-column: 2 / -1;
  background-color: var(--header-background);

  &::-webkit-scrollbar {
    display: none;
  }

  .header-items {
    display: flex;
    .header-item {
      flex: 1 1 0;
      min-width: var(--column-min-width);
    }
  }
}

[data-scroll-sync="all"],
[data-scroll-sync="x"] {
  overflow-x: auto;
}

[data-scroll-sync="all"],
[data-scroll-sync="y"] {
  overflow-y: auto;
}
</style>
