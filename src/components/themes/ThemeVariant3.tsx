import React from 'react';
import { ThemeData } from './ThemeVariant1';
import LeadForm from '../forms/LeadForm';

export default function ThemeVariant3({ data }: { data: ThemeData }) {
  const { projectId, title, subtitle, content } = data;

  return (
    <div className="bg-black text-on-primary font-body-md antialiased selection:bg-tertiary-fixed selection:text-on-tertiary-fixed min-h-full">
      <section className="relative w-full h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img alt="Hero" className="w-full h-full object-cover hover:scale-[1.02] hover:brightness-110 transition-transform duration-[10s]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHmmrxXZUp-nBaJppJfXbjA6qtl1X8hb00S5USKfqj-UhbwsG5oKOFU7QYtoKQsRXJhLcwwH0B_3cHMNmiabj2ZAo1o2y6CTMo7bvj-sNRlLTYcfUowWd0duHUofgqmeFbgXu7QYqMdAimDD-fJ5HSEMeVUc7XKlO91gTYzHCh_Wrp9BIrlWXK_kVO0hnPXQdCWTVX4m18Bp2F5TrC5adroqhIAdNakkwoAoyB_ktTJxNPskcfTmfwWX4ADmKVslW3POwftmnN4oA" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black"></div>
        </div>
        <div className="relative z-10 text-center px-margin max-w-4xl mx-auto flex flex-col items-center">
          <span className="font-label-caps text-tertiary-fixed-dim uppercase tracking-[0.2em] mb-sm">Exclusive Listing</span>
          <h1 className="font-h1 text-h1 text-on-primary mb-md drop-shadow-2xl">{title || 'Titolo Progetto'}</h1>
          <p className="font-body-lg text-body-lg text-surface-container-high mb-lg max-w-2xl opacity-90">{subtitle || 'Sottotitolo elegante.'}</p>
          <a className="bg-tertiary-fixed text-on-tertiary-fixed px-xl py-4 rounded-none font-label-caps uppercase tracking-widest hover:bg-tertiary transition-all duration-300 shadow-[0_0_20px_rgba(233,195,73,0.3)]" href="#inquiry">Request a Private Viewing</a>
        </div>
      </section>

      <section className="bg-[#0a0a0a] text-on-primary py-xl px-margin border-y border-outline/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-xl">
          <div className="flex flex-col justify-center">
             {content ? (
              <div className="prose prose-invert prose-lg text-surface-dim font-body-md text-hyphenated marker:text-tertiary-fixed" dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <>
                <h2 className="font-h2 text-h2 mb-md text-secondary-fixed">The Epitome of Luxury</h2>
                <p className="font-body-lg text-body-lg mb-sm text-surface-container-high">Descrizione dark in attesa di contenuti.</p>
              </>
            )}
          </div>
          <div className="grid grid-cols-2 gap-y-lg gap-x-gutter content-center lg:border-l lg:border-outline/30 lg:pl-xl">
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-secondary-fixed mb-xs uppercase tracking-widest">Interior Space</span>
              <span className="font-h3 text-h3 text-surface-bright">450 m²</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-secondary-fixed mb-xs uppercase tracking-widest">Energy</span>
              <span className="font-h3 text-h3 text-surface-bright">Class A4</span>
            </div>
            <div className="flex flex-col mt-md">
              <span className="font-label-caps text-label-caps text-secondary-fixed mb-xs uppercase tracking-widest">Bedrooms</span>
              <span className="font-h3 text-h3 text-surface-bright">4</span>
            </div>
            <div className="flex flex-col mt-md">
              <span className="font-label-caps text-label-caps text-secondary-fixed mb-xs uppercase tracking-widest">Bathrooms</span>
              <span className="font-h3 text-h3 text-surface-bright">5</span>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-xl px-margin border-b border-outline/10 bg-[#0f0f0f]">
        <h2 className="font-h2 text-h2 mb-lg text-center text-on-primary font-light">Visual Journey</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
          <img alt="Gallery Image 1" className="w-full h-[400px] object-cover grayscale hover:grayscale-0 transition-all duration-700 brightness-75 hover:brightness-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcLyYSfg-vUbyHCe2vvXUuIHM1BMqW4DCucdD3NieVCPo8MbJzyWqogw97yetAfNyXzxUj2vskGIxtNdl99bq2BUGTy-mI-Y7i7fOc_1tXwrNLOluWajIwNojKhkbsBfyDxLZ7_6_i_CinP07xUNiIB29JloatSUNfbob-pdeRiRbwRYjuFM_TL_flleXvYLxTzKgDxMIyzQq7d0NMZA91HrT7Y4Gse5HC-38CQkAPZI-oeQ5CSaoGpqJVYu1w0lnsn6ZQobRnkpQ" />
          <img alt="Gallery Image 2" className="w-full h-[400px] object-cover grayscale hover:grayscale-0 transition-all duration-700 brightness-75 hover:brightness-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkCVP6SkZvhEj8AebL53Ryu3_VZXe8R1yDh7itPjkJOyc8uWnKRcZBNIPEIF_G7GYvnf7Y8Ya9DCrYC_7aL64hec5uUeOsX2Avn9KHPZNRu2as8gl9bjnx8LAdUsz5eqAzpk99VD3q7kQIG4s1WU9-peCsli7SgskZEDpJ7Rw6zhDZE8tt9YcTmYK_sbAzlq_2yG9Xp_yESIY880MG_9emeQgdTJk6WbgggAxaoeFvyUYv5T-E9dtc0fb9R-nRT63qpAfMHvRrlrE" />
          <img alt="Gallery Image 3" className="w-full h-[400px] object-cover sm:col-span-2 lg:col-span-1 grayscale hover:grayscale-0 transition-all duration-700 brightness-75 hover:brightness-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp4VH0a83p7SfVRwc6x2qXzDmuoIe0BVmcysVO1Wqe69an98u9lIJCBGFFeF1RQ93zT1hXrDRX_Ng3MPMNaYv3A385sNJ-Jyesg2L8XQuyY5re0pRfLa3GgEWD641sJnMsnjLjTetQBYy_XTxwrqwENKu2ZGzHa1X7GVhvIEgVjx-dX5fKnWCMVM2zJBojjQzy1kpLBlQhsp__J1cdt-h51wVex-vLYP2sxmrbzR5NLEOXzVU7wNEQK5RR2HOfLy14NuIwyUMJkec" />
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-black py-xl px-margin border-b border-outline/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-xl">
          <div className="flex-1 w-full text-center md:text-left order-2 md:order-1">
            <h2 className="font-h2 text-h2 mb-md text-on-primary font-light">The Neighborhood</h2>
            <p className="font-body-lg text-body-lg text-surface-dim max-w-lg mb-md leading-relaxed">Nestled in an exclusive enclave, offering absolute privacy while remaining minutes away from cosmopolitan lifestyle hubs.</p>
          </div>
          <div className="flex-1 w-full h-96 relative bg-[#111] border border-outline/10 order-1 md:order-2">
            <div className="absolute inset-0 flex items-center justify-center flex-col text-surface-dim">
              <svg className="w-12 h-12 mb-sm opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-label-caps tracking-[0.2em] uppercase text-xs opacity-50">Map Unavailable</span>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="inquiry" className="py-2xl px-margin bg-[#080808]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-h2 text-h2 mb-sm text-on-primary font-light">Register Interest</h2>
          <p className="font-body-lg text-body-lg text-surface-dim mb-xl">Private consultations by appointment only.</p>
          
          <LeadForm projectId={projectId} variant={3} />
        </div>
      </section>
    </div>
  );
}
