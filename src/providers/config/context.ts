import { createContext, useContext } from "react";

export const ConfigContext = createContext<{} | null>(null);

/** Use root user and default configuration */
export function useConfig() {
  const config = useContext(ConfigContext);
  if (!config) throw new Error("Config context is not defined.");
  return config;
}
