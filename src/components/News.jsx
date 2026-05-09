import React, { useState, useEffect } from 'react';

export default function News() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.ok ? res.json() : [])
      .then(data => setArticles(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error('Error fetching articles:', err);
        setArticles([]);
      });
  }, []);

  return (
    <section id="berita" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-sm font-bold text-blue-900 uppercase tracking-widest mb-3">Berita Terbaru</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">Informasi Terkini Kecamatan</h3>
          </div>
          <button className="hidden md:block text-blue-900 font-bold border-b-2 border-bika-yellow pb-1 hover:text-blue-800 transition-all">
            Lihat Semua Berita
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {(articles.length > 0 ? articles : [1,2,3]).map((article, idx) => (
            <div key={article.id || idx} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group">
              <div className="h-64 overflow-hidden relative bg-slate-200">
                {article.image ? (
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                     </svg>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-bika-yellow text-blue-900 text-xs font-bold px-3 py-1 rounded-full">
                  {article.category || 'Berita'}
                </div>
              </div>
              <div className="p-8">
                <p className="text-gray-400 text-sm font-medium mb-3">
                  {article.created_at ? new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '21 April 2026'}
                </p>
                <h4 className="text-xl font-bold text-slate-900 leading-tight mb-4 group-hover:text-blue-900 transition-colors">
                  {article.title || 'Judul Berita Terbaru Kelurahan Putussibau Kota'}
                </h4>
                <a href="#" className="inline-flex items-center text-sm font-bold text-blue-900 group-hover:translate-x-1 transition-transform">
                  Baca Selengkapnya
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 md:hidden">
          <button className="w-full bg-blue-900 text-white font-bold py-4 rounded-xl">
            Lihat Semua Berita
          </button>
        </div>
      </div>
    </section>
  );
}
