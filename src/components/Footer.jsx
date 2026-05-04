import React, { useState, useEffect } from 'react';

export default function Footer({ content: propsContent }) {
  const [content, setContent] = useState({});

  useEffect(() => {
    if (propsContent && Object.keys(propsContent).length > 0) {
      setContent(propsContent);
    } else {
      fetch('/api/content')
        .then(res => res.json())
        .then(data => setContent(data))
        .catch(err => console.error('Error fetching footer content:', err));
    }
  }, [propsContent]);

  // Build shortcuts array from content keys
  const shortcuts = [1,2,3,4,5]
    .map(i => ({
      label: content[`footer_shortcut_${i}_label`],
      link: content[`footer_shortcut_${i}_link`] || '#'
    }))
    .filter(s => s.label);

  // Build services array from content keys
  const services = [1,2,3,4]
    .map(i => ({
      label: content[`footer_service_${i}_label`],
      link: content[`footer_service_${i}_link`] || '#'
    }))
    .filter(s => s.label);

  return (
    <footer id="kontak" className="bg-blue-950 text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center overflow-hidden">
                {content.footer_logo_image ? (
                  <img src={content.footer_logo_image} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-blue-900 font-bold text-2xl">{content.footer_logo_text || 'PK'}</span>
                )}
              </div>
              <div>
                <h2 className="font-bold text-xl leading-tight">{content.footer_title || 'PUTUSSIBAU KOTA'}</h2>
                <p className="text-[10px] text-blue-300 font-medium uppercase tracking-widest">{content.footer_subtitle || 'Kelurahan Putussibau Kota'}</p>
              </div>
            </div>
            <p className="text-blue-200/70 text-sm leading-relaxed mb-8">
              {content.footer_description || 'Portal informasi resmi Kelurahan Putussibau Kota, Kabupaten Kapuas Hulu. Melayani dengan sepenuh hati demi kemajuan daerah.'}
            </p>
            <div className="flex space-x-4">
              <a href={content.footer_facebook || '#'} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-bika-yellow hover:text-blue-900 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href={content.footer_twitter || '#'} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-bika-yellow hover:text-blue-900 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href={content.footer_instagram || '#'} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-bika-yellow hover:text-blue-900 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.282.888.871 1.213 2.041 1.29 3.515.071 1.322.081 1.705.081 4.97s-.01 3.648-.081 4.97c-.077 1.474-.402 2.644-1.29 3.515-.975.95-2.242 1.22-3.608 1.282-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.282-.888-.871-1.213-2.041-1.29-3.515-.071-1.322-.081-1.705-.081-4.97s.01-3.648.081-4.97c.077-1.474.402-2.644 1.29-3.515.975-.95 2.242-1.22 3.608-1.282 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.647.075-3.147.457-4.28 1.59-1.131 1.132-1.512 2.633-1.587 4.28-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.075 1.647.457 3.147 1.59 4.28 1.132 1.131 2.633 1.512 4.28 1.587 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.647-.075 3.147-.457 4.28-1.59 1.131-1.132 1.512-2.633 1.587-4.28.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.075-1.647-.457-3.147-1.59-4.28-1.132-1.131-2.633-1.512-4.28-1.587-1.28-.058-1.688-.072-4.947-.072zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-8">Pintasan</h4>
            <ul className="space-y-4 text-blue-200/70 text-sm">
              {shortcuts.map((item, idx) => (
                <li key={idx}><a href={item.link} className="hover:text-bika-yellow transition-colors">{item.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-8">Layanan</h4>
            <ul className="space-y-4 text-blue-200/70 text-sm">
              {services.map((item, idx) => (
                <li key={idx}><a href={item.link} className="hover:text-bika-yellow transition-colors">{item.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-8">Kontak</h4>
            <ul className="space-y-6 text-blue-200/70 text-sm">
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-bika-yellow mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>{content.footer_address || 'Jl. Kom Yos Sudarso, Kelurahan Putussibau Kota, Kabupaten Kapuas Hulu, Kalimantan Barat'}</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-bika-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <span>{content.footer_phone || '(0561) 123-4567'}</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-bika-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <span>{content.footer_email || 'putussibaukota@kapuashulukab.go.id'}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-blue-200/40">
          <p>{content.footer_copyright || '© 2026 Pemerintah Kelurahan Putussibau Kota. All Rights Reserved.'}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-white transition-colors">Peta Situs</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
