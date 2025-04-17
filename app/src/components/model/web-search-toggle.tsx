import { Globe } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import useModelContext from "./use-model-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function WebSearchToggle() {
  const { isWebSearchEnabled, setIsWebSearchEnabled } = useModelContext();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isWebSearchEnabled ? "default" : "outline"}
            onClick={() => setIsWebSearchEnabled(!isWebSearchEnabled)}
            className={cn(
              "rounded-full",
              isWebSearchEnabled
                ? "bg-indigo-500 text-primary hover:bg-indigo-600"
                : "",
            )}
          >
            <Globe className="size-4" />
            {isWebSearchEnabled ? "Search enabled" : "Web search"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Search the web</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
