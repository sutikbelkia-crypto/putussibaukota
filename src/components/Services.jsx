import React, { useState, useEffect } from 'react';

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.ok ? res.json() : [])
      .then(data => setServices(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error('Error fetching services:', err);
        setServices([]);
      });
  }, []);

  // Default icons/colors if none provided by backend
  const getStyle = (idx) => {
    const styles = [
      { color: 'bg-blue-50 text-blue-600', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
      { color: 'bg-yellow-50 text-yellow-600', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
      { color: 'bg-green-50 text-green-600', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
      { color: 'bg-red-50 text-red-600', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' }
    ];
    return styles[idx % styles.length];
  };

  return (
    <section id="layanan" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-blue-900 uppercase tracking-widest mb-3">Layanan Kami</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">Akses Layanan Publik Terpadu</h3>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Kami berkomitmen memberikan pelayanan terbaik dengan kemudahan akses bagi seluruh lapisan masyarakat.
          </p>
         </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(services.length > 0 ? services : [1,2,3,4]).map((service, idx) => {
            const style = getStyle(idx);
            return (
              <div 
                key={service.id || idx} 
                className="group p-8 rounded-3xl border border-gray-100 bg-white hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
              >
                <div className={`w-16 h-16 ${style.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={style.icon} />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{service.title || 'Layanan Masyarakat'}</h4>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {service.desc || 'Deskripsi pelayanan yang diberikan oleh Kelurahan Putussibau Kota untuk seluruh warga.'}
                </p>
                <div className="mt-6 flex items-center text-blue-900 font-bold text-sm cursor-pointer hover:translate-x-2 transition-transform">
                  Selengkapnya
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
