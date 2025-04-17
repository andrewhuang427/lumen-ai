"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useDebounce } from "../../hooks/use-debounce";
import { api } from "../../trpc/react";
import useAuth from "../auth/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { DialogDescription, DialogTitle } from "../ui/dialog";

type Props = {
  open: boolean;
  onSetOpen: (open: boolean) => void;
};

export default function UserSearchCommand({ open, onSetOpen }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { data: searchResults, isLoading } =
    api.user.getUserSearchResults.useQuery(debouncedSearchTerm, {
      enabled: debouncedSearchTerm.length > 0,
    });

  const fetchedUsers = useMemo(() => {
    return searchResults?.filter((result) => result.id !== user?.id) ?? [];
  }, [searchResults, user]);

  return (
    <CommandDialog open={open} onOpenChange={onSetOpen}>
      <VisuallyHidden>
        <DialogTitle>Search for a user...</DialogTitle>
        <DialogDescription>
          Search for a user by name, email, or username.
        </DialogDescription>
      </VisuallyHidden>
      <CommandInput
        placeholder="Search for a user by name, email, or username..."
        value={searchTerm}
        onValueChange={(value) => setSearchTerm(value)}
        className="border-none"
      />
      <CommandList>
        {isLoading && (
          <div className="flex items-center p-4">
            <Loader2 className="size-4 animate-spin" />
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              Searching for users...
            </span>
          </div>
        )}
        {fetchedUsers.length > 0 && (
          <CommandGroup>
            {fetchedUsers.map((user) => (
              <Link key={user.id} href={`/@${user.username}`}>
                <CommandItem
                  value={user.name}
                  className="cursor-pointer hover:bg-accent"
                >
                  <Avatar className="size-8">
                    <AvatarImage src={user.avatar_url ?? undefined} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="ml-2">{user.name}</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      @{user.username}
                    </span>
                  </div>
                </CommandItem>
              </Link>
            ))}
          </CommandGroup>
        )}
        {!isLoading && <CommandEmpty>No users found.</CommandEmpty>}
      </CommandList>
    </CommandDialog>
  );
}
