import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { datetime, note, uId } = body;

    const newAppointment = await db.appointments.create({
      data: {
        datetime,
        note,
        uId,
      },
    });
    return NextResponse.json(
      {
        appointment: newAppointment,
        message: "Appointment created successfully",
      },
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
