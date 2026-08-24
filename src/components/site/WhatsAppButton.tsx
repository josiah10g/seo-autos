import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "2348138946058";
const WHATSAPP_TEXT = "Hi, I want to enquire about Honda/Acura vehicles, parts or repairs.";

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
    >
      <MessageCircle className="h-5 w-5 fill-current" />
      <span className="hidden sm:inline">WhatsApp us</span>
    </a>
  );
}

export function WhatsAppLink({
  children,
  className = "",
  text = WHATSAPP_TEXT,
}: {
  children: React.ReactNode;
  className?: string;
  text?: string;
}) {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
