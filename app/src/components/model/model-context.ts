import { createContext } from "react";
import { type AvailableModel } from "../../server/services/user-service";
import { type ModelType } from "../../server/utils/model-config";

export type ModelContextType = {
  availableModels: AvailableModel[];
  defaultModel: AvailableModel | null;
  isLoadingAvailableModels: boolean;
  model: ModelType | null;
  isWebSearchEnabled: boolean;
  setModel: (model: ModelType | null) => void;
  setIsWebSearchEnabled: (isWebSearchEnabled: boolean) => void;
};

export const ModelContext = createContext<ModelContextType>({
  availableModels: [],
  defaultModel: null,
  isLoadingAvailableModels: false,
  model: null,
  isWebSearchEnabled: false,
  setModel: () => {},
  setIsWebSearchEnabled: () => {},
});
