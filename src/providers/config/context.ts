import type { RootConfig } from "@/types";
import { createContext, useContext } from "react";

export const ConfigContext = createContext<RootConfig<unknown, unknown> | null>(
  null
);

type ConfigAdapter<T> = (config: RootConfig<unknown, unknown>) => T;

/** Use root user and default configuration */
export function useConfig<T>(withAdapter?: ConfigAdapter<T>) {
  const config = useContext(ConfigContext);
  if (!config) throw new Error("Config context is not defined.");

  if (withAdapter != null) return withAdapter(config);

  return config;
}
