import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { updateEventInCalendar } from "@/lib/googleCalendar"; // Import the update function

export async function PATCH(req: Request) {
  try {
    const { appointmentId, datetime, note } = await req.json();

    // Check if the appointment exists
    const appointment = await db.appointments.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return NextResponse.json(
        { message: "Appointment not found" },
        { status: 404 }
      );
    }

    // Update the appointment in the database
    const updatedAppointment = await db.appointments.update({
      where: { id: appointmentId },
      data: { datetime, note },
    });

    // Update the Google Calendar event if event ID exists
    if (appointment.googleEventId) {
      // Assuming you store the Google Calendar event ID
      await updateEventInCalendar({
        eventId: appointment.googleEventId,
        datetime,
        title: "Записан час", // You can adjust the title as needed
        description: note || "No additional notes", // Use the note as description
        clientName: `${appointment.client.fname} ${appointment.client.lname}`,
        clientPhoneNumber: appointment.client.number,
      });
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
