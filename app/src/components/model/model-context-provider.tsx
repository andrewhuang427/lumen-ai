"use client";

import { type PropsWithChildren, useEffect, useMemo, useState } from "react";
import { type ModelType } from "../../server/utils/model-config";
import { api } from "../../trpc/react";
import useAuth from "../auth/use-auth";
import { ModelContext } from "./model-context";
type Props = PropsWithChildren;

export default function ModelContextProvider({ children }: Props) {
  const [model, setModel] = useState<ModelType | null>(null);
  const [isWebSearchEnabled, setIsWebSearchEnabled] = useState(false);

  const { user } = useAuth();
  const { data, isLoading: isLoadingAvailableModels } =
    api.user.getAvailableModels.useQuery(undefined, {
      enabled: user != null,
    });

  useEffect(() => {
    const defaultModel = data?.defaultModel.type;
    if (defaultModel != null && !model) {
      setModel(defaultModel);
    }
  }, [data, model]);

  const value = useMemo(
    () => ({
      availableModels: data?.models ?? [],
      defaultModel: data?.defaultModel ?? null,
      isWebSearchEnabled,
      isLoadingAvailableModels,
      model,
      setModel,
      setIsWebSearchEnabled,
    }),
    [data, isWebSearchEnabled, isLoadingAvailableModels, model],
  );

  return (
    <ModelContext.Provider value={value}>{children}</ModelContext.Provider>
  );
}
