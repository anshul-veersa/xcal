import type { RootConfig } from "@/types";
import { createContext, useContext } from "react";

export const ConfigContext = createContext<RootConfig | null>(null);

type ConfigAdapter<T> = (config: RootConfig) => T;

/** Use root user and default configuration */
export function useConfig<T = RootConfig>(withAdapter?: ConfigAdapter<T>): T {
  const config = useContext(ConfigContext);
  if (!config) throw new Error("Config context is not defined.");

  if (withAdapter != null) return withAdapter(config);

  return config as T;
}
