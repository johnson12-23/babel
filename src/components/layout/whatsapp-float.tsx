"use client";

import { MessageCircle } from "lucide-react";
import { trackConversion } from "@/lib/tracking";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "233200000600";
const encodedMessage = encodeURIComponent("Hello Babel, I want to reserve a table.");
const href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

export function WhatsAppFloat() {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={() => {
        void trackConversion("whatsapp_click", { channel: "floating_button" });
      }}
      className="fixed right-4 bottom-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-[#0d1f13] shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition hover:scale-[1.03]"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={18} />
      <span className="hidden sm:inline">WhatsApp Booking</span>
    </a>
  );
}
