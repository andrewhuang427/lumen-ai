"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { MailCheck } from "lucide-react";
import { useState } from "react";
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
import { PasswordInput } from "../ui/password-input";
import { type AuthFormType } from "./auth-dialog";
import GoogleOAuthButton from "./auth-google-oauth-button";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
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

export default function AuthSignUpForm({ onSetForm }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSignUp(values: z.infer<typeof formSchema>) {
    try {
      setError(null);
      setIsLoading(true);
      const { error } = await browserSupabase().auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
          },
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center">Create an account</DialogTitle>
        <DialogDescription className="max-w-xl text-center">
          Create a Lumen account to get started.
        </DialogDescription>
      </DialogHeader>
      {success ? (
        <p className="flex items-center gap-4 p-4 text-sm text-muted-foreground">
          <MailCheck className="h-5 w-5 shrink-0 text-green-500" />
          Verification email sent. Please check your email for a verification
          link.
        </p>
      ) : (
        <>
          <GoogleOAuthButton />
          <TextSeparator text="Or" />
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(onSignUp)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="text" placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                label="Create account"
                loadingLabel="Creating account"
                isLoading={isLoading}
              />
            </form>
          </Form>
          <Button variant="link" onClick={() => onSetForm("sign-in")}>
            <span className="text-sm font-medium">
              Already have an account?{" "}
              <span className="font-semibold text-indigo-500">Sign in.</span>
            </span>
          </Button>
        </>
      )}
    </>
  );
}
