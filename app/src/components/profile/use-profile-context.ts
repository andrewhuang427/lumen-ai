import { useContext } from "react";
import { ProfileContext } from "./profile-context";

export default function useProfileContext() {
  return useContext(ProfileContext);
}
