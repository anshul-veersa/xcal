<template>
  <div
    ref="markerRef"
    class="current-time-marker"
    :style="{ top: markerPosition, '--bead-offset': (beadAt ?? 0) * 100 + '%' }"
  >
    <span>{{ t.format(now, "HH:mm") }}</span>
  </div>
</template>

<script setup lang="ts" generic="T">
import { computed, inject, onUnmounted, ref, watch } from "vue";
import { TimeUtils } from "@/core/time";
import { areOverlapping } from "@/core/utils";

const props = defineProps<{
  beadAt?: number;
  hideSelectorsOnOverlap?: string[];
}>();

const t = inject<TimeUtils>("time_utils")!;

const markerRef = ref<HTMLElement>();

const now = ref(t.now);
const timerId = setInterval(() => {
  now.value = t.now;
}, 1000);
onUnmounted(() => {
  clearInterval(timerId);
});

const markerPosition = computed(() => {
  const elapsedMinutes = t.getMinutesPassedInDay(t.now);
  return `${((elapsedMinutes / t.minutesInDay) * 100).toFixed(1)}%`;
});

const elementsToHide = computed(() => {
  markerPosition.value;
  if (!markerRef.value) return [];

  const elements: HTMLElement[] =
    props.hideSelectorsOnOverlap?.flatMap((selector) =>
      Array.from(document.querySelectorAll(selector))
    ) ?? [];

  const markerTime = markerRef.value.querySelector("span");

  return elements.filter((element) => {
    const overlap = areOverlapping(markerTime!, element);
    return overlap;
  });
});

watch(
  elementsToHide,
  (newElementsToHide, oldHiddenElements) => {
    oldHiddenElements?.forEach(
      (element) => (element.style.visibility = "visible")
    );
    newElementsToHide.forEach(
      (element) => (element.style.visibility = "hidden")
    );
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.current-time-marker {
  --marker-color: #e32f2f;

  height: 2px;
  width: calc(100%);
  background-color: var(--marker-color);
  position: absolute;

  &::before {
    content: "";
    position: absolute;
    left: var(--bead-offset);
    top: 50%;
    transform: translateY(-50%);
    border-radius: 100px;
    width: 10px;
    height: 10px;
    background-color: var(--marker-color);
  }

  span {
    color: var(--marker-color);
    font-weight: 500;
    position: absolute;
    top: 50%;
    left: -48px;
    transform: translateY(-50%);
    font-size: 14px;
  }
}
</style>
