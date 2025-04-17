import { Loader2 } from "lucide-react";

import { Button, type ButtonProps } from "./ui/button";

type Props = {
  isLoading: boolean;
  label: string;
  loadingLabel: string;
} & ButtonProps;

export default function LoadingButton({
  isLoading,
  label,
  loadingLabel,
  ...props
}: Props) {
  return (
    <Button disabled={isLoading} {...props}>
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" />
          <span className="ml-2">{loadingLabel}</span>
        </>
      ) : (
        label
      )}
    </Button>
  );
}
