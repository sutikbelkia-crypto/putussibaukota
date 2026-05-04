import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Camera, Play, Album } from 'lucide-react';

export default function GallerySection() {
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [videos, setVideos] = useState([]);
  const [activeType, setActiveType] = useState('photo');
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return url;
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/shorts/')) {
      videoId = url.split('shorts/')[1]?.split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [photosRes, albumsRes, videosRes] = await Promise.all([
          fetch('/api/gallery'),
          fetch('/api/albums'),
          fetch('/api/videos')
        ]);
        
        if (photosRes.ok) setPhotos(await photosRes.json());
        if (albumsRes.ok) setAlbums(await albumsRes.json());
        if (videosRes.ok) setVideos(await videosRes.json());
      } catch (err) {
        console.error('Failed to fetch gallery data:', err);
      }
    };
    fetchData();
  }, []);

  const renderContent = () => {
    if (activeType === 'photo') {
      const displayPhotos = selectedAlbumId ? photos.filter(p => p.album_id === selectedAlbumId) : photos;
      return (
        <div>
          {selectedAlbumId && (
             <button onClick={() => { setActiveType('album'); setSelectedAlbumId(null); }} className="mb-6 text-blue-600 font-bold hover:underline flex items-center space-x-2 transition-all">
                <span>&larr; Kembali ke Album</span>
             </button>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayPhotos.map(photo => (
              <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-3xl bg-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
                <img src={getImageUrl(photo.image)} alt={photo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white font-bold text-sm truncate">{photo.title}</p>
                </div>
              </div>
            ))}
            {displayPhotos.length === 0 && <div className="col-span-full py-20 text-center text-slate-400">Belum ada foto di sini.</div>}
          </div>
        </div>
      );
    }

    if (activeType === 'album') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {albums.map(album => (
            <div key={album.id} className="group cursor-pointer" onClick={() => { setSelectedAlbumId(album.id); setActiveType('photo'); }}>
              <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500">
                <img src={getImageUrl(album.cover_image)} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-slate-900 shadow-sm">
                  {photos.filter(p => p.album_id === album.id).length} Photos
                </div>
              </div>
              <div className="mt-6 px-4">
                <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{album.title}</h3>
                <p className="text-slate-500 text-sm mt-2 line-clamp-2 leading-relaxed">{album.description}</p>
              </div>
            </div>
          ))}
          {albums.length === 0 && <div className="col-span-full py-20 text-center text-slate-400">Belum ada album.</div>}
        </div>
      );
    }

    if (activeType === 'video') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map(video => {
            const embedUrl = getEmbedUrl(video.video_url);
            return (
              <div key={video.id} className="group">
                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                  {embedUrl ? (
                    <iframe 
                      src={embedUrl} 
                      className="w-full h-full absolute inset-0" 
                      allowFullScreen 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      title={video.title}
                    ></iframe>
                  ) : (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play size={64} className="text-white opacity-40 group-hover:scale-110 group-hover:text-bika-yellow transition-all duration-300" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-8 left-8 right-8">
                        <h3 className="text-white font-black text-2xl truncate">{video.title}</h3>
                        <p className="text-blue-200 text-sm mt-2 truncate opacity-0 group-hover:opacity-100 transition-opacity">{video.video_url}</p>
                      </div>
                    </>
                  )}
                </div>
                {embedUrl && (
                  <div className="mt-4 px-4">
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{video.title}</h3>
                  </div>
                )}
              </div>
            );
          })}
          {videos.length === 0 && <div className="col-span-full py-20 text-center text-slate-400">Belum ada video.</div>}
        </div>
      );
    }
  };

  return (
    <section id="galeri" className="py-32 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 blur-[100px] rounded-full -mr-48 -mt-48"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-8 md:space-y-0">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
              <ImageIcon size={14} />
              <span>Visual Dokumentasi</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
              Galeri Kegiatan <span className="text-blue-600">Kelurahan Putussibau Kota</span>
            </h2>
            <p className="text-slate-500 mt-6 text-lg max-w-xl">
              Melihat lebih dekat kegiatan masyarakat dan perkembangan pembangunan di wilayah kami.
            </p>
          </div>

          <div className="flex bg-white p-2 rounded-[2rem] shadow-xl border border-slate-100 self-start">
            <button 
              onClick={() => { setActiveType('photo'); setSelectedAlbumId(null); }}
              className={`flex items-center space-x-2 px-8 py-4 rounded-[1.5rem] font-black text-sm transition-all ${activeType === 'photo' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Camera size={18} />
              <span>Photos</span>
            </button>
            <button 
              onClick={() => { setActiveType('album'); setSelectedAlbumId(null); }}
              className={`flex items-center space-x-2 px-8 py-4 rounded-[1.5rem] font-black text-sm transition-all ${activeType === 'album' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Album size={18} />
              <span>Albums</span>
            </button>
            <button 
              onClick={() => { setActiveType('video'); setSelectedAlbumId(null); }}
              className={`flex items-center space-x-2 px-8 py-4 rounded-[1.5rem] font-black text-sm transition-all ${activeType === 'video' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Play size={18} />
              <span>Videos</span>
            </button>
          </div>
        </div>

        {renderContent()}

        <div className="mt-20 text-center">
          <button className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-xl active:scale-95">
            Lihat Semua Dokumentasi
          </button>
        </div>
      </div>
    </section>
  );
}
