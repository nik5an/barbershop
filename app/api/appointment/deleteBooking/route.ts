import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    const { appointmentId } = body;
    if (!appointmentId) {
      return NextResponse.json(
        { message: "Appointment is required" },
        { status: 400 }
      );
    }

    await db.appointments.delete({
      where: {
        id: appointmentId,
      },
    });

    return NextResponse.json(
      { message: "Appointment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json(
      { message: "Failed to delete booking." },
      { status: 500 }
    );
  }
}
