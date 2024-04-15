// expiredBookings.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = parseInt(session.user.id);

  try {
    // Fetch expired bookings for the user
    const expiredBookings = await db.appointments.findMany({
      where: {
        uId: userId,
        datetime: {
          lt: new Date(),
        },
      },
      orderBy: {
        datetime: "desc",
      },
    });
    return res.status(200).json(expiredBookings);
  } catch (error) {
    console.error("Error fetching expired bookings:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
