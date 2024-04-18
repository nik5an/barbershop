import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const upcomingBookings = await db.appointments.findMany({
      where: {
        datetime: {
          lt: new Date(),
        },
      },
      orderBy: {
        datetime: "desc",
      },
    });
    return NextResponse.json(upcomingBookings, { status: 200 });
  } catch (error) {
    console.error("Error fetching expired bookings:", error);
    return NextResponse.json(
      { message: "Failed to fetch expired bookings" },
      { status: 500 }
    );
  }
}
