import { format } from "date-fns";
import s from "./styles.module.scss";
import type { EventTileRenderFunction, TileEvent } from "@/types";

export const MonthViewTile: EventTileRenderFunction<
  TileEvent<{ title: string }>
> = (props) => {
  if (props.view !== "month") return null;

  return (
    <div
      className={s["month-view-tile"]}
      data-start={format(props.data.event.startsAt, "HH:mm dd/MM/yyy")}
      data-end={format(props.data.event.endsAt, "HH:mm dd/MM/yyy")}
    >
      <div className={s["tile-vertical-bar"]}></div>
      <div className={s["content"]}>
        <span className={s["title"]}>{props.data.event.data.title}</span>

        {Math.random() > 0.7 ? (
          <svg
            className={s["icon"]}
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 -960 960 960'
            fill='#89a3e1'
          >
            <path d='M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v240h-80v-80H200v400h280v80H200ZM760 0q-73 0-127.5-45.5T564-160h62q13 44 49.5 72T760-60q58 0 99-41t41-99q0-58-41-99t-99-41q-29 0-54 10.5T662-300h58v60H560v-160h60v57q27-26 63-41.5t77-15.5q83 0 141.5 58.5T960-200q0 83-58.5 141.5T760 0ZM200-640h560v-80H200v80Zm0 0v-80 80Z' />
          </svg>
        ) : null}

        <span className={s["time"]}>
          {format(props.data.event.startsAt, "hh:mm a")}
        </span>
      </div>
    </div>
  );
};
