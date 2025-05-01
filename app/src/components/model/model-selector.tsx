import { UserTier } from "@prisma/client";
import { Loader2, SparklesIcon } from "lucide-react";
import { type ModelType } from "../../server/utils/model-config";
import useAuth from "../auth/use-auth";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import useModelContext from "./use-model-context";

export function ModelSelector() {
  const { availableModels, isLoadingAvailableModels, model, setModel } =
    useModelContext();
  const { user } = useAuth();

  return (
    <Select
      value={model as string}
      onValueChange={(value) => setModel(value as ModelType)}
      disabled={isLoadingAvailableModels}
    >
      <SelectTrigger className="flex w-48 items-center bg-background">
        {isLoadingAvailableModels && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        <SelectValue>
          {model === "lite" && (
            <div className="flex items-center gap-2">
              <div>{availableModels.find((m) => m.type === "lite")?.name}</div>
            </div>
          )}
          {model === "pro" && (
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-3.5 w-3.5 text-yellow-500" />
              <div>{availableModels.find((m) => m.type === "pro")?.name}</div>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel className="flex flex-col gap-1 text-muted-foreground">
            <span className="font-medium">Select a model</span>
            {user?.tier === UserTier.FREE && (
              <span className="flex items-center gap-1 text-xs font-normal text-muted-foreground">
                <SparklesIcon className="mr-1 h-3.5 w-3.5 text-yellow-500" />
                Upgrade to Lumen Pro to access all models
              </span>
            )}
          </SelectLabel>
          {availableModels.map((model) => (
            <SelectItem key={model.type} value={model.type}>
              <div className="flex flex-col gap-1 p-2">
                <div className="flex items-center gap-2">
                  {model.type === "pro" && (
                    <SparklesIcon className="h-3.5 w-3.5 text-yellow-500" />
                  )}
                  {model.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {model.description}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
