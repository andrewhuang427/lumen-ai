import { type PropsWithChildren } from "react";
import ProtectedRoute from "../../components/guards/protected-route";

export default function ChatLayout({ children }: PropsWithChildren) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
