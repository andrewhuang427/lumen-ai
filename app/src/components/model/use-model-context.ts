import { useContext } from "react";
import { ModelContext, type ModelContextType } from "./model-context";

export default function useModelContext(): ModelContextType {
  return useContext(ModelContext);
}
