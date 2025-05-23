"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import SignUpForm from "./SignUpForm";
import { useEffect, useState } from "react";

const FormSchema = z.object({
  email: z
    .string()
    .min(1, "Имейл адресът е задължителен")
    .email("Невалиден имейл адрес"),
  password: z
    .string()
    .min(1, "Паролата е задължителна")
    .min(8, "Паролата трябва да има поне 8 знака"),
});

const SignInForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Моля, въведете имейл адрес.",
        variant: "destructive",
      });
      return;
    }

    const response = await fetch("/api/auth/reset-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      toast({
        title: "Success",
        description:
          "Изпратихме линк за възстановяване на паролата на вашия имейл.",
        variant: "success",
      });
    } else {
      toast({
        title: "Error",
        description: "Възникна грешка! Проверете имейла си и опитайте отново.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const signInData = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (signInData?.error) {
      toast({
        title: "Something went wrong",
        description: "Имейлът/паролата са грешни!",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Успешно влязохте в профила си!`,
        variant: "success",
      });
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имейл адрес</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Въведете вашата е-поща"
                    type="email"
                    autoComplete="email"
                    {...field}
                  />
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
                <FormLabel>Парола</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Въведете вашата парола"
                    type="password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogTrigger
          className="w-full mt-4 bg-slate-900 text-white p-2 rounded-lg text-sm"
          type="submit"
        >
          Влез
        </DialogTrigger>
      </form>
      <div
        className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 
      after:block after:h-px after:flex-grow after:bg-stone-400"
      >
        или
      </div>
      <div className="text-center text-sm text-gray-600 mt-2">
        Ако нямате профил, моля се&nbsp;
        <Dialog>
          <DialogTrigger className="text-blue-500 hover:underline">
            регистрирайте
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center font-normal">
                Регистрация
              </DialogTitle>
              <SignUpForm></SignUpForm>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="text-center mt-4">
        <Dialog>
          <DialogTrigger className="text-blue-500 hover:underline">
            Забравена парола?
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Възстановяване на парола</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Въведете вашия имейл адрес"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                onClick={handleForgotPassword}
                className="w-full bg-slate-900 text-white"
              >
                Изпрати линк за възстановяване
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Form>
  );
};

export default SignInForm;
