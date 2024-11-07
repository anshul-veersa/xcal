<template>
  <div class="day-view">
    <ColumnGrid
      :activeDate="data.date"
      :columns="[dayColumn]"
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
import { ColumnGrid } from "@/components/abstract-views";
import { keys } from "@/assets/providers/keys";
import { adaptConfig } from "./config";

const xCalConfig = inject(keys.XCalConfig<EventData, BGEventData>())!;
const config = computed(() => adaptConfig(xCalConfig.value));

const data = inject(keys.CalendarData<EventData, BGEventData>())!;

const dayColumn = computed(() => {
  return {
    id: data.value.date.getDate(),
    date: data.value.date,
    header: {
      data: {},
      attributes: {},
    },
    events: data.value.events,
    backgroundEvents: data.value.backgroundEvents,
    attributes: {},
  };
});
</script>

<style scoped lang="scss">
.day-view {
  width: 100%;
  height: 100%;
}
</style>
