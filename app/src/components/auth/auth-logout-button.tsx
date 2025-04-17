"use client";

import { Loader2, LogOut } from "lucide-react";
import { useState } from "react";
import { browserSupabase } from "../../server/supabase/supabase-client";
import { api } from "../../trpc/react";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export default function AuthLogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const utils = api.useUtils();

  async function handleLogout() {
    try {
      setIsLoading(true);
      await browserSupabase().auth.signOut();
      await utils.invalidate();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DropdownMenuItem onClick={handleLogout}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="mr-2 h-4 w-4" />
      )}
      Log out
    </DropdownMenuItem>
  );
}
