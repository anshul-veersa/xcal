import type { EventTileRenderFunction } from "@/types";
import type { CalendarData } from "@/types/data";
import { createContext, useContext } from "react";

export const RendererContext = createContext<{
  renderEventTile: EventTileRenderFunction;
} | null>(null);

/** Use events and other data */
export function useData() {
  const renderers = useContext(RendererContext);
  if (!renderers) throw new Error("Renderer context is not defined.");
  return renderers;
}
