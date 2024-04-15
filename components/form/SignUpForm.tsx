"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { DialogTrigger } from "@/components/ui/dialog";

const FormSchema = z
  .object({
    fname: z.string().min(1, "Username is required").max(100),
    lname: z.string().min(1, "Username is required").max(100),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    number: z.string().min(1, "Phone number is required").max(10),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must have more than 8 characters"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const SignUpForm = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fname: "",
      lname: "",
      password: "",
      email: "",
      confirmPassword: "",
      number: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fname: values.fname,
        lname: values.lname,
        email: values.email,
        password: values.password,
        number: values.number,
      }),
    });

    if (response.ok) {
      toast({
        title: "Success",
        description:
          "Вие успешно създадохте профила си, моля влезте през меню Профил -> Влез",
        variant: "success",
      });
    } else {
      toast({
        title: "Error",
        description: "Username/Email is already used!",
        variant: "destructive",
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="fname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Име</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Иван"
                    type="fname"
                    autoComplete="fname"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Фамилия</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Иванов"
                    type="lname"
                    autoComplete="lname"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Телефон</FormLabel>
                <FormControl>
                  <Input
                    placeholder="08XXXXXXXX"
                    type="username"
                    autoComplete="phone"
                    {...field}
                  />
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
                <FormLabel>Имейл адрес</FormLabel>
                <FormControl>
                  <Input
                    placeholder="email@mail.com"
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Повтори парола</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Въведете отново вашата парола"
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
        <Button className="w-full mt-4" type="submit">
          Регистрирай се
        </Button>
      </form>
      <div
        className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 
      after:block after:h-px after:flex-grow after:bg-stone-400"
      >
        или
      </div>
      <div className="text-center text-sm text-gray-600 mt-2">
        Ако вече имате създаден профил, моля&nbsp;
        <DialogTrigger className="text-blue-500 hover:underline">
          влезте
        </DialogTrigger>
      </div>
    </Form>
  );
};

export default SignUpForm;
