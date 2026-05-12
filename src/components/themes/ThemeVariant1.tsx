import React from 'react';
import LeadForm from '../forms/LeadForm';

export interface ThemeData {
  projectId: string;
  title: string;
  subtitle: string;
  content: string;
}

export default function ThemeVariant1({ data }: { data: ThemeData }) {
  const { projectId, title, subtitle, content } = data;

  return (
    <div className="bg-background text-on-background font-body-md antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-full">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img alt="Hero" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHmmrxXZUp-nBaJppJfXbjA6qtl1X8hb00S5USKfqj-UhbwsG5oKOFU7QYtoKQsRXJhLcwwH0B_3cHMNmiabj2ZAo1o2y6CTMo7bvj-sNRlLTYcfUowWd0duHUofgqmeFbgXu7QYqMdAimDD-fJ5HSEMeVUc7XKlO91gTYzHCh_Wrp9BIrlWXK_kVO0hnPXQdCWTVX4m18Bp2F5TrC5adroqhIAdNakkwoAoyB_ktTJxNPskcfTmfwWX4ADmKVslW3POwftmnN4oA" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-primary/80"></div>
        </div>
        <div className="relative z-10 text-center px-margin max-w-4xl mx-auto flex flex-col items-center">
          <span className="font-label-caps text-on-primary uppercase tracking-widest mb-sm">Exclusive Listing</span>
          <h1 className="font-h1 text-h1 text-on-primary mb-md drop-shadow-lg">{title || 'Titolo Progetto'}</h1>
          <p className="font-body-lg text-body-lg text-surface-container-high mb-lg max-w-2xl">{subtitle || 'Sottotitolo del progetto...'}</p>
          <a className="bg-primary text-on-primary px-xl py-4 rounded font-label-caps uppercase tracking-widest hover:bg-inverse-surface transition-colors shadow-sm" href="#inquiry">Request a Private Viewing</a>
        </div>
      </section>

      {/* Split-Screen Description */}
      <section className="bg-inverse-surface text-inverse-on-surface py-xl px-margin">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-xl">
          <div className="flex flex-col justify-center">
            {content ? (
              <div 
                className="prose prose-invert prose-lg font-body-md text-hyphenated" 
                dangerouslySetInnerHTML={{ __html: content }} 
              />
            ) : (
              <>
                <h2 className="font-h2 text-h2 mb-md text-secondary-fixed">The Epitome of Luxury</h2>
                <p className="font-body-lg text-body-lg mb-sm text-surface-container-high">Inserisci la descrizione del progetto dall&apos;editor per vedere l&apos;anteprima.</p>
              </>
            )}
          </div>
          <div className="grid grid-cols-2 gap-y-lg gap-x-gutter content-center lg:border-l lg:border-outline/30 lg:pl-xl">
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-secondary-fixed mb-xs uppercase tracking-widest">Interior Space</span>
              <span className="font-h3 text-h3 text-surface-bright">450 m²</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-secondary-fixed mb-xs uppercase tracking-widest">Exterior Terrace</span>
              <span className="font-h3 text-h3 text-surface-bright">120 m²</span>
            </div>
            <div className="flex flex-col mt-md">
              <span className="font-label-caps text-label-caps text-secondary-fixed mb-xs uppercase tracking-widest">Bedrooms</span>
              <span className="font-h3 text-h3 text-surface-bright">4 suites</span>
            </div>
            <div className="flex flex-col mt-md">
              <span className="font-label-caps text-label-caps text-secondary-fixed mb-xs uppercase tracking-widest">Bathrooms</span>
              <span className="font-h3 text-h3 text-surface-bright">5.5</span>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-xl px-margin max-w-7xl mx-auto">
        <h2 className="font-h2 text-h2 mb-lg text-primary text-center">Gallery Spotlight</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          <img alt="Gallery Image 1" className="w-full h-80 object-cover rounded-sm shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcLyYSfg-vUbyHCe2vvXUuIHM1BMqW4DCucdD3NieVCPo8MbJzyWqogw97yetAfNyXzxUj2vskGIxtNdl99bq2BUGTy-mI-Y7i7fOc_1tXwrNLOluWajIwNojKhkbsBfyDxLZ7_6_i_CinP07xUNiIB29JloatSUNfbob-pdeRiRbwRYjuFM_TL_flleXvYLxTzKgDxMIyzQq7d0NMZA91HrT7Y4Gse5HC-38CQkAPZI-oeQ5CSaoGpqJVYu1w0lnsn6ZQobRnkpQ" />
          <img alt="Gallery Image 2" className="w-full h-80 object-cover rounded-sm shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkCVP6SkZvhEj8AebL53Ryu3_VZXe8R1yDh7itPjkJOyc8uWnKRcZBNIPEIF_G7GYvnf7Y8Ya9DCrYC_7aL64hec5uUeOsX2Avn9KHPZNRu2as8gl9bjnx8LAdUsz5eqAzpk99VD3q7kQIG4s1WU9-peCsli7SgskZEDpJ7Rw6zhDZE8tt9YcTmYK_sbAzlq_2yG9Xp_yESIY880MG_9emeQgdTJk6WbgggAxaoeFvyUYv5T-E9dtc0fb9R-nRT63qpAfMHvRrlrE" />
          <img alt="Gallery Image 3" className="w-full h-80 object-cover rounded-sm md:col-span-2 shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp4VH0a83p7SfVRwc6x2qXzDmuoIe0BVmcysVO1Wqe69an98u9lIJCBGFFeF1RQ93zT1hXrDRX_Ng3MPMNaYv3A385sNJ-Jyesg2L8XQuyY5re0pRfLa3GgEWD641sJnMsnjLjTetQBYy_XTxwrqwENKu2ZGzHa1X7GVhvIEgVjx-dX5fKnWCMVM2zJBojjQzy1kpLBlQhsp__J1cdt-h51wVex-vLYP2sxmrbzR5NLEOXzVU7wNEQK5RR2HOfLy14NuIwyUMJkec" />
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-surface-container-low py-xl px-margin">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-xl">
          <div className="flex-1 w-full h-96 relative bg-surface-container shadow-inner border border-outline/10">
            {/* Placeholder for real map */}
            <div className="absolute inset-0 flex items-center justify-center flex-col text-on-surface-variant">
              <svg className="w-12 h-12 mb-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-label-caps tracking-wider">Map Overview (Placeholder)</span>
            </div>
          </div>
          <div className="flex-1 w-full text-center md:text-left">
            <h2 className="font-h2 text-h2 mb-md text-primary">Prime Location</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mb-md">Situated in the heart of the most desirable neighborhood, offering unparalleled access to fine dining, shopping, and scenic views.</p>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="inquiry" className="py-xl px-margin bg-inverse-surface text-inverse-on-surface">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-h2 text-h2 mb-sm text-secondary-fixed">Inquire Now</h2>
          <p className="font-body-lg text-body-lg text-surface-container-high mb-xl">Register your interest to receive floor plans and pricing details.</p>
          
          <LeadForm projectId={projectId} variant={1} />
        </div>
      </section>
    </div>
  );
}
