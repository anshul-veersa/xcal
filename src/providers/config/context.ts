import type { RootConfig } from "@/types";
import { createContext, useContext, useMemo } from "react";

export const ConfigContext = createContext<RootConfig | null>(null);

type ConfigAdapter<T> = (config: RootConfig) => T;

/** Use root user and default configuration */
export function useConfig<T = RootConfig>(withAdapter?: ConfigAdapter<T>): T {
  const configContext = useContext(ConfigContext);
  if (!configContext) throw new Error("Config context is not defined.");

  const config = useMemo(() => {
    if (withAdapter != null) return withAdapter(configContext);
    return configContext;
  }, [configContext, withAdapter]);

  return config as T;
}
