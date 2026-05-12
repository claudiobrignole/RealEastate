"use client";

export default function FeaturesBlock({ data }: { data: any }) {
  const features: { label: string; value: string }[] = data?.features || [];
  if (features.length === 0) return null;

  return (
    <section className="px-margin py-lg border-t border-outline-variant">
      <h2 className="font-label-caps text-label-caps text-on-surface-variant 
                     uppercase tracking-widest mb-md">
        {data?.sectionTitle || 'Caratteristiche'}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
        {features.map((feat, i) => (
          <div
            key={i}
            className="flex flex-col gap-xs p-md border border-outline-variant 
                       rounded-DEFAULT bg-surface-container-lowest"
          >
            <span className="font-label-caps text-label-caps text-on-surface-variant 
                             uppercase tracking-wider">
              {feat.label}
            </span>
            <span className="font-h3 text-h3 text-primary tabular-nums">
              {feat.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
