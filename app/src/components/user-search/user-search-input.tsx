"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useIsMobile } from "../../hooks/use-mobile";
import useAuth from "../auth/use-auth";
import HotKeyText from "../hotkey-text";
import { Button } from "../ui/button";
import UserSearchCommand from "./user-search-command";

export default function UserSearchInputWrapper() {
  const { user } = useAuth();
  return user ? <UserSearchInput /> : null;
}

function UserSearchInput() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        size={isMobile ? "icon" : "sm"}
        variant="outline"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        {!isMobile && (
          <>
            <span className="w-48 text-left font-normal text-muted-foreground">
              Search for a user...
            </span>
            <HotKeyText hotkey="K" modifier="⌘" />
          </>
        )}
      </Button>
      <UserSearchCommand open={open} onSetOpen={setOpen} />
    </>
  );
}
