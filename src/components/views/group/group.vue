<template>
  <div class="group-view">
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
      <template #header-item="slotProps">
        <slot name="header-item" v-bind="slotProps" />
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

import { groupBy } from "@/core/utils";

import { ColumnGrid } from "@/components/abstract-views";
import { keys } from "@/assets/providers/keys";
import { adaptConfig } from "./config";

const xCalConfig = inject(keys.XCalConfig<EventData, BGEventData>())!;
const config = computed(() => adaptConfig(xCalConfig.value));

const data = inject(keys.CalendarData<EventData, BGEventData>())!;

const groups = computed(() => {
  const eventsByGroup = groupBy(data.value.events, config.value.groupSelector);
  const backgroundEventsByGroup = groupBy(
    data.value.backgroundEvents,
    config.value.groupSelector
  );

  const combinedGroupIds = Array.from(
    new Set([
      ...Object.keys(eventsByGroup),
      ...Object.keys(backgroundEventsByGroup),
    ])
  );

  const sortedGroups = config.value.groupOrderer(
    combinedGroupIds.map((groupId) => ({
      id: groupId,
      events: eventsByGroup[groupId] ?? [],
      backgroundEvents: backgroundEventsByGroup[groupId] ?? [],
    }))
  );

  return sortedGroups;
});

const columns = computed(() => {
  return groups.value.map((group) => {
    return {
      id: group.id,
      date: data.value.date,
      header: { data: { groupId: group.id } },
      events: group.events,
      backgroundEvents: group.backgroundEvents ?? [],
    };
  });
});
</script>

<style scoped lang="scss">
.group-view {
  width: 100%;
  height: 100%;
}
</style>
