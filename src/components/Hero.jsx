import React from 'react';

export default function Hero({ content }) {
  return (
    <div className="relative bg-blue-900 text-white min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background patterns/overlay */}
      <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=2000" 
          alt="District Office" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Decorative gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-transparent z-10"></div>

      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-block px-3 py-1 bg-bika-yellow/20 border border-bika-yellow/30 rounded-full mb-6 animate-pulse">
          <span className="text-bika-yellow text-xs font-bold uppercase tracking-widest">Pusat Informasi & Pelayanan</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          {content.hero_title || 'Website Resmi'}
        </h1>
        
        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
          {content.hero_subtitle || 'Pelayanan Cepat, Transparan, dan Profesional untuk Masyarakat Kecamatan Bika, Kabupaten Kapuas Hulu.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button className="w-full sm:w-auto bg-bika-yellow text-blue-900 font-bold px-10 py-4 rounded-xl hover:bg-yellow-400 transition-all shadow-xl hover:shadow-yellow-500/20 active:scale-95 text-lg">
            Akses Layanan
          </button>
          <button className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold px-10 py-4 rounded-xl hover:bg-white/20 transition-all active:scale-95 text-lg">
            Lihat Berita
          </button>
        </div>
      </div>
    </div>
  );
}
