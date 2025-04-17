"use client";

import { Separator } from "../ui/separator";
import ProfileContainer from "./profile-container";
import ProfileContentPosts from "./profile-content-posts";
import ProfileContentUserInfo from "./profile-content-user-info";

export default function ProfileContent() {
  return (
    <ProfileContainer>
      <ProfileContentUserInfo />
      <Separator />
      <ProfileContentPosts />
    </ProfileContainer>
  );
}
