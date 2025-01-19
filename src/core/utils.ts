import { forwardRef } from "react";

/**
 * Converts an array to map of key:value,
 * any key appearing twice will be overrided by the last value
 */
export function arrayToMap<K extends PropertyKey, T>(
  items: Array<T>,
  keySelector: (item: T, index: number) => K
): Partial<Record<K, T>> {
  const map: Partial<Record<K, T>> = {};
  items.forEach((item, i) => {
    const key = keySelector(item, i);
    map[key] = item;
  });
  return map;
}

/**
 * Clamps a number value between a min and max
 */
export function clamp(min: number, max: number, value: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Checks if two dom rects are overlapping or not.
 */
export function areOverlapping(elementA: Element, elementB: Element): boolean {
  const rectA = elementA.getBoundingClientRect(),
    rectB = elementB.getBoundingClientRect();

  return !(
    rectA.top + rectA.height < rectB.top ||
    rectA.top > rectB.top + rectB.height ||
    rectA.left + rectA.width < rectB.left ||
    rectA.left > rectB.left + rectB.width
  );
}

/**
 * Merges two objects deeply and returns a new object, useful for setting defaults.
 */
export function mergeDefaults<T extends object>(
  obj: Partial<T>,
  defaults: T
): T {
  const result = { ...defaults };

  for (const key in obj) {
    const objValue = obj[key];
    const defaultValue = defaults[key];

    if (objValue === undefined) continue;

    if (
      defaultValue &&
      objValue &&
      typeof defaultValue === "object" &&
      typeof objValue === "object" &&
      !Array.isArray(defaultValue) &&
      !Array.isArray(objValue)
    ) {
      result[key] = mergeDefaults(defaultValue, objValue) as T[Extract<
        keyof T,
        string
      >];
    } else {
      result[key] = objValue as T[typeof key];
    }
  }

  return result;
}

/**
 * Creates a globally unique random number id for any kind of object
 */
export function getNewObjectId(): number {
  return Math.round(Date.now() + Math.random() * 100_000);
}

/**
 * Utility to create generic ref forwarded component.
 */
export function genericForwardRef<T, P = unknown>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode
): (props: P & React.RefAttributes<T>) => React.ReactNode {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return forwardRef(render as any) as any;
}
