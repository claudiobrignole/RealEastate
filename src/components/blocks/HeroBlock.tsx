"use client";

export default function HeroBlock({ data }: { data: any }) {
  return (
    <section className="relative w-full h-[60vh] flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        {data?.imageUrl ? (
          <img src={data.imageUrl} alt="Hero" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-surface-variant flex items-center justify-center">
             <span className="text-on-surface-variant font-label-caps">Carica un&apos;immagine dall&apos;editor</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-primary/80"></div>
      </div>
      <div className="relative z-10 text-center px-margin max-w-4xl mx-auto flex flex-col items-center">
        <span className="font-label-caps text-on-primary uppercase tracking-widest mb-sm">Exclusive Listing</span>
        <h1 className="font-h1 text-h1 text-on-primary mb-md drop-shadow-lg">{data?.title || 'Titolo Progetto'}</h1>
        <p className="font-body-lg text-body-lg text-surface-container-high mb-lg max-w-2xl">{data?.subtitle || 'Sottotitolo del progetto...'}</p>
      </div>
    </section>
  );
}
