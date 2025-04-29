"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export default function ThemeTabs() {
  const { theme, setTheme } = useTheme();

  return (
    <Tabs value={theme} onValueChange={setTheme} className="m-2 grow">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="light" className="flex items-center gap-2">
          <Sun className="size-4 text-yellow-500" />
          Light
        </TabsTrigger>
        <TabsTrigger value="dark" className="flex items-center gap-2">
          <Moon className="size-4 text-gray-500" />
          Dark
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
