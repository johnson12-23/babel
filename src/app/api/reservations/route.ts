import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerPublicClient, getSupabaseServiceClient } from "@/lib/supabase";

const reservationSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(7),
  guests: z.coerce.number().min(1).max(20),
  date: z.string().min(1),
  time: z.string().min(1),
  note: z.string().max(600).optional(),
});

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = reservationSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ message: "Please provide valid reservation details." }, { status: 400 });
  }

  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    return NextResponse.json(
      {
        message:
          "Reservation request received, but Supabase is not configured yet. Add environment keys and retry.",
      },
      { status: 503 },
    );
  }

  const { error } = await supabase.from("reservations").insert({
    full_name: parsed.data.fullName,
    phone: parsed.data.phone,
    guests: parsed.data.guests,
    reservation_date: parsed.data.date,
    reservation_time: parsed.data.time,
    note: parsed.data.note ?? "",
  });

  if (error) {
    const publicClient = getSupabaseServerPublicClient();

    if (publicClient) {
      const { error: fallbackError } = await publicClient.from("reservations").insert({
        full_name: parsed.data.fullName,
        phone: parsed.data.phone,
        guests: parsed.data.guests,
        reservation_date: parsed.data.date,
        reservation_time: parsed.data.time,
        note: parsed.data.note ?? "",
      });

      if (!fallbackError) {
        return NextResponse.json({ message: "Reservation request sent successfully." });
      }

      if (fallbackError.code === "PGRST205") {
        return NextResponse.json(
          {
            message:
              "Supabase table 'reservations' is missing. Run supabase/schema.sql in Supabase SQL Editor.",
          },
          { status: 500 },
        );
      }
    }

    if (error.code === "42P01") {
      return NextResponse.json(
        { message: "Reservations table is missing. Run supabase/schema.sql in your Supabase project." },
        { status: 500 },
      );
    }

    if (
      error.code === "PGRST301" ||
      error.message.toLowerCase().includes("jwt") ||
      error.message.toLowerCase().includes("api key")
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid Supabase service role key. Update SUPABASE_SERVICE_ROLE_KEY in .env.local from Supabase Settings > API.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: `Failed to save reservation: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "Reservation request sent successfully." });
}
