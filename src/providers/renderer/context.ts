import type {
  TileEvent,
  EventTileRenderFunction,
  HeaderItemRenderFunction,
  TimeSlotRenderFunction,
  TimeGridCornerRenderFunction,
} from "@/types";
import { createContext, useContext } from "react";

type RendererContextType = {
  renderEventTile: EventTileRenderFunction<TileEvent>;
  renderHeaderItem?: HeaderItemRenderFunction;
  renderTimeSlot?: TimeSlotRenderFunction;
  renderTimeGridCorner: TimeGridCornerRenderFunction;
};

export const RendererContext = createContext<RendererContextType | null>(null);

/** Use events and other data */
export function useRenderer() {
  const renderers = useContext(RendererContext);

  if (!renderers) throw new Error("Renderer context is not defined.");

  return renderers;
}
