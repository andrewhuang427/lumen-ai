"use client";

import { type ReactNode, useState } from "react";
import useAuth from "../auth/use-auth";
import { Button } from "../ui/button";
import UserSearchCommand from "./user-search-command";

type Props = {
  label: ReactNode;
};

export default function UserSearchButtonWrapper({ label }: Props) {
  const { user } = useAuth();
  return user ? <UserSearchButton label={label} /> : null;
}

function UserSearchButton({ label }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>{label}</Button>
      <UserSearchCommand open={open} onSetOpen={setOpen} />
    </>
  );
}
