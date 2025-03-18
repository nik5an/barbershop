import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { addEventToCalendar } from "@/lib/googleCalendar";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { datetime, note, uId, serviceName, servicePrice, serviceDuration } =
      body;

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

    // Calculate end time based on service duration
    const duration = serviceDuration || 30; // Default to 30 minutes if not provided

    // Combine service info with note
    const fullNote = `Услуга: ${serviceName}, Цена: ${servicePrice} лв, Продължителност: ${duration} мин.\n${
      note || ""
    }`;

    const googleEvent = await addEventToCalendar({
      datetime,
      title: `Записан час - ${serviceName}`,
      description: `Услуга: ${serviceName}\nЦена: ${servicePrice} лв\nБележка: ${
        note || ""
      }`,
      clientName: `${client.fname} ${client.lname}`,
      clientPhoneNumber: client.number,
      durationMin: duration,
    });

    const eventId = googleEvent?.id;

    if (!eventId) {
      return NextResponse.json(
        {
          message: "Failed to save Google Calendar event.",
        },
        { status: 500 }
      );
    }

    const newAppointment = await db.appointments.create({
      data: {
        datetime,
        note: fullNote,
        uId,
        googleEventId: eventId,
      },
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
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      {
        message: "Something went wrong! Please try again later!",
      },
      { status: 500 }
    );
  }
}
