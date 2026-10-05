import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { WhatsAppLink } from '@/components/ui/WhatsAppLink';

/** Floating "chat with us" button, bottom right on every shop page (Back to top sits above it). */
export function WhatsAppButton() {
  return (
    <WhatsAppLink
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-soft transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </WhatsAppLink>
  );
}
