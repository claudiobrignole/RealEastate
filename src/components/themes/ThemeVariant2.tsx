import React from 'react';
import { ThemeData } from './ThemeVariant1';
import LeadForm from '../forms/LeadForm';

export default function ThemeVariant2({ data }: { data: ThemeData }) {
  const { projectId, title, subtitle, content } = data;

  return (
    <div className="bg-background text-on-background font-body-md antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-full">
      <section className="relative w-full min-h-[60vh] flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 h-[40vh] lg:h-auto relative">
          <img alt="Hero" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHmmrxXZUp-nBaJppJfXbjA6qtl1X8hb00S5USKfqj-UhbwsG5oKOFU7QYtoKQsRXJhLcwwH0B_3cHMNmiabj2ZAo1o2y6CTMo7bvj-sNRlLTYcfUowWd0duHUofgqmeFbgXu7QYqMdAimDD-fJ5HSEMeVUc7XKlO91gTYzHCh_Wrp9BIrlWXK_kVO0hnPXQdCWTVX4m18Bp2F5TrC5adroqhIAdNakkwoAoyB_ktTJxNPskcfTmfwWX4ADmKVslW3POwftmnN4oA" />
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-surface p-margin lg:p-xl">
          <div className="max-w-md w-full">
            <span className="font-label-caps text-secondary mb-sm uppercase tracking-widest block">Exclusive Listing</span>
            <h1 className="font-h1 text-h1 text-on-surface mb-md leading-tight">{title || 'Titolo Progetto'}</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg">{subtitle || 'Sottotitolo descrittivo.'}</p>
            <a className="inline-block w-full text-center bg-primary text-on-primary px-xl py-4 rounded font-label-caps uppercase tracking-widest hover:bg-inverse-surface transition-colors shadow-sm" href="#inquiry">Request Private Access</a>
          </div>
        </div>
      </section>

      <section className="bg-surface-container py-xl px-margin">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-xl">
          <div className="lg:w-2/3">
            {content ? (
              <div className="prose prose-lg text-on-surface-variant font-body-md text-hyphenated marker:text-primary" dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <p className="font-body-md text-on-surface-variant">La descrizione estesa apparirà qui una volta compilata.</p>
            )}
          </div>
          <div className="lg:w-1/3">
            <div className="bg-surface-bright p-lg border border-outline-variant shadow-sm rounded-xl sticky top-margin">
              <h3 className="font-label-caps text-secondary mb-md uppercase tracking-widest border-b border-outline-variant pb-xs">Property Specifications</h3>
              <ul className="space-y-md">
                <li className="flex justify-between border-b border-outline-variant/30 pb-xs">
                  <span className="text-on-surface-variant font-body-sm">Interior</span>
                  <span className="font-data-point text-on-surface">320 m²</span>
                </li>
                <li className="flex justify-between border-b border-outline-variant/30 pb-xs">
                  <span className="text-on-surface-variant font-body-sm">Bedrooms</span>
                  <span className="font-data-point text-on-surface">3 Suites</span>
                </li>
                <li className="flex justify-between border-b border-outline-variant/30 pb-xs">
                  <span className="text-on-surface-variant font-body-sm">Parking</span>
                  <span className="font-data-point text-on-surface">2 Spaces</span>
                </li>
                <li className="flex justify-between border-b border-outline-variant/30 pb-xs">
                  <span className="text-on-surface-variant font-body-sm">Year Built</span>
                  <span className="font-data-point text-on-surface">2024</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-xl px-margin border-t border-outline-variant">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-lg">
            <h2 className="font-h2 text-h2 text-primary">Curated Gallery</h2>
            <span className="font-label-caps text-on-surface-variant tracking-wider">Swipe or Scroll</span>
          </div>
          <div className="flex overflow-x-auto gap-md pb-sm snap-x">
            <img alt="Gallery Image 1" className="w-[85vw] md:w-[60vw] lg:w-[40vw] h-96 object-cover rounded-xl shadow-sm snap-center flex-shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcLyYSfg-vUbyHCe2vvXUuIHM1BMqW4DCucdD3NieVCPo8MbJzyWqogw97yetAfNyXzxUj2vskGIxtNdl99bq2BUGTy-mI-Y7i7fOc_1tXwrNLOluWajIwNojKhkbsBfyDxLZ7_6_i_CinP07xUNiIB29JloatSUNfbob-pdeRiRbwRYjuFM_TL_flleXvYLxTzKgDxMIyzQq7d0NMZA91HrT7Y4Gse5HC-38CQkAPZI-oeQ5CSaoGpqJVYu1w0lnsn6ZQobRnkpQ" />
            <img alt="Gallery Image 2" className="w-[85vw] md:w-[60vw] lg:w-[40vw] h-96 object-cover rounded-xl shadow-sm snap-center flex-shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkCVP6SkZvhEj8AebL53Ryu3_VZXe8R1yDh7itPjkJOyc8uWnKRcZBNIPEIF_G7GYvnf7Y8Ya9DCrYC_7aL64hec5uUeOsX2Avn9KHPZNRu2as8gl9bjnx8LAdUsz5eqAzpk99VD3q7kQIG4s1WU9-peCsli7SgskZEDpJ7Rw6zhDZE8tt9YcTmYK_sbAzlq_2yG9Xp_yESIY880MG_9emeQgdTJk6WbgggAxaoeFvyUYv5T-E9dtc0fb9R-nRT63qpAfMHvRrlrE" />
            <img alt="Gallery Image 3" className="w-[85vw] md:w-[60vw] lg:w-[40vw] h-96 object-cover rounded-xl shadow-sm snap-center flex-shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp4VH0a83p7SfVRwc6x2qXzDmuoIe0BVmcysVO1Wqe69an98u9lIJCBGFFeF1RQ93zT1hXrDRX_Ng3MPMNaYv3A385sNJ-Jyesg2L8XQuyY5re0pRfLa3GgEWD641sJnMsnjLjTetQBYy_XTxwrqwENKu2ZGzHa1X7GVhvIEgVjx-dX5fKnWCMVM2zJBojjQzy1kpLBlQhsp__J1cdt-h51wVex-vLYP2sxmrbzR5NLEOXzVU7wNEQK5RR2HOfLy14NuIwyUMJkec" />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-surface-container-low py-xl px-margin">
        <div className="max-w-7xl mx-auto">
          <div className="bg-surface border border-outline-variant p-lg rounded-xl shadow-sm">
            <h2 className="font-h3 text-h3 mb-md text-primary text-center">Location Map</h2>
            <div className="w-full h-[60vh] bg-surface-container rounded border border-outline/10 flex items-center justify-center">
              <span className="font-label-caps text-on-surface-variant flex flex-col items-center">
                <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Interactive Map Placeholder
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="inquiry" className="py-xl px-margin border-t border-outline-variant bg-surface">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-xl">
          <div className="md:w-1/2 flex flex-col justify-center">
            <h2 className="font-h1 text-h1 text-primary mb-md">Contact Our Agents</h2>
            <p className="font-body-lg text-on-surface-variant mb-lg">Leave your details and our exclusive property advisors will contact you shortly.</p>
            <div className="space-y-sm">
              <div className="flex items-center space-x-sm">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center uppercase font-h3">M</div>
                <div>
                  <div className="font-h3 text-on-surface">Marco Valenti</div>
                  <div className="font-body-sm text-on-surface-variant">Senior Broker</div>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2">
            <LeadForm projectId={projectId} variant={2} />
          </div>
        </div>
      </section>
    </div>
  );
}

