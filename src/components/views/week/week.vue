<template>
  <div class="week-view">
    <ColumnGrid
      :activeDate="data.date"
      :columns="columns"
      :config="{
        slotDuration: config.slotDuration,
        hourIndicatorLabelFormat: config.hourIndicatorLabelFormat,
        maxEventsPerSlot: config.maxEventsPerSlot,
        scrollTimeIntoView: config.scrollTimeIntoView,
        showAllDaySlot: config.showAllDaySlot,
        showCurrentTimeMarker: config.showCurrentTimeMarker,
        showSlotIndicators: config.showSlotIndicators,
        showSlotSeparator: config.showSlotSeparator,
        slotHeight: config.slotHeight,
      }"
    >
      <template #header-item="headerItem">
        <div class="week-header-day">
          <span class="week-header-day__name">{{
            t.format(headerItem.date, "EEE")
          }}</span>
          <span class="week-header-day__date">{{
            t.format(headerItem.date, "dd")
          }}</span>
        </div>
      </template>

      <template #event-tile="slotProps">
        <slot name="event-tile" v-bind="slotProps" />
      </template>

      <template #time-slot="slotProps">
        <slot name="time-slot" v-bind="slotProps" />
      </template>
    </ColumnGrid>
  </div>
</template>

<script setup lang="ts" generic="EventData, BGEventData">
import { computed, inject } from "vue";
import { TimeUtils } from "@/core/time";

import { ColumnGrid } from "@/components/abstract-views";
import { keys } from "@/assets/providers/keys";
import { adaptConfig } from "./config";

const t = inject<TimeUtils>(keys.TimeUtils)!;

const xCalConfig = inject(keys.XCalConfig<EventData, BGEventData>())!;
const config = computed(() => adaptConfig(xCalConfig.value));

const data = inject(keys.CalendarData<EventData, BGEventData>())!;

const weekDays = computed(() => {
  return t.eachDayOfInterval({
    start: t.startOfWeek(data.value.date),
    end: t.endOfWeek(data.value.date),
  });
});

const columns = computed(() => {
  return weekDays.value.map((day) => {
    const isToday = t.isSameDay(t.today, day);

    return {
      id: +day,
      date: day,
      header: {
        data: { date: day },
        attributes: {
          "data-week-day": day,
          "data-date": day,
          "data-is-today": isToday,
        },
      },
      events: data.value.events,
      backgroundEvents: data.value.backgroundEvents,
      attributes: { "data-is-today": isToday },
    };
  });
});
</script>

<style scoped lang="scss">
.week-view {
  width: 100%;
  height: 100%;
}

.week-header-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding: 4px 0;

  &__date {
    font-size: 1rem;
  }

  &__name {
    font-size: 0.8rem;
  }
}
</style>
