"use client";

import { UserIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import AuthDialog from "../auth/auth-dialog";
import useAuth from "../auth/use-auth";
import SquareLogo from "../square-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from "../ui/sidebar";
import AppSidebarContent from "./app-sidebar-content";
import AppSidebarFooter from "./app-sidebar-footer";
import { useIsMobile } from "../../hooks/use-mobile";

export default function AppSidebar() {
  const { user } = useAuth();
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
      {user != null ? (
        <>
          <AppSidebarContent />
          <AppSidebarFooter />
        </>
      ) : (
        <SidebarContent>
          <SidebarGroup>
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
        </SidebarContent>
      )}
    </Sidebar>
  );
}
