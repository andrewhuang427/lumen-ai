import Link from "next/link";
import { cn } from "../lib/utils";

type Props = {
  size: number;
  className?: string;
  shouldLink?: boolean;
};

export default function SquareLogo({
  size,
  className,
  shouldLink = true,
}: Props) {
  if (shouldLink) {
    return (
      <Link
        href="/"
        className={cn("text-muted-foreground hover:text-primary", className)}
      >
        <LogoSvg size={size} />
      </Link>
    );
  }
  return <LogoSvg size={size} />;
}

function LogoSvg({ size }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 488 661"
      fill="none"
    >
      <path
        d="M1 217.563C180.16 213.899 236.811 169.745 244.232 1C249.666 190.89 320.671 217.271 487 217.563C308.359 221.742 269.177 346.714 244.232 660C211.191 352.574 180.101 224.744 1 217.563Z"
        fill="currentColor"
        stroke="currentColor"
      />
    </svg>
  );
}
