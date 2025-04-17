"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LoadingButton from "../../components/loading-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../components/ui/form";
import { Label } from "../../components/ui/label";
import { PasswordInput } from "../../components/ui/password-input";
import { browserSupabase } from "../../server/supabase/supabase-client";

const formSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  confirmPassword: z.string(),
});

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      setIsLoading(true);
      const { error } = await browserSupabase().auth.updateUser({
        password: values.password,
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Password reset successfully");
        router.push("/");
        form.reset();
      }
    } catch {
      setError("Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-lvh grow flex-col items-center justify-center">
      <div className="flex w-full max-w-[400px] flex-col gap-4 rounded-lg p-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-medium">Reset password</h1>
          <p className="text-sm text-muted-foreground">
            Enter and confirm your new password below.
          </p>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Form {...form}>
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordInput placeholder="Confirm password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
          {success && <Label className="text-green-500">{success}</Label>}
          {error && <Label className="text-destructive">{error}</Label>}
          <LoadingButton
            type="submit"
            label="Reset password"
            loadingLabel="Resetting password"
            isLoading={isLoading}
          />
        </form>
      </div>
    </div>
  );
}
