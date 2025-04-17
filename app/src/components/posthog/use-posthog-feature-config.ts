import { useContext } from "react";
import { PosthogFeatureConfigContext } from "./posthog-feature-config-provider";

export function usePosthogFeatureConfig() {
  return useContext(PosthogFeatureConfigContext);
}
