"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import MyNavbar from "@/components/MyNavbar";

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async () => {
    if (!password || password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Паролите не съвпадат или са празни.",
        variant: "destructive",
      });
      return;
    }

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
    });

    if (response.ok) {
      toast({
        title: "Success",
        description: "Паролата ви е успешно обновена.",
        variant: "success",
      });
      router.push("/");
    } else {
      toast({
        title: "Error",
        description: "Грешка при обновяването на паролата.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <MyNavbar />
      <div className="flex flex-col items-center space-y-4 mx-auto max-w-md p-4 border border-gray-400 rounded-lg my-auto mt-8">
        <h1>Подновяване на парола</h1>
        <Input
          placeholder="Нова парола"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          placeholder="Повтори новата парола"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
          onClick={handleResetPassword}
          className="bg-slate-900 text-white"
        >
          Обнови паролата
        </Button>
      </div>
    </div>
  );
};

export default ResetPassword;
