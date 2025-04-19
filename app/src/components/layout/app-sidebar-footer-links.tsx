import Link from "next/link";
import { Separator } from "../ui/separator";

export default function AppSidebarFooterLinks() {
  return (
    <div className="mt-2 flex items-center gap-2">
      <Link href="/">
        <p className="text-xs text-muted-foreground hover:text-muted-foreground/80">
          Home
        </p>
      </Link>
      <Separator orientation="vertical" className="h-3" />
      <Link href="/about">
        <p className="text-xs text-muted-foreground hover:text-muted-foreground/80">
          About
        </p>
      </Link>
      <Separator orientation="vertical" className="h-3" />
      <Link href="/terms">
        <p className="text-xs text-muted-foreground hover:text-muted-foreground/80">
          Terms
        </p>
      </Link>
      <Separator orientation="vertical" className="h-3" />
      <Link href="/privacy">
        <p className="text-xs text-muted-foreground hover:text-muted-foreground/80">
          Privacy
        </p>
      </Link>
    </div>
  );
}
