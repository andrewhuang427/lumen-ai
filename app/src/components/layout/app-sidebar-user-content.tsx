"use client";

import {
  BookOpen,
  Check,
  ChevronRight,
  Globe,
  MessageCircle,
  Notebook,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { api } from "../../trpc/react";
import BibleStudyCreateDialog from "../bible-study/bible-study-create-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Separator } from "../ui/separator";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";

export default function AppSidebarUserContent() {
  const path = usePathname();

  return (
    <>
      <SidebarGroup className="shrink-0 overflow-hidden">
        <SidebarGroupLabel>General</SidebarGroupLabel>
        <SidebarMenu>
          <Link href="/" prefetch={true}>
            <SidebarMenuItem>
              <CustomSidebarMenuButton tooltip="Read" isActive={path === "/"}>
                <BookOpen className={`${path === "/" ? "text-primary" : ""}`} />
                <span className="truncate">Read</span>
              </CustomSidebarMenuButton>
            </SidebarMenuItem>
          </Link>
          <Link href="/chat" prefetch={true}>
            <SidebarMenuItem>
              <CustomSidebarMenuButton
                tooltip="Chat"
                isActive={path.includes("/chat")}
              >
                <MessageCircle
                  className={`${path.includes("/chat") ? "text-primary" : ""}`}
                />
                <span className="truncate">Chat</span>
              </CustomSidebarMenuButton>
            </SidebarMenuItem>
          </Link>
          <Link href="/discover" prefetch={true}>
            <SidebarMenuItem>
              <CustomSidebarMenuButton
                tooltip="Discover"
                isActive={path.includes("/discover")}
              >
                <Globe
                  className={`${path.includes("/discover") ? "text-primary" : ""}`}
                />
                <span className="truncate">Discover</span>
              </CustomSidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        </SidebarMenu>
      </SidebarGroup>
      <Separator />
      <SidebarGroup className="overflow-hidden">
        <SidebarGroupLabel>Bible Study</SidebarGroupLabel>
        <BibleStudyCreateDialog
          trigger={
            <SidebarGroupAction className="h-6 w-6 shrink-0">
              <Plus />
            </SidebarGroupAction>
          }
        />
        <SidebarMenu className="overflow-auto">
          <SidebarBibleStudiesSection />
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}

function SidebarBibleStudiesSection() {
  const { data: sessions, isLoading } = api.bibleStudy.getSessions.useQuery();
  const path = usePathname();

  return (
    <Collapsible asChild defaultOpen={true} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip="Bible Studies">
            <Notebook
              className={`${path.includes("/study") ? "text-primary" : ""}`}
            />
            <span className="truncate">Your Bible Studies</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {isLoading ? (
            <>
              <SidebarMenuSkeleton showIcon={true} />
              <SidebarMenuSkeleton showIcon={true} />
              <SidebarMenuSkeleton showIcon={true} />
              <SidebarMenuSkeleton showIcon={true} />
              <SidebarMenuSkeleton showIcon={true} />
            </>
          ) : (
            <SidebarMenuSub>
              {sessions?.map((session) => (
                <SidebarMenuSubItem key={session.id}>
                  <SidebarMenuSubButton asChild>
                    <Link
                      href={`/study/${session.id}`}
                      prefetch={true}
                      className={`flex items-center gap-2 ${path.includes(`/study/${session.id}`) ? "bg-sidebar-accent" : ""}`}
                    >
                      {path.includes(`/study/${session.id}`) && (
                        <Check className="!text-primary" />
                      )}
                      {session.title}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          )}
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function CustomSidebarMenuButton({
  children,
  isActive,
  tooltip,
}: {
  children: React.ReactNode;
  isActive: boolean;
  tooltip: string;
}) {
  return (
    <SidebarMenuButton
      tooltip={tooltip}
      className={isActive ? "bg-sidebar-accent" : ""}
    >
      {children}
    </SidebarMenuButton>
  );
}
