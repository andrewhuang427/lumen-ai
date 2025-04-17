import { type PropsWithChildren } from "react";
import ProtectedLayout from "../../components/guards/protected-route";

export default function UsernamePageLayout({ children }: PropsWithChildren) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
