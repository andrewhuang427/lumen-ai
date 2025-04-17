"use client";

import { useIsMobile } from "../../hooks/use-mobile";
import {
  HeaderDescription,
  HeaderLeft,
  Header as HeaderRoot,
  HeaderTitle,
} from "../ui/header";
import { SidebarTrigger } from "../ui/sidebar";

type Props = {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  end?: React.ReactNode;
  showBorder?: boolean;
  showSidebarTrigger?: boolean;
};

export default function Header({
  icon,
  title,
  description,
  end,
  showBorder = true,
  showSidebarTrigger = true,
}: Props) {
  const isMobile = useIsMobile();

  return (
    <HeaderRoot showBorder={showBorder}>
      {!isMobile && showSidebarTrigger && <SidebarTrigger />}
      <HeaderLeft icon={icon}>
        <HeaderTitle>{title}</HeaderTitle>
        {description && <HeaderDescription>{description}</HeaderDescription>}
      </HeaderLeft>
      {end}
    </HeaderRoot>
  );
}
