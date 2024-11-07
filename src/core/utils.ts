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

export function clamp(min: number, max: number, value: number) {
  return Math.min(Math.max(value, min), max);
}

export function groupBy<K extends PropertyKey, T>(
  items: Array<T>,
  keySelector: (item: T, index: number) => K
): Partial<Record<K, T[]>> {
  const group: Partial<Record<K, T[]>> = {};
  items.forEach((item, i) => {
    const key = keySelector(item, i);
    if (!group[key]) group[key] = [];
    group[key].push(item);
  });
  return group;
}

export function areOverlapping(elementA: Element, elementB: Element) {
  const rectA = elementA.getBoundingClientRect(),
    rectB = elementB.getBoundingClientRect();

  return !(
    rectA.top + rectA.height < rectB.top ||
    rectA.top > rectB.top + rectB.height ||
    rectA.left + rectA.width < rectB.left ||
    rectA.left > rectB.left + rectB.width
  );
}
