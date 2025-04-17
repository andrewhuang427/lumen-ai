import Image from "next/image";
import { squareLogo } from "../assets";
import { cn } from "../lib/utils";
import Link from "next/link";

type Props = {
  size: number;
  className?: string;
};

export default function SquareLogo({ size, className }: Props) {
  return (
    <div
      className={cn(
        "cursor-pointer rounded-sm border bg-white hover:border-2 hover:border-blue-500",
        className,
      )}
      style={{ height: size, width: size }}
    >
      <Link href="/">
        <Image src={squareLogo} height={size} alt="company logo" />
      </Link>
    </div>
  );
}
