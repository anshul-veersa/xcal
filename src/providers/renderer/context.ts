import type {
  TileEvent,
  BaseEvent,
  EventTileRenderFunction,
  HeaderItemRenderFunction,
  TimeSlotRenderFunction,
  BackgroundEvent,
} from "@/types";
import { createContext, useContext } from "react";

type RendererContextType<TileEvent extends BaseEvent, BackgroundEventData> = {
  renderEventTile: EventTileRenderFunction<TileEvent>;
  renderHeaderItem?: HeaderItemRenderFunction;
  renderTimeSlot?: TimeSlotRenderFunction<BackgroundEventData>;
};

export const RendererContext = createContext<RendererContextType<
  TileEvent,
  BackgroundEvent
> | null>(null);

/** Use events and other data */
export function useRenderer() {
  const renderers = useContext(RendererContext);

  if (!renderers) throw new Error("Renderer context is not defined.");

  return renderers;
}
