import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function StaticPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('uploads/')) return `http://localhost:5000/${url}`;
    if (!url.startsWith('/')) return `http://localhost:5000/${url}`;
    return `http://localhost:5000${url}`;
  };

  const processContent = (htmlContent) => {
    if (!htmlContent) return '';
    // Fix relative image paths inserted by TinyMCE without a leading slash
    return htmlContent.replace(/src="uploads\//g, 'src="http://localhost:5000/uploads/');
  };

  useEffect(() => {
    fetch(`http://localhost:5000/api/static_pages`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p.slug === slug);
        if (found) {
          setPage(found);
        } else {
          // If not found, maybe redirect to home or show 404
          console.error('Page not found');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching page:', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!page) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
       <h1 className="text-6xl font-black text-slate-200 mb-4">404</h1>
       <h2 className="text-2xl font-bold text-slate-800 mb-6">Halaman Tidak Ditemukan</h2>
       <button 
         onClick={() => navigate('/')}
         className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all"
       >
         Kembali ke Beranda
       </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Header Halaman */}
      <div className="bg-blue-900 pt-40 pb-20 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
           <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">{page.title}</h1>
           <div className="w-20 h-1.5 bg-bika-yellow mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Konten Halaman */}
      <main className="max-w-4xl mx-auto px-4 py-20">
         {page.image && (
           <div className="mb-12 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/10 border border-slate-100">
              <img src={getImageUrl(page.image)} className="w-full h-auto" alt={page.title} />
           </div>
         )}
          <div className="prose prose-lg prose-slate max-w-none">
            <div 
              className="text-slate-600 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: processContent(page.content) }}
            />
         </div>
      </main>

      <Footer />
    </div>
  );
}
