"use client";

export default function HeroBlock({ data }: { data: any }) {
  return (
    <section className="relative w-full h-[70vh] flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        {data?.imageUrl ? (
          <img src={data.imageUrl} alt="Hero" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-container to-inverse-surface flex items-center justify-center" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
      </div>
      <div className="relative z-10 text-center px-margin max-w-4xl mx-auto flex flex-col items-center">
        <span className="font-label-caps text-label-caps text-on-primary uppercase tracking-widest mb-sm">
          {data?.kicker || 'Exclusive Listing'}
        </span>
        <h1 className="font-h1 text-h1 text-on-primary mb-md drop-shadow-lg">{data?.title || 'Titolo Progetto'}</h1>
        {data?.subtitle && (
          <p className="font-body-lg text-body-lg text-on-primary/80 mb-lg max-w-2xl">{data.subtitle}</p>
        )}
      </div>
    </section>
  );
}
