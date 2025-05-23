import { google } from "googleapis";

interface EventDetails {
  eventId?: string;
  datetime: string;
  title: string;
  description: string;
  clientName: string;
  clientPhoneNumber: string;
  durationMin?: number;
}

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

export async function addEventToCalendar({
  datetime,
  title,
  description,
  clientName,
  clientPhoneNumber,
  durationMin = 30,
}: EventDetails) {
  try {
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
      summary: `${title} - ${clientName}`,
      description: `Client: ${clientName}\nPhone: ${clientPhoneNumber}\n${description}`,
      start: {
        dateTime: datetime,
        timeZone: "Europe/Sofia",
      },
      end: {
        dateTime: new Date(
          new Date(datetime).getTime() + durationMin * 60 * 1000
        ).toISOString(),
        timeZone: "Europe/Sofia",
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    return response.data;
  } catch (error) {
    console.error("Error adding event:", error);
    throw new Error("Failed to add event to Google Calendar.");
  }
}

export async function updateEventInCalendar({
  eventId,
  datetime,
  note,
  clientName,
  clientPhoneNumber,
}: {
  eventId: string | null;
  datetime: string;
  note: string;
  clientName: string;
  clientPhoneNumber: string;
}) {
  try {
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const updatedEvent = {
      summary: `Записан час - ${clientName}`,
      description: `Client: ${clientName}\nPhone: ${clientPhoneNumber}\nNote: ${note}`,
      start: {
        dateTime: datetime,
        timeZone: "Europe/Sofia",
      },
      end: {
        dateTime: new Date(
          new Date(datetime).getTime() + 30 * 60 * 1000
        ).toISOString(),
        timeZone: "Europe/Sofia",
      },
    };

    if (!eventId) {
      throw new Error("Invalid event ID: eventId cannot be null or undefined.");
    }

    await calendar.events.update({
      calendarId: "primary",
      eventId,
      requestBody: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating Google Calendar event:", error);
    throw new Error("Failed to update event in Google Calendar.");
  }
}
