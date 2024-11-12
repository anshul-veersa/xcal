<template>
  <div class="x-cal">
    <keep-alive :max="2">
      <component :is="activeView.component">
        <template #header-item="slotProps">
          <slot name="header-item" v-bind="slotProps" />
        </template>

        <template #event-tile="slotProps">
          <slot name="event-tile" v-bind="slotProps" />
        </template>

        <template #time-slot="slotProps">
          <slot name="time-slot" v-bind="slotProps" />
        </template>
      </component>
    </keep-alive>
  </div>
</template>

<script setup lang="ts" generic="EventData, BackgroundEventData">
import { provide, computed } from "vue";
import { TimeUtils } from "@/core/time";

import type {
  BackgroundEvent,
  CalendarEvent,
  CommonConfig,
  LocaleOptions,
  View,
} from "@/types";
import {
  Views,
  type DayViewConfig,
  type WeekViewConfig,
} from "@/components/views";
import { keys } from "@/assets/providers/keys";

type Props = {
  /** Array of events to show on the calendar. */
  events: Array<CalendarEvent<EventData>>;
  /** Array of background events with each having a priority */
  backgroundEvents?: Array<BackgroundEvent<BackgroundEventData>>;
  /** Current view to show. */
  view: View;
  /** Current date to show. */
  date?: Date;
  /** Common configuration for the calendar. */
  config?: Partial<CommonConfig>;
  /** View specific config for each view. Takes precedence over common config.  */
  views?: {
    day?: Partial<DayViewConfig>;
    week?: Partial<WeekViewConfig>;
    month?: Partial<{}>;
    group?: Partial<{}>;
  };
  /** Locale and formatting options */
  locale?: Partial<LocaleOptions>;
};

const props = withDefaults(defineProps<Props>(), {
  view: "month",
  events: () => [],
  backgroundEvents: () => [],
  date: () => new Date(),
  config: () => ({}),
  views: () => ({}),
  locale: () => ({}),
});

const emit = defineEmits<{
  eventUpdate: [];
  slotClick: [];
}>();

const calendarData = computed(() => {
  return {
    events: props.events,
    backgroundEvents: props.backgroundEvents,
    date: props.date,
  };
});
provide(keys.CalendarData<EventData, BackgroundEventData>(), calendarData);

const xCalConfig = computed(() => {
  return {
    config: props.config,
    locale: props.locale,
    view: props.view,
    views: {
      day: props.views.day,
      week: props.views.week,
      month: props.views.month,
      group: props.views?.group,
    },
  };
});
provide(keys.XCalConfig<EventData, BackgroundEventData>(), xCalConfig);

provide(
  keys.TimeUtils,
  new TimeUtils({
    options: {
      weekStartsOn: props.locale.weekStartsOn === "sunday" ? 0 : 1,
    },
  })
);

const activeView = computed(() => Views[props.view ?? 'day'] ?? Views['day']);
</script>

<style lang="scss">
@use "@/styles/reset.scss";
@use "@/styles/global.scss";
</style>
