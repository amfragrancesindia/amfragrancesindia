import { Gem, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { site } from '@/lib/site';

const promises = [
  { Icon: Gem, title: 'Long-lasting blends', text: 'Rich eau de parfum and attar concentrations that stay with you.' },
  { Icon: Truck, title: 'Free shipping', text: `On every order above ₹${site.shipping.freeThreshold.toLocaleString('en-IN')}, across India.` },
  { Icon: ShieldCheck, title: 'Secure checkout', text: 'Pay by UPI, card, net banking or cash on delivery.' },
  { Icon: RotateCcw, title: `${site.returns.days}-day returns`, text: 'Easy returns on unopened, sealed products.' },
];

export function Promises() {
  return (
    <section className="container-x pb-20 pt-16 sm:pt-24">
      <ul className="grid grid-cols-1 gap-6 rounded-2xl border border-line px-6 py-8 sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
        {promises.map(({ Icon, title, text }) => (
          <li key={title} className="flex gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-cream text-brand">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
