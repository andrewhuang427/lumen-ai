import { type PropsWithChildren } from "react";
import ProtectedRoute from "../../../components/guards/protected-route";

type Props = PropsWithChildren;

export default function StudyLayout({ children }: Props) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
