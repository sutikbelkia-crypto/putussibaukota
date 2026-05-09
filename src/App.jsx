import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import News from './components/News'
import Footer from './components/Footer'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import StaticPage from './pages/StaticPage'
import GallerySection from './components/GallerySection'

function LandingPage() {
  const [content, setContent] = useState({});

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.ok ? res.json() : {})
      .then(data => setContent(data && typeof data === 'object' && !Array.isArray(data) ? data : {}))
      .catch(err => {
        console.error('Error fetching content:', err);
        setContent({});
      });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar content={content} />
      <main>
        <Hero content={content} />
        <Services />
        
        {/* Statistics Section */}
        <section className="py-20 bg-blue-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-extrabold text-bika-yellow mb-2">
                  {content.stats_villages || '12'}
                </div>
                <div className="text-blue-200 text-sm uppercase tracking-widest font-bold">Jumlah Desa</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-extrabold text-bika-yellow mb-2">
                  {content.stats_population || '15.4k'}
                </div>
                <div className="text-blue-200 text-sm uppercase tracking-widest font-bold">Total Penduduk</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-extrabold text-bika-yellow mb-2">
                  {content.stats_digital || '100%'}
                </div>
                <div className="text-blue-200 text-sm uppercase tracking-widest font-bold">Layanan Digital</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-extrabold text-bika-yellow mb-2">
                  {content.stats_response || '24h'}
                </div>
                <div className="text-blue-200 text-sm uppercase tracking-widest font-bold">Respon Pengaduan</div>
              </div>
            </div>
          </div>
        </section>

        <GallerySection />

        <News />
        
        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-bika-yellow/5 z-0"></div>
          <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8">Siap Melayani Kebutuhan Anda</h2>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Butuh bantuan atau informasi lebih lanjut mengenai layanan kami? Tim kami siap membantu anda kapan saja.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a href="https://wa.me/628123456789" target="_blank" rel="noreferrer" className="w-full sm:w-auto bg-green-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-green-700 transition-all shadow-xl shadow-green-500/20 active:scale-95">
                WhatsApp Center
              </a>
              <a href="#profil" className="w-full sm:w-auto bg-blue-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-blue-800 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
                Profil Lengkap
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer content={content} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/page/:slug" element={<StaticPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
