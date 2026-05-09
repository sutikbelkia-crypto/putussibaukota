import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Navbar({ content }) {
  const [menu, setMenu] = useState([
    { id: 1, label: 'Beranda', link: '/', order: 1 },
    { id: 2, label: 'Profil', link: '/profil', order: 2 },
    { id: 3, label: 'Layanan', link: '/layanan', order: 3 }
  ]);
  const [subMenu, setSubMenu] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch menu and sub-menu
    Promise.all([
      fetch('/api/menu').then(res => res.ok ? res.json() : []),
      fetch('/api/submenu').then(res => res.ok ? res.json() : [])
    ]).then(([menuData, subMenuData]) => {
      if (Array.isArray(menuData) && menuData.length > 0) {
        setMenu(menuData);
      }
      if (Array.isArray(subMenuData)) {
        setSubMenu(subMenuData);
      }
    }).catch(err => {
      console.error('Error fetching navigation:', err);
    });
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 overflow-hidden">
              {content?.footer_logo_image ? (
                <img src={content.footer_logo_image} alt="Logo" className="w-full h-full object-contain bg-white" />
              ) : (
                <span className="text-white font-black text-xl">{content?.footer_logo_text || 'PK'}</span>
              )}
            </div>
            <div>
              <h2 className="text-blue-900 font-black leading-tight tracking-tighter uppercase">{content?.footer_title || 'PUTUSSIBAU KOTA'}</h2>
              <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] -mt-1">{content?.footer_subtitle || 'Kelurahan'}</p>
            </div>
          </div>
          
          <div className="hidden md:flex space-x-1 items-center">
            {menu.map((item) => {
              const itemSubs = subMenu.filter(sub => sub.parent_id === item.id);
              const hasSubs = itemSubs.length > 0;

              return (
                <div key={item.id} className="relative group px-3 py-2">
                  <a 
                    href={item.link} 
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-900 font-bold text-sm transition-all py-2"
                  >
                    <span>{item.label}</span>
                    {hasSubs && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />}
                  </a>
                  
                  {hasSubs && (
                    <div className="absolute top-full left-0 w-56 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-[100]">
                      <div className="bg-white rounded-2xl shadow-2xl border border-gray-50 p-2 overflow-hidden">
                        {itemSubs.map(sub => (
                          <a 
                            key={sub.id} 
                            href={sub.link}
                            className="block px-4 py-3 text-xs font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-900 rounded-xl transition-all"
                          >
                            {sub.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div className="ml-4">
              <a href="#kontak" className="bg-blue-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 active:scale-95">
                Contact Person
              </a>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-blue-900 p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {menu.map((item) => (
              <div key={item.id}>
                <a href={item.link} className="block px-4 py-3 text-base font-bold text-gray-700 hover:bg-blue-50 rounded-xl">
                  {item.label}
                </a>
                {subMenu.filter(sub => sub.parent_id === item.id).map(sub => (
                  <a key={sub.id} href={sub.link} className="block px-8 py-2 text-sm font-medium text-gray-500 hover:text-blue-900">
                    — {sub.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
