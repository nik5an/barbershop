import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const date = req.url.split("=")[1];

    if (!date) {
      return NextResponse.json(
        { message: "Date parameter is missing" },
        { status: 400 }
      );
    }

    const selectedDate = new Date(date);
    const nextDate = new Date(selectedDate);
    nextDate.setDate(selectedDate.getDate() + 1);

    const bookedSlots = await db.appointments.findMany({
      where: {
        datetime: {
          gt: selectedDate.toISOString(),
          lt: nextDate.toISOString(),
        },
      },
      select: {
        datetime: true,
      },
    });

    const bookedTimes = bookedSlots.map((slot) => {
      const datetime = new Date(slot.datetime);
      return datetime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    });

    return NextResponse.json(bookedTimes, { status: 200 });
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    return NextResponse.json(
      { message: "Something went wrong! Please try again later!" },
      { status: 500 }
    );
  }
}
