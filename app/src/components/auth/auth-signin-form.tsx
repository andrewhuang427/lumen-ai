"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type FormEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { browserSupabase } from "../../server/supabase/supabase-client";
import LoadingButton from "../loading-button";
import TextSeparator from "../text-separator";
import { Button } from "../ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { PasswordInput } from "../ui/password-input";
import { type AuthFormType } from "./auth-dialog";
import GoogleOAuthButton from "./auth-google-oauth-button";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});

type Props = {
  onSetForm: (form: AuthFormType) => void;
};

export default function AuthSignInForm({ onSetForm }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSignIn(values: z.infer<typeof formSchema>) {
    try {
      setError(null);
      setIsLoading(true);
      const { error } = await browserSupabase().auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleForgotPassword(event: FormEvent) {
    event.preventDefault();
    onSetForm("reset-password");
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center">Sign in</DialogTitle>
        <DialogDescription className="max-w-xl text-center">
          Welcome back! Sign in to Lumen to get started.
        </DialogDescription>
      </DialogHeader>
      <GoogleOAuthButton />
      <TextSeparator text="Or" />
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSignIn)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <Label className="text-destructive">{error}</Label>}

          <LoadingButton
            type="submit"
            label="Sign in"
            loadingLabel="Signing in"
            isLoading={isLoading}
          />
        </form>
      </Form>
      <Button variant="link" onClick={handleForgotPassword}>
        Forgot password?
      </Button>
      <Button variant="link" onClick={() => onSetForm("sign-up")}>
        <span className="text-sm font-medium">
          Don&apos;t have an account?{" "}
          <span className="font-semibold text-indigo-500">Create one.</span>
        </span>
      </Button>
    </>
  );
}
