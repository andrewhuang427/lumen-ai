"use client";

import {
  BookOpen,
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
              <SidebarMenuButton tooltip="Read">
                <BookOpen
                  className={`${path === "/" ? "text-blue-500" : ""}`}
                />
                <span className="truncate">Read</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
          <Link href="/chat" prefetch={true}>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Chat">
                <MessageCircle
                  className={`${path.includes("/chat") ? "text-blue-500" : ""}`}
                />
                <span className="truncate">Chat</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
          <Link href="/discover" prefetch={true}>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Discover">
                <Globe
                  className={`${path.includes("/discover") ? "text-blue-500" : ""}`}
                />
                <span className="truncate">Discover</span>
              </SidebarMenuButton>
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
              className={`${path.includes("/study") ? "text-blue-500" : ""}`}
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
                    <Link href={`/study/${session.id}`} prefetch={true}>
                      <span
                        className={`truncate ${path.includes(`/study/${session.id}`) ? "text-blue-500" : ""}`}
                      >
                        {session.title}
                      </span>
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
