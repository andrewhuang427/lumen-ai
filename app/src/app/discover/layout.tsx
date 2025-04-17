import { type PropsWithChildren } from "react";
import ProtectedRoute from "../../components/guards/protected-route";

type Props = PropsWithChildren;

export default function DiscoverLayout({ children }: Props) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
