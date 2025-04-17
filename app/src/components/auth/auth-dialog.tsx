"use client";

import { useState } from "react";
import SquareLogo from "../square-logo";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import AuthForgotPasswordForm from "./auth-forgot-password-form";
import AuthSignInForm from "./auth-signin-form";
import AuthSignUpForm from "./auth-signup-form";

type Props = {
  open?: boolean;
  trigger?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
};

export type AuthFormType = "sign-in" | "sign-up" | "reset-password";

export default function AuthDialog({ open, onOpenChange, trigger }: Props) {
  const [openInternal, setOpenInternal] = useState(false);
  const [form, setForm] = useState<AuthFormType>("sign-in");

  return (
    <Dialog
      open={open ?? openInternal}
      onOpenChange={onOpenChange ?? setOpenInternal}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-full max-w-[400px]">
        <div className="flex justify-center">
          <SquareLogo size={40} />
        </div>
        {form === "sign-in" && <AuthSignInForm onSetForm={setForm} />}
        {form === "sign-up" && <AuthSignUpForm onSetForm={setForm} />}
        {form === "reset-password" && (
          <AuthForgotPasswordForm onSetForm={setForm} />
        )}
      </DialogContent>
    </Dialog>
  );
}
