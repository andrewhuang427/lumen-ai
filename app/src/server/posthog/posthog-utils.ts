import { type User as SupabaseUser } from "@supabase/supabase-js";
import { cache } from "react";

export type FeaturesConfig = {
  placeholder: string;
};

export const featuresConfig: FeaturesConfig = {
  placeholder: "",
};

export const getFeatureConfig = cache(
  async (user: SupabaseUser | null): Promise<FeaturesConfig> => {
    if (user == null) {
      return {
        placeholder: "",
      };
    }

    // const _client = getPostHogClient();

    return {
      placeholder: "",
    };
  },
);
