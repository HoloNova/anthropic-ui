import { createContext, useContext } from "react";
import flags from "../data/feature-flags.json";

// 原站由 Next.js 根布局提供 flags；本地用抓取时的配置快照代替。
const FeatureFlagsContext = createContext(flags);

export function FeatureFlagsProvider({ children }) {
  return (
    <FeatureFlagsContext.Provider value={flags}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureEnabled(name) {
  return Boolean(useContext(FeatureFlagsContext)[name]);
}
