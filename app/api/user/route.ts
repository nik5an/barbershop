import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcrypt";
import * as z from "zod";

const userSchema = z.object({
  fname: z.string().min(1, "First name is required").max(100),
  lname: z.string().min(1, "Last name is required").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  number: z.string().min(1, "Phone number is required").max(10),
  password: z
    .string()
    .min(1, "Паролата е задължителна")
    .min(8, "Паролата трябва да съдържа поне 8 знака"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, fname, lname, password, number } = userSchema.parse(body);

    const existingUserByEmail = await db.user.findUnique({
      where: { email: email },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        {
          user: null,
          message: "Email already exists",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await db.user.create({
      data: {
        fname,
        lname,
        number,
        email,
        password: hashedPassword,
      },
    });

    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json(
      { user: rest, message: "Account created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong! Please try again later!",
      },
      { status: 500 }
    );
  }
}
