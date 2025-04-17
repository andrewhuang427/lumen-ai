"use client";

import { createContext, type PropsWithChildren } from "react";
import { type FeaturesConfig } from "../../server/posthog/posthog-utils";

const defaultFeatureConfig: FeaturesConfig = {
  placeholder: "",
};

export const PosthogFeatureConfigContext =
  createContext<FeaturesConfig>(defaultFeatureConfig);

export default function PosthogFeatureConfigProvider({
  children,
  featureConfig,
}: PropsWithChildren & { featureConfig: FeaturesConfig }) {
  return (
    <PosthogFeatureConfigContext.Provider value={featureConfig}>
      {children}
    </PosthogFeatureConfigContext.Provider>
  );
}
