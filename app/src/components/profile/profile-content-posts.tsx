"use client";

import { Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { api } from "../../trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import useProfileContext from "./use-profile-context";

export default function ProfileContentPosts() {
  const { userProfile, canSeeProfile } = useProfileContext();

  const { data: publishedPosts = [], isLoading } =
    api.user.getUserPublishedPosts.useQuery(userProfile?.id ?? "", {
      enabled: canSeeProfile && userProfile != null,
    });

  if (!canSeeProfile) {
    return (
      <div className="flex items-center justify-center gap-2">
        <UserPlus className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Follow user to see their posts
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-4 text-lg font-medium">Posts</div>
      {isLoading && (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      )}
      {!isLoading && publishedPosts.length === 0 && (
        <div className="flex items-center justify-center">
          <p className="text-sm text-muted-foreground">No posts yet</p>
        </div>
      )}
      {publishedPosts.map((post) => (
        <Link key={post.id} href={`/discover/${post.id}`}>
          <Card className="flex flex-col gap-2 transition-all duration-500 ease-in-out hover:cursor-pointer hover:bg-muted/50">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>{post.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {post.created_at.toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
