import type { TileEvent } from "@/types";
import { faker } from "@faker-js/faker";
import {
  addMinutes,
  endOfDay,
  endOfMonth,
  min,
  roundToNearestMinutes,
  startOfDay,
  startOfMonth,
  subMinutes,
} from "date-fns";

const EVENT_SPAN = { min: 60, max: 420 };

export function createEvent<T>(
  between: { from: Date; to: Date },
  data: T
): TileEvent<T> {
  const startsAt = faker.date.between(between);
  const endsAt = min([
    between.to,
    addMinutes(startsAt, faker.number.int(EVENT_SPAN)),
  ]);

  return {
    id: faker.string.uuid(),
    startsAt: roundToNearestMinutes(startsAt),
    endsAt: roundToNearestMinutes(endsAt),
    data,
  };
}

export function createMonthData(
  date: Date,
  count: number
): Array<TileEvent<unknown>> {
  const [from, to] = [startOfMonth(date), endOfMonth(date)];
  return Array.from({ length: count }, () =>
    createEvent(
      { from, to },
      {
        title: faker.airline.airplane().name,
      }
    )
  );
}

export function createDayData(
  date: Date,
  count: number
): Array<TileEvent<{ title: string }>> {
  const [from, to] = [
    addMinutes(startOfDay(date), 0),
    subMinutes(endOfDay(date), 120),
  ];
  return Array.from({ length: count }, () =>
    createEvent(
      { from, to },
      {
        title: faker.airline.airplane().name,
      }
    )
  )
    .toSorted((a, b) => +a.startsAt - +b.startsAt || +b.endsAt - +a.endsAt)
    .map((e, i) => ({ ...e, id: i }));
}
