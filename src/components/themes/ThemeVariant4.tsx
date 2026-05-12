import React from 'react';
import { ThemeData } from './ThemeVariant1';
import LeadForm from '../forms/LeadForm';

export default function ThemeVariant4({ data }: { data: ThemeData }) {
  const { projectId, title, subtitle, content } = data;

  return (
    <div className="bg-background text-on-background font-body-md antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-full">
      <section className="relative w-full h-[50vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img alt="Hero" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHmmrxXZUp-nBaJppJfXbjA6qtl1X8hb00S5USKfqj-UhbwsG5oKOFU7QYtoKQsRXJhLcwwH0B_3cHMNmiabj2ZAo1o2y6CTMo7bvj-sNRlLTYcfUowWd0duHUofgqmeFbgXu7QYqMdAimDD-fJ5HSEMeVUc7XKlO91gTYzHCh_Wrp9BIrlWXK_kVO0hnPXQdCWTVX4m18Bp2F5TrC5adroqhIAdNakkwoAoyB_ktTJxNPskcfTmfwWX4ADmKVslW3POwftmnN4oA" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-primary/80"></div>
        </div>
        <div className="relative z-10 text-center px-margin max-w-4xl mx-auto flex flex-col items-center">
          <span className="font-label-caps text-on-primary uppercase tracking-widest mb-sm">Exclusive Listing</span>
          <h1 className="font-h1 text-h1 text-on-primary mb-md drop-shadow-lg">{title || 'Titolo Progetto'}</h1>
          <p className="font-body-lg text-body-lg text-surface-container-high mb-lg max-w-2xl">{subtitle || 'Un capolavoro architettonico...'}</p>
        </div>
      </section>

      <section className="py-xl px-margin bg-surface-bright">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-xl items-start">
          <div className="lg:w-2/3">
            {content ? (
              <div className="prose prose-lg text-on-surface-variant font-body-md text-hyphenated marker:text-primary" dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <>
                <h2 className="font-h2 text-h2 text-on-surface mb-md">An Icon of Italian Elegance</h2>
                <p className="text-on-surface-variant">Scrivi qualcosa di iconico e accattivante nell&apos;editor.</p>
              </>
            )}
            
            {/* Embedded Gallery */}
            <h3 className="font-h3 text-h3 text-primary mt-xl mb-md">Key Features</h3>
            <div className="grid grid-cols-2 gap-sm mb-lg">
              <img alt="Feature 1" className="w-full h-48 object-cover rounded shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcLyYSfg-vUbyHCe2vvXUuIHM1BMqW4DCucdD3NieVCPo8MbJzyWqogw97yetAfNyXzxUj2vskGIxtNdl99bq2BUGTy-mI-Y7i7fOc_1tXwrNLOluWajIwNojKhkbsBfyDxLZ7_6_i_CinP07xUNiIB29JloatSUNfbob-pdeRiRbwRYjuFM_TL_flleXvYLxTzKgDxMIyzQq7d0NMZA91HrT7Y4Gse5HC-38CQkAPZI-oeQ5CSaoGpqJVYu1w0lnsn6ZQobRnkpQ" />
              <img alt="Feature 2" className="w-full h-48 object-cover rounded shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkCVP6SkZvhEj8AebL53Ryu3_VZXe8R1yDh7itPjkJOyc8uWnKRcZBNIPEIF_G7GYvnf7Y8Ya9DCrYC_7aL64hec5uUeOsX2Avn9KHPZNRu2as8gl9bjnx8LAdUsz5eqAzpk99VD3q7kQIG4s1WU9-peCsli7SgskZEDpJ7Rw6zhDZE8tt9YcTmYK_sbAzlq_2yG9Xp_yESIY880MG_9emeQgdTJk6WbgggAxaoeFvyUYv5T-E9dtc0fb9R-nRT63qpAfMHvRrlrE" />
            </div>
            
            {/* Inline Map */}
            <h3 className="font-h3 text-h3 text-primary mt-xl mb-md">Location overview</h3>
            <div className="w-full h-64 bg-surface-container border border-outline-variant rounded mb-xl flex items-center justify-center">
               <span className="font-label-caps text-on-surface-variant flex items-center gap-xs">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                 </svg>
                 Map Area
               </span>
            </div>
          </div>
          
          <div className="lg:w-1/3 w-full sticky top-24">
            <div className="bg-surface p-lg border border-outline-variant shadow-sm rounded-DEFAULT mb-xl">
              <h3 className="font-h3 text-h3 text-on-surface mb-md pb-sm border-b border-outline-variant">Property Details</h3>
              <ul className="space-y-sm mb-lg">
                <li className="flex justify-between items-center py-xs border-b border-surface-variant">
                  <span className="font-body-sm text-on-surface-variant">Interior Space</span>
                  <span className="font-data-point text-on-surface">450 m²</span>
                </li>
                <li className="flex justify-between items-center py-xs border-b border-surface-variant">
                  <span className="font-body-sm text-on-surface-variant">Bedrooms</span>
                  <span className="font-data-point text-on-surface">4</span>
                </li>
              </ul>
              <a className="block w-full text-center bg-primary text-on-primary py-4 rounded font-label-caps uppercase tracking-widest hover:bg-inverse-surface transition-colors shadow-sm" href="#inquiry">Inquire Now</a>
            </div>
            
            {/* Embedded Form Sidebar */}
            <div id="inquiry" className="bg-surface-container-low p-lg border border-outline-variant shadow-sm rounded-DEFAULT">
               <h3 className="font-h3 text-h3 text-primary mb-sm">Schedule a Visit</h3>
               <p className="font-body-sm text-on-surface-variant mb-md">Our team is ready to show you this exceptional property.</p>
               <LeadForm projectId={projectId} variant={4} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
