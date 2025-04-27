"use client";

import { Loader, UserIcon } from "lucide-react";
import { useIsMobile } from "../../hooks/use-mobile";
import { cn } from "../../lib/utils";
import AuthDialog from "../auth/auth-dialog";
import useAuth from "../auth/use-auth";
import SquareLogo from "../square-logo";
import { Separator } from "../ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from "../ui/sidebar";
import AppSidebarFooterLinks from "./app-sidebar-footer-links";
import AppSidebarUserContent from "./app-sidebar-user-content";
import AppSidebarUserMenu from "./app-sidebar-user-menu";

export default function AppSidebar() {
  const { user, isLoading } = useAuth();
  const isMobile = useIsMobile();

  return (
    <Sidebar
      collapsible="offcanvas"
      variant={isMobile ? "sidebar" : "inset"}
      className="bg-sidebar"
    >
      <SidebarHeader
        className={cn(
          "flex flex-row items-center gap-2 py-4 transition-all duration-300 ease-in-out",
        )}
      >
        <SquareLogo size={30} className="shrink-0" />
        <div className="grow" />
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        {isLoading && user == null ? (
          <LoadingSidebarGroup />
        ) : user == null ? (
          <SignInSidebarGroup />
        ) : (
          <AppSidebarUserContent />
        )}
      </SidebarContent>
      <SidebarFooter>
        {user != null && (
          <>
            <AppSidebarUserMenu />
            <Separator />
          </>
        )}
        <AppSidebarFooterLinks />
      </SidebarFooter>
    </Sidebar>
  );
}

function LoadingSidebarGroup() {
  return (
    <SidebarGroup className="grow">
      <div className="flex h-full w-full items-center justify-center">
        <Loader className="size-4 animate-spin" />
      </div>
    </SidebarGroup>
  );
}

function SignInSidebarGroup() {
  return (
    <SidebarGroup>
      <div className="mb-4 px-2 text-sm text-muted-foreground">
        Sign in or create an account to start using Lumen.
      </div>
      <SidebarMenu>
        <AuthDialog
          trigger={
            <SidebarMenuButton variant="outline" tooltip="Sign in">
              <UserIcon className="size-4" />
              <span>Sign in</span>
            </SidebarMenuButton>
          }
        />
      </SidebarMenu>
    </SidebarGroup>
  );
}
