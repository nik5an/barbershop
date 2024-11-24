import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { addEventToCalendar } from "@/lib/googleCalendar";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { datetime, note, uId } = body;

    const client = await db.user.findUnique({
      where: { id: uId },
      select: {
        fname: true,
        lname: true,
        number: true,
      },
    });

    if (!client) {
      return NextResponse.json(
        {
          message: "Client not found!",
        },
        { status: 404 }
      );
    }

    const newAppointment = await db.appointments.create({
      data: {
        datetime,
        note,
        uId,
      },
    });

    await addEventToCalendar({
      datetime,
      title: "Записан час",
      description: `Бележка: ${note}`,
      clientName: `${client.fname} ${client.lname}`,
      clientPhoneNumber: client.number,
    });

    return NextResponse.json(
      {
        appointment: newAppointment,
        message:
          "Appointment created and added to Google Calendar successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Something went wrong! Please try again later!",
      },
      { status: 500 }
    );
  }
}
