import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerPublicClient, getSupabaseServiceClient } from "@/lib/supabase";
import { sendContactConfirmationEmail } from "@/lib/mailer";

const contactSchema = z.object({
  fullName: z.string().min(2),
  email: z.email(),
  type: z.string().min(2),
  message: z.string().min(10).max(1200),
});

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ message: "Please provide valid contact details." }, { status: 400 });
  }

  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    return NextResponse.json(
      {
        message:
          "Message captured, but Supabase is not configured yet. Add environment keys and retry.",
      },
      { status: 503 },
    );
  }

  const { error } = await supabase.from("contact_inquiries").insert({
    full_name: parsed.data.fullName,
    email: parsed.data.email,
    inquiry_type: parsed.data.type,
    message: parsed.data.message,
  });

  if (error) {
    const publicClient = getSupabaseServerPublicClient();

    if (publicClient) {
      const { error: fallbackError } = await publicClient.from("contact_inquiries").insert({
        full_name: parsed.data.fullName,
        email: parsed.data.email,
        inquiry_type: parsed.data.type,
        message: parsed.data.message,
      });

      if (!fallbackError) {
        try {
          await sendContactConfirmationEmail(parsed.data);
        } catch (mailError) {
          console.error("Contact confirmation email failed:", mailError);
        }
        return NextResponse.json({ message: "Message sent successfully." });
      }
    }

    return NextResponse.json({ message: "Failed to save message. Please try again." }, { status: 500 });
  }

  try {
    await sendContactConfirmationEmail(parsed.data);
  } catch (mailError) {
    console.error("Contact confirmation email failed:", mailError);
  }

  return NextResponse.json({ message: "Message sent successfully." });
}
