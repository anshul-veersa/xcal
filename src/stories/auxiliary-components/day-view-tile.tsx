import type { EventTileRenderFunction, TileEvent } from "@/types";
import s from "./styles.module.scss";
import { format } from "date-fns";

export const DayViewTile: EventTileRenderFunction<
  TileEvent<{ title: string }>
> = ({ view, data: tile }) => {
  return (
    <div
      className={s["event-tile-content"]}
      data-start={format(tile.event.startsAt, "HH:mm dd/MM/yyy")}
      data-end={format(tile.event.endsAt, "HH:mm dd/MM/yyy")}
    >
      - {tile.event.data.title} <br />- {tile.event.id.toString().slice(0, 5)}{" "}
      <br />- {format(tile.event.startsAt, "HH:mm dd/MM/yyy")}
      <br />- {format(tile.event.endsAt, "HH:mm dd/MM/yyy")}
    </div>
  );
};
