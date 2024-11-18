import s from "./styles.module.scss";

export function DayViewTile({
  tile,
}: {
  tile: { event: { data: { title: string; color: string } } };
}) {
  return <div className={s["event-tile-content"]}>{tile.event.data.title}</div>;
}
