import crypto from "crypto";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { message: "User with this email does not exist" },
        { status: 404 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000);

    await db.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: token,
        passwordResetExpires: expires,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    await sendEmail(
      email,
      "Password Reset Request",
      `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`
    );

    return NextResponse.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Грешка в reset-request.ts:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
