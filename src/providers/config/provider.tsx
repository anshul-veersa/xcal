import { ConfigContext } from "./context";

export function ConfigProvider(props: {
  config: number;
  children: React.ReactNode;
}) {
  return (
    <ConfigContext.Provider value={timeUtils}>
      {props.children}
    </ConfigContext.Provider>
  );
}
