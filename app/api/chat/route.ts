import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Ти си асистент в бръснарница, който помага с въпроси относно подстригване, бръснене, прически и други услуги свързани с бръснарница. Отговаряй само на български език и бъди професионален, но приятелски настроен. Ако получиш въпроси, които не са свързани с бръснарницата, любезно обясни, че можеш да помогнеш само с теми, свързани с услугите на бръснарницата.",
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.error("Error in AI chat:", error);
    return NextResponse.json(
      { error: "Възникна грешка при обработката на вашето запитване." },
      { status: 500 }
    );
  }
}
