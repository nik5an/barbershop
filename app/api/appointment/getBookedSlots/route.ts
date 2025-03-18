import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { addMinutes, format, parse, getHours, getMinutes } from "date-fns";

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

    // Get all appointments for the selected date
    const bookedAppointments = await db.appointments.findMany({
      where: {
        datetime: {
          gt: selectedDate.toISOString(),
          lt: nextDate.toISOString(),
        },
      },
      select: {
        datetime: true,
        note: true,
      },
    });

    // Calculate all blocked time slots based on appointment start times and durations
    const blockedTimeSlots = new Set<string>();

    // Generate all possible time slots for the day (10:00 to 18:30)
    const allTimeSlots: string[] = [];
    for (let hour = 10; hour <= 18; hour++) {
      allTimeSlots.push(`${hour < 10 ? "0" + hour : hour}:00`);
      if (hour < 18) {
        allTimeSlots.push(`${hour < 10 ? "0" + hour : hour}:30`);
      }
    }

    for (const appointment of bookedAppointments) {
      // Extract duration from the note field if available
      let durationMinutes = 30; // Default to 30 minutes

      if (appointment.note) {
        const durationMatch = appointment.note.match(
          /Продължителност: (\d+) мин./
        );
        if (durationMatch && durationMatch[1]) {
          durationMinutes = parseInt(durationMatch[1]);
        }
      }

      const startTime = new Date(appointment.datetime);
      const startTimeStr = format(startTime, "HH:mm");

      // Block the start time slot
      blockedTimeSlots.add(startTimeStr);

      // Determine which additional slots should be blocked
      // For example, if appointment is at 10:00 and lasts 45 minutes,
      // we need to block 10:00 and 10:30, but not 11:00
      const startHour = getHours(startTime);
      const startMinute = getMinutes(startTime);

      // Calculate end time
      const endTime = addMinutes(startTime, durationMinutes);
      const endHour = getHours(endTime);
      const endMinute = getMinutes(endTime);

      // Block all time slots that overlap with the appointment
      for (const timeSlot of allTimeSlots) {
        const slotTime = parse(timeSlot, "HH:mm", new Date());
        const slotHour = getHours(slotTime);
        const slotMinute = getMinutes(slotTime);

        // Time slot starts within the appointment duration
        // (Slot starts after appointment starts and before it ends)
        if (
          (slotHour > startHour ||
            (slotHour === startHour && slotMinute >= startMinute)) &&
          (slotHour < endHour ||
            (slotHour === endHour && slotMinute < endMinute))
        ) {
          blockedTimeSlots.add(timeSlot);
        }
      }
    }

    return NextResponse.json(Array.from(blockedTimeSlots), { status: 200 });
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    return NextResponse.json(
      { message: "Something went wrong! Please try again later!" },
      { status: 500 }
    );
  }
}
