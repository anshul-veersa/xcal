<template>
  <div class="month-view">
    <div class="month-layout">
      <header class="month-header">
        <div
          v-for="weekDay in weekDays"
          :key="weekDay.name"
          :data-week-day="weekDay.name"
        >
          {{ weekDay.label }}
        </div>
      </header>

      <div
        v-for="week in monthWeeks"
        :key="week.id"
        class="month-week"
        :data-week="week.id"
      >
        <div class="week-layout__cells">
          <div
            v-for="day in week.days"
            :key="day.id"
            :class="[{ today: day.isToday }, 'day-cell']"
            :data-date="day.id"
          >
            <div class="day-cell__info">
              <span class="date-label">{{ day.label }}</span>
            </div>

            <div class="day-cell__footer"></div>
          </div>
        </div>

        <div class="week-layout__overlay">
          <div
            v-for="tile in layoutEventTiles[week.id].eventTiles"
            :key="tile.id"
            class="overlay__tile"
            :style="{
              gridColumnStart: tile.geometry.xStart,
              gridColumnEnd: tile.geometry.xEnd,
            }"
          >
            <slot name="event-tile" v-bind="{ event: tile.event, tile }" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="EventData, BGEventData">
import { computed, inject } from "vue";
import { MonthTiler } from "@/core/tilers";
import { keys } from "@/assets/providers/keys";
import { adaptConfig } from "./config";

const t = inject(keys.TimeUtils)!;

const xCalConfig = inject(keys.XCalConfig<EventData, BGEventData>())!;
const config = computed(() => adaptConfig(xCalConfig.value));

const data = inject(keys.CalendarData<EventData, BGEventData>())!;

const weekDays = computed(() => {
  return t.daysOfWeek().map((d) => ({ ...d, label: d.label.toUpperCase() }));
});

/**
 * Dates of the month arranged week wise with specified locale.
 */
type MonthWeeks = Array<{
  id: number;
  days: Array<{
    id: string;
    date: Date;
    label: string;
    isToday: boolean;
  }>;
}>;
const monthWeeks = computed<MonthWeeks>(() => {
  const calendarStart = t.startOfWeek(t.startOfMonth(data.value.date));
  const calendarEnd = t.endOfWeek(t.endOfMonth(data.value.date));

  const datesOnCalendar = t.eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const weeklyDates: Record<number, MonthWeeks[number]> = {};
  for (let d = 0; d < datesOnCalendar.length; d += 7) {
    const week = t.getWeek(datesOnCalendar[d]);
    const days = datesOnCalendar.slice(d, d + 7).map((d) => ({
      id: t.format(d, "yyyy-MM-dd"),
      date: d,
      label: t.format(d, "d"),
      isToday: t.isSameDay(d, t.today),
    }));
    weeklyDates[week] = {
      id: week,
      days,
    };
  }
  return Object.values(weeklyDates);
});

/**
 * Flat array of each date shown on the calendar.
 */
const calendarDates = computed(() => {
  return Object.entries(monthWeeks.value).flatMap(([_, d]) => d.days);
});

const tiler = new MonthTiler({ maxPerSlot: config.value.maxEventsPerSlot }, t);
/**
 * Record of event tiles in series for each week of the month.
 * Used with CSS grid to place on the week layout.
 */
const layoutEventTiles = computed(() => {
  const layoutTiles = tiler.getLayoutTiles(data.value.events, {
    range: {
      from: calendarDates.value.at(0)!.date,
      to: calendarDates.value.at(-1)!.date,
    },
  });

  return layoutTiles;
});
</script>

<style scoped lang="scss">
.month-view {
  overflow-y: auto;
  height: 100%;
  width: 100%;
}

.month-layout {
  display: flex;
  flex-flow: column nowrap;

  border: 0.5px solid rgb(216, 216, 216);
}

.month-week {
  display: grid;
  grid-template-columns: 1fr;

  &__cells,
  &__overlay {
    display: grid;
    grid-template-columns: repeat(7, minmax(calc(100% / 7), 1fr));
  }

  .week-layout__cells {
    display: grid;
    grid-template-columns: repeat(7, minmax(calc(100% / 7), 1fr));
    grid-row-start: 1;
    grid-column-start: 1;

    min-height: 160px;
    width: 100%;
  }

  .week-layout__overlay {
    display: grid;
    grid-template-columns: repeat(7, minmax(calc(100% / 7), 1fr));
    grid-row-start: 1;
    grid-column-start: 1;

    width: 100%;
    top: 0;
    left: 0;
    grid-auto-rows: min-content;
    z-index: 1;

    pointer-events: none;

    margin: 32px 0;
    padding-bottom: 4px;

    overflow: hidden;
  }
}

.week-layout__cells {
  .day-cell {
    width: 100%;
    height: 100%;

    border: 0.75px solid #e5e5e5;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}

.day-cell {
  &__info {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 8px 12px;
    height: 32px;
    position: sticky;
    top: 0;
    z-index: 4;
    background-color: #fff;

    .date-label {
      font-size: 14px;
      font-weight: 400;
      line-height: 1;
    }
  }

  &__footer {
    padding: 8px;
    font-size: 12px;
    display: flex;
    justify-content: flex-end;

    span {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 0 8px;
      border-radius: 40px;

      svg {
        width: 12px;
      }

      &:hover {
        background-color: rgb(228, 234, 234);
      }
    }
  }

  &.today {
    // outline: 2px solid #0015ff21;
    outline-offset: -2.5px;

    .date-label {
      width: 24px;
      height: 24px;
      display: grid;
      place-items: center;
      border-radius: 100px;
      color: #fff;
      background-color: #015cbb;
    }
  }
}

.overlay__tile {
  pointer-events: all;
  margin: 1px 3px;
}

.month-header {
  display: flex;
  width: 100%;
  background-color: #f4f4f4;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.67);

  div {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 24px;
  }
}
</style>
