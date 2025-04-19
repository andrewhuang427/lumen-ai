"use client";

import { ChevronsUpDown, Loader2, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { browserSupabase } from "../../server/supabase/supabase-client";
import { api } from "../../trpc/react";
import useAuth from "../auth/use-auth";

export default function AppSidebarUserMenu() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { dbUser } = useAuth();
  const { isMobile } = useSidebar();
  const utils = api.useUtils();

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await browserSupabase().auth.signOut();
      await utils.invalidate();
    } finally {
      setIsLoggingOut(false);
    }
  }

  if (dbUser == null) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={dbUser.avatar_url ?? undefined}
                  alt="User avatar"
                />
                <AvatarFallback className="rounded-lg">
                  {dbUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{dbUser.name}</span>
                <span className="truncate text-xs">@{dbUser.username}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={dbUser.avatar_url ?? undefined}
                    alt="User avatar"
                  />
                  <AvatarFallback className="rounded-lg">
                    {dbUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{dbUser.name}</span>
                  <span className="truncate text-xs">@{dbUser.username}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={`/@${dbUser.username}`}>
              <DropdownMenuItem>
                <User className="mr-1 h-4 w-4" />
                Profile
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={handleLogout}>
              {isLoggingOut ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-1 h-4 w-4" />
              )}
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
