"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, MailCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { browserSupabase } from "../../server/supabase/supabase-client";
import LoadingButton from "../loading-button";
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
import { type AuthFormType } from "./auth-dialog";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
});

type Props = {
  onSetForm: (form: AuthFormType) => void;
};

export default function AuthForgotPasswordForm({ onSetForm }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function handleSendResetLink(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const { error } = await browserSupabase().auth.resetPasswordForEmail(
        values.email,
        { redirectTo: `${window.location.origin}/reset-password` },
      );
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
        <DialogTitle className="text-center">Forgot password</DialogTitle>
        <DialogDescription className="max-w-xl text-center">
          Enter your email below to receive a link to reset your password.
        </DialogDescription>
      </DialogHeader>
      {success ? (
        <p className="flex items-center gap-4 p-4 text-sm text-muted-foreground">
          <MailCheck className="h-5 w-5 shrink-0 text-green-500" />
          Password reset link sent. Please check your email.
        </p>
      ) : (
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(handleSendResetLink)}
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
            {error && <Label className="text-destructive">{error}</Label>}
            <LoadingButton
              type="submit"
              label="Send reset link"
              loadingLabel="Sending reset link"
              isLoading={isLoading}
            />
            <Button variant="link" onClick={() => onSetForm("sign-in")}>
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}
