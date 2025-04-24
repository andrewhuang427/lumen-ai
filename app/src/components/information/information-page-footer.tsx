import Link from "next/link";
import { Separator } from "../ui/separator";

export default function InformationPageFooter() {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-muted-foreground/80"
      >
        Home
      </Link>
      <Separator orientation="vertical" className="h-3" />
      <Link
        href="/about"
        className="text-sm text-muted-foreground hover:text-muted-foreground/80"
      >
        About
      </Link>
      <Separator orientation="vertical" className="h-3" />
      <Link
        href="/terms"
        className="text-sm text-muted-foreground hover:text-muted-foreground/80"
      >
        Terms of Service
      </Link>
      <Separator orientation="vertical" className="h-3" />
      <Link
        href="/privacy"
        className="text-sm text-muted-foreground hover:text-muted-foreground/80"
      >
        Privacy Policy
      </Link>
    </div>
  );
}
