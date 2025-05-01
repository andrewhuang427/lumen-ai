"use client";

import { Separator } from "../ui/separator";
import ProfileContainer from "./profile-container";
import ProfileContentPosts from "./profile-content-posts";
import ProfileContentSubscription from "./profile-content-subscription";
import ProfileContentUserInfo from "./profile-content-user-info";

export default function ProfileContent() {
  return (
    <ProfileContainer>
      <ProfileContentUserInfo />
      <Separator />
      <ProfileContentSubscription />
      <ProfileContentPosts />
    </ProfileContainer>
  );
}
