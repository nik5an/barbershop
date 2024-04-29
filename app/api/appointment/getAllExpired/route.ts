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

    const expiredBookings = await db.appointments.findMany({
      where: {
        datetime: {
          lt: new Date(),
        },
      },
      orderBy: {
        datetime: "desc",
      },
    });

    const bookingIds = expiredBookings.map((booking) => booking.uId);

    const bookingUsers = await db.user.findMany({
      where: {
        id: {
          in: bookingIds,
        },
      },
    });

    return NextResponse.json(
      {
        expiredBookings: expiredBookings,
        bookingUsers: bookingUsers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching upcoming bookings:", error);
    return NextResponse.json(
      { message: "Failed to fetch upcoming bookings" },
      { status: 500 }
    );
  }
}
