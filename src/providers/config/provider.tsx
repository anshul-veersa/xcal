import type { RootConfig } from "@/types";
import { ConfigContext } from "./context";

export function ConfigProvider(props: {
  config: RootConfig;
  children: React.ReactNode;
}) {
  return (
    <ConfigContext.Provider value={props.config}>
      {props.children}
    </ConfigContext.Provider>
  );
}
