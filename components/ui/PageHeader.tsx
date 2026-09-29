import { Breadcrumbs } from './Breadcrumbs';

export function PageHeader({ title, intro, crumb }: { title: string; intro?: string; crumb?: string }) {
  return (
    <div className="bg-cream">
      <div className="container-x py-10 sm:py-14">
        <Breadcrumbs items={[{ name: crumb ?? title }]} />
        <h1 className="mt-5 font-display text-[44px] font-medium leading-none tracking-tight text-ink sm:text-6xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-[16.5px] leading-relaxed text-ink/70">{intro}</p>}
      </div>
    </div>
  );
}
