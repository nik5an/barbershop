import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { updateEventInCalendar } from "@/lib/googleCalendar";

export async function PATCH(req: Request) {
  try {
    const { appointmentId, datetime, note } = await req.json();

    const appointment = await db.appointments.findUnique({
      where: { id: appointmentId },
      include: {
        user: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { message: "Appointment not found" },
        { status: 404 }
      );
    }

    const updatedAppointment = await db.appointments.update({
      where: { id: appointmentId },
      data: { datetime, note },
    });

    try {
      await updateEventInCalendar({
        eventId: appointment.googleEventId,
        datetime,
        note,
        clientName: `${appointment.user.fname} ${appointment.user.lname}`,
        clientPhoneNumber: appointment.user.number,
      });
    } catch (calendarError) {
      console.error("Error updating Google Calendar event:", calendarError);
    }

    return NextResponse.json(
      {
        appointment: updatedAppointment,
        message: "Appointment updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { message: "Failed to update appointment" },
      { status: 500 }
    );
  }
}
