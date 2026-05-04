import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  FileText, 
  Image as ImageIcon, 
  Download, 
  Link as LinkIcon, 
  Globe, 
  Users, 
  Menu, 
  ChevronRight, 
  LogOut,
  Save,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  ChevronDown,
  PlusCircle,
  Footprints
} from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedMenus, setExpandedMenus] = useState(['settings', 'content']);
  const [content, setContent] = useState({});
  const [menu, setMenu] = useState([]);
  const [subMenu, setSubMenu] = useState([]);
  const [users, setUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showSubMenuModal, setShowSubMenuModal] = useState(false);
  const [showMainMenuModal, setShowMainMenuModal] = useState(false);
  const [showPageModal, setShowPageModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingSubMenuId, setEditingSubMenuId] = useState(null);
  const [editingMainMenuId, setEditingMainMenuId] = useState(null);
  const [editingPageId, setEditingPageId] = useState(null);
  const [newUserForm, setNewUserForm] = useState({ username: '', password: '' });
  const [subMenuForm, setSubMenuForm] = useState({ parent_id: '', label: '', link: '', order: 1 });
  const [mainMenuForm, setMainMenuForm] = useState({ label: '', link: '', order: 1 });
  const [pageForm, setPageForm] = useState({ title: '', slug: '', content: '', image: '' });
  const [staticPages, setStaticPages] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [videos, setVideos] = useState([]);
  const [articles, setArticles] = useState([]);
  const [services, setServices] = useState([]);
  const [galleryForm, setGalleryForm] = useState({ title: '', image: '', album_id: '' });
  const [albumForm, setAlbumForm] = useState({ title: '', description: '', cover_image: '' });
  const [videoForm, setVideoForm] = useState({ title: '', video_url: '', thumbnail: '' });
  const [articleForm, setArticleForm] = useState({ title: '', date: '', category: '', image: '', content: '' });
  const [serviceForm, setServiceForm] = useState({ title: '', desc: '', icon: '', color: '' });
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const [editingAlbumId, setEditingAlbumId] = useState(null);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    try {
      const endpoints = ['content', 'menu', 'submenu', 'users', 'static_pages', 'gallery', 'albums', 'videos', 'articles', 'services'];
      
      const [contentData, menuData, subMenuData, usersData, pagesData, photosData, albumsData, videosData, articlesData, servicesData] = await Promise.all(
        endpoints.map(ep => 
          fetch(`/api/${ep}`, { headers })
            .then(res => res.ok ? res.json() : [])
            .catch(() => [])
        )
      );

      setContent(contentData || {});
      setMenu(menuData || []);
      setSubMenu(subMenuData || []);
      setUsers(usersData || []);
      setStaticPages(pagesData || []);
      setPhotos(photosData || []);
      console.log('Photos fetched:', photosData);
      setAlbums(albumsData || []);
      setVideos(videosData || []);
      setArticles(articlesData || []);
      setServices(servicesData || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setLoading(false);
    }
  };

  const toggleExpand = (menuId) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) ? prev.filter(m => m !== menuId) : [...prev, menuId]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const SidebarItem = ({ id, icon: Icon, label, hasSubmenu, subItems, action }) => {
    const active = activeTab === id || (subItems && subItems.some(s => s.id === activeTab));
    const isExpanded = expandedMenus.includes(id);

    return (
      <div className="mb-2">
        <button 
          onClick={() => {
            if (hasSubmenu) {
              setExpandedMenus(prev => 
                prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
              );
            } else {
              setActiveTab(id);
            }
          }}
          className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group ${
            active 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 translate-x-1' 
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-white/20' : 'bg-slate-800/50 group-hover:bg-slate-700'}`}>
              <Icon size={20} className={active ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'} />
            </div>
            <span className="font-bold text-sm tracking-wide">{label}</span>
          </div>
          {hasSubmenu && (
            <ChevronRight size={18} className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''} ${active ? 'text-white' : 'text-slate-600'}`} />
          )}
        </button>
        
        {hasSubmenu && isExpanded && (
          <div className="mt-2 ml-6 space-y-1 border-l-2 border-slate-800/50 pl-4 animate-in slide-in-from-top-2 duration-300">
            {subItems.map(item => (
              <div key={item.id} className="flex items-center group/sub">
                <button 
                  onClick={() => setActiveTab(item.id)}
                  className={`flex-1 text-left py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                    activeTab === item.id 
                      ? 'text-blue-400 bg-blue-400/10' 
                      : 'text-slate-500 hover:text-white hover:bg-slate-800/30'
                  }`}
                >
                  {item.label}
                </button>
                {item.onAction && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); item.onAction(); }}
                    className="p-2 opacity-0 group-hover/sub:opacity-100 text-slate-500 hover:text-blue-400 transition-all hover:bg-slate-800 rounded-lg ml-1"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-medium tracking-widest text-blue-400">MEMUAT DASHBOARD...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 relative">
      {message && (
        <div className="fixed top-20 right-8 z-[100] animate-in slide-in-from-right-8 duration-300">
           <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-emerald-500/20 flex items-center space-x-3 font-bold">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">✓</div>
              <span>{message}</span>
           </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-80 bg-[#0f172a] text-white overflow-y-auto z-20 border-r border-slate-800/50 shadow-2xl">
        <div className="p-8 border-b border-slate-800/50 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/40 rotate-3 hover:rotate-0 transition-transform">
              <span className="text-white font-black text-2xl">B</span>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">PUTUSSIBAU KOTA <span className="text-blue-500">CMS</span></h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Official Admin</p>
            </div>
          </div>
        </div>
        
        <nav className="p-6">
          <div className="px-4 mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Main Menu</div>
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          
          <div className="my-6 border-t border-slate-800/50 mx-4"></div>
          <div className="px-4 mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Content Management</div>
          
          <SidebarItem 
            id="settings" 
            icon={Settings} 
            label="Pengaturan" 
            hasSubmenu 
            subItems={[
              { id: 'main-menu', label: 'Main Menu' },
              { id: 'sub-menu', label: 'Sub Menu' },
              { id: 'site-setting', label: 'Site Setting' },
              { id: 'footer-setting', label: 'Footer' }
            ]} 
          />
          
          <SidebarItem 
            id="content" 
            icon={FileText} 
            label="Konten" 
            hasSubmenu 
            subItems={[
              { 
                id: 'news', 
                label: 'Berita & Artikel',
                onAction: () => {
                  setActiveTab('news');
                  setEditingArticleId(null);
                  setArticleForm({ title: '', date: '', category: '', image: '', content: '' });
                  setShowArticleModal(true);
                }
              },
              { 
                id: 'services', 
                label: 'Layanan',
                onAction: () => {
                  setActiveTab('services');
                  setEditingServiceId(null);
                  setServiceForm({ title: '', desc: '', icon: '', color: '' });
                  setShowServiceModal(true);
                }
              }
            ]} 
          />
          
          <SidebarItem id="static-pages" icon={FileText} label="Halaman Statis" />
          
          <SidebarItem 
            id="gallery" 
            icon={ImageIcon} 
            label="Galeri" 
            hasSubmenu 
            subItems={[
              { 
                id: 'gallery-photo', 
                label: 'Photo',
                onAction: () => {
                  setActiveTab('gallery-photo');
                  setEditingGalleryId(null);
                  setGalleryForm({ title: '', image: '', album_id: '' });
                  setShowGalleryModal(true);
                }
              },
              { 
                id: 'gallery-album', 
                label: 'Album',
                onAction: () => {
                  setActiveTab('gallery-album');
                  setEditingAlbumId(null);
                  setAlbumForm({ title: '', description: '', cover_image: '' });
                  setShowAlbumModal(true);
                }
              },
              { 
                id: 'gallery-video', 
                label: 'Video',
                onAction: () => {
                  setActiveTab('gallery-video');
                  setEditingVideoId(null);
                  setVideoForm({ title: '', video_url: '', thumbnail: '' });
                  setShowVideoModal(true);
                }
              }
            ]} 
          />
          
          <SidebarItem id="download" icon={Download} label="Download" />
          <SidebarItem id="related-links" icon={LinkIcon} label="Link Terkait" />
          <SidebarItem id="landing-page" icon={Globe} label="Landing Page" />
          <SidebarItem id="opd-links" icon={Globe} label="Link OPD" />
          
          <div className="my-6 border-t border-slate-800/50 mx-4"></div>
          <div className="px-4 mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">System</div>
          
          <SidebarItem id="users" icon={Users} label="Users" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 ml-80">
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center space-x-2 text-slate-400 text-sm">
            <span>Admin</span>
            <ChevronRight size={14} />
            <span className="text-slate-900 font-semibold capitalize">{activeTab.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center space-x-4">
             <div className="text-right mr-2 hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{localStorage.getItem('username') || 'Administrator'}</p>
                <p className="text-[10px] text-green-500 font-bold uppercase mt-1">Online</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm">
                {localStorage.getItem('username')?.charAt(0).toUpperCase() || 'A'}
             </div>
          </div>
        </header>

        <div className="p-8 md:p-10 flex-1 overflow-y-auto">
          {renderContent(activeTab, { 
            content, setContent, 
            menu, setMenu,
            subMenu, setSubMenu,
            users, setUsers,
            saving, setSaving, 
            message, setMessage, 
            fetchData,
            showUserModal, setShowUserModal,
            showSubMenuModal, setShowSubMenuModal,
            showMainMenuModal, setShowMainMenuModal,
            showPageModal, setShowPageModal,
            editingUserId, setEditingUserId,
            editingSubMenuId, setEditingSubMenuId,
            editingMainMenuId, setEditingMainMenuId,
            editingPageId, setEditingPageId,
            newUserForm, setNewUserForm,
            subMenuForm, setSubMenuForm,
            mainMenuForm, setMainMenuForm,
            pageForm, setPageForm,
            staticPages, setStaticPages,
            photos, setPhotos,
            albums, setAlbums,
            videos, setVideos,
            galleryForm, setGalleryForm,
            albumForm, setAlbumForm,
            videoForm, setVideoForm,
            showGalleryModal, setShowGalleryModal,
            showAlbumModal, setShowAlbumModal,
            showVideoModal, setShowVideoModal,
            showArticleModal, setShowArticleModal,
            showServiceModal, setShowServiceModal,
            editingGalleryId, setEditingGalleryId,
            editingAlbumId, setEditingAlbumId,
            editingVideoId, setEditingVideoId,
            editingArticleId, setEditingArticleId,
            editingServiceId, setEditingServiceId,
            articles, setArticles,
            services, setServices,
            articleForm, setArticleForm,
            serviceForm, setServiceForm
          })}
        </div>
      </main>
    </div>
  );
}

function renderContent(tab, props) {
  const { 
    content, setContent, 
    menu, 
    subMenu,
    users, 
    saving, setSaving, 
    setMessage, 
    fetchData,
    showUserModal, setShowUserModal,
    showSubMenuModal, setShowSubMenuModal,
    showMainMenuModal, setShowMainMenuModal,
    showPageModal, setShowPageModal,
    editingUserId, setEditingUserId,
    editingSubMenuId, setEditingSubMenuId,
    editingMainMenuId, setEditingMainMenuId,
    editingPageId, setEditingPageId,
    newUserForm, setNewUserForm,
    subMenuForm, setSubMenuForm,
    mainMenuForm, setMainMenuForm,
    pageForm, setPageForm,
    staticPages, setStaticPages,
    photos, setPhotos,
    albums, setAlbums,
    videos, setVideos,
    galleryForm, setGalleryForm,
    albumForm, setAlbumForm,
    videoForm, setVideoForm,
    showGalleryModal, setShowGalleryModal,
    showAlbumModal, setShowAlbumModal,
    showVideoModal, setShowVideoModal,
    showArticleModal, setShowArticleModal,
    showServiceModal, setShowServiceModal,
    editingGalleryId, setEditingGalleryId,
    editingAlbumId, setEditingAlbumId,
    editingVideoId, setEditingVideoId,
    editingArticleId, setEditingArticleId,
    editingServiceId, setEditingServiceId,
    articles, setArticles,
    services, setServices,
    articleForm, setArticleForm,
    serviceForm, setServiceForm
  } = props;

  const handleSaveContent = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content }),
      });
      if (response.ok) {
        setMessage('Konten berhasil disimpan!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  switch (tab) {
    case 'dashboard':
      return (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Dashboard</h1>
              <p className="text-slate-500 mt-1">Selamat datang kembali di panel administrasi.</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold shadow-sm">
               {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Berita" value={12} icon={FileText} color="blue" />
            <StatCard label="Total Menu" value={menu.length} icon={Menu} color="indigo" />
            <StatCard label="Pengunjung" value="1,284" icon={Users} color="emerald" />
            <StatCard label="Layanan Digital" value="100%" icon={Globe} color="amber" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h2 className="font-bold text-xl mb-6">Aktifitas Terakhir</h2>
                <div className="space-y-4">
                   {[1,2,3].map(i => (
                     <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center space-x-4">
                           <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                              <Edit2 size={18} />
                           </div>
                           <div>
                              <p className="text-sm font-bold">Pembaruan Konten Hero</p>
                              <p className="text-xs text-slate-400">10 menit yang lalu oleh admin</p>
                           </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300" />
                     </div>
                   ))}
                </div>
             </div>
             <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between">
                <div>
                   <h2 className="font-bold text-xl mb-2">Pusat Bantuan</h2>
                   <p className="text-blue-200 text-sm">Butuh bantuan teknis atau ada kendala pada sistem?</p>
                </div>
                <button className="w-full bg-white text-blue-900 font-bold py-3 rounded-2xl mt-8 hover:bg-blue-50 transition-all">
                   Hubungi Developer
                </button>
             </div>
          </div>
        </div>
      );

    case 'landing-page':
      return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center">
             <div>
                <h1 className="text-3xl font-black text-slate-900">Landing Page</h1>
                <p className="text-slate-500 mt-1">Kelola elemen visual utama halaman depan.</p>
             </div>
             <button 
                onClick={handleSaveContent}
                disabled={saving}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
             >
                <Save size={18} />
                <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
             </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card title="Hero Section">
               <div className="space-y-6">
                 <div>
                   <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Hero Title</label>
                   <input 
                     className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                     value={content.hero_title || ''}
                     onChange={e => setContent({...content, hero_title: e.target.value})}
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Hero Subtitle</label>
                   <textarea 
                     rows="4"
                     className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                     value={content.hero_subtitle || ''}
                     onChange={e => setContent({...content, hero_subtitle: e.target.value})}
                   />
                 </div>
               </div>
            </Card>

            <Card title="Statistik Dashboard">
               <div className="grid grid-cols-2 gap-6">
                 {['villages', 'population', 'digital', 'response'].map(key => (
                   <div key={key}>
                     <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">{key.replace('_', ' ')}</label>
                     <input 
                       className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-blue-600"
                       value={content[`stats_${key}`] || ''}
                       onChange={e => setContent({...content, [`stats_${key}`]: e.target.value})}
                     />
                   </div>
                 ))}
               </div>
            </Card>
          </div>
        </div>
      );

    case 'news':
      const handleNewsSubmit = async (e) => {
        e.preventDefault();
        const method = editingArticleId ? 'PUT' : 'POST';
        const url = editingArticleId ? `/api/articles/${editingArticleId}` : '/api/articles';
        try {
          const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify(articleForm),
          });
          if (response.ok) {
            setShowArticleModal(false);
            setEditingArticleId(null);
            fetchData();
            setMessage(editingArticleId ? 'Berita diperbarui!' : 'Berita ditambahkan!');
            setTimeout(() => setMessage(''), 3000);
          }
        } catch (err) {
          console.error('Error saving news:', err);
        }
      };

      const handleEditNews = (item) => {
        setEditingArticleId(item.id);
        setArticleForm({ title: item.title, date: item.date, category: item.category, image: item.image, content: item.content });
        setShowArticleModal(true);
      };

      const handleDeleteNews = async (id) => {
        if (!window.confirm('Hapus berita ini?')) return;
        try {
          const response = await fetch(`/api/articles/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          });
          if (response.ok) {
            fetchData();
            setMessage('Berita dihapus');
            setTimeout(() => setMessage(''), 3000);
          }
        } catch (err) {
          console.error('Error deleting news:', err);
        }
      };

      const handleNewsImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: formData
          });
          const data = await res.json();
          if (res.ok) setArticleForm({ ...articleForm, image: data.imageUrl });
        } catch (err) {
          console.error('Error uploading image', err);
        }
      };

      return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="flex justify-between items-center">
             <div>
                <h1 className="text-3xl font-black text-slate-900">Berita & Artikel</h1>
                <p className="text-slate-500 mt-1">Kelola publikasi berita terbaru.</p>
             </div>
             <button 
                onClick={() => {
                  setEditingArticleId(null);
                  setArticleForm({ title: '', date: new Date().toISOString().split('T')[0], category: 'Berita', image: '', content: '' });
                  setShowArticleModal(true);
                }}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
             >
                <Plus size={18} />
                <span>Tambah Berita</span>
             </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                   <tr>
                      <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest">Gambar</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest">Judul</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest">Kategori</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest">Tanggal</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest text-right">Aksi</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {props.articles?.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                         <td className="px-6 py-4">
                            {item.image ? <img src={item.image} alt={item.title} className="w-16 h-12 object-cover rounded-lg shadow-sm" /> : <div className="w-16 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400"><ImageIcon size={16}/></div>}
                         </td>
                         <td className="px-6 py-4 font-bold text-slate-900">{item.title}</td>
                         <td className="px-6 py-4"><span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider">{item.category}</span></td>
                         <td className="px-6 py-4 text-sm text-slate-400 font-medium">{item.date}</td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                               <button onClick={() => handleEditNews(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                               <button onClick={() => handleDeleteNews(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
             {(!props.articles || props.articles.length === 0) && <div className="p-12 text-center text-slate-400 font-medium italic">Belum ada berita.</div>}
          </div>

          {showArticleModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                <div className="p-8 bg-white border-b border-slate-100 flex justify-between items-center shrink-0">
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editingArticleId ? 'Edit Berita' : 'Tambah Berita'}</h2>
                   <button onClick={() => setShowArticleModal(false)} className="text-slate-300 hover:text-slate-900 transition-colors">
                      <Plus size={28} className="rotate-45" />
                   </button>
                </div>
                <div className="overflow-y-auto p-8">
                  <form id="news-form" onSubmit={handleNewsSubmit} className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Judul Berita</label>
                          <input required className="w-full px-6 py-4 rounded-[1.2rem] bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700" value={articleForm.title} onChange={v => setArticleForm({...articleForm, title: v.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Kategori</label>
                          <input required className="w-full px-6 py-4 rounded-[1.2rem] bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700" value={articleForm.category} onChange={v => setArticleForm({...articleForm, category: v.target.value})} />
                       </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Tanggal</label>
                          <input type="date" required className="w-full px-6 py-4 rounded-[1.2rem] bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700" value={articleForm.date} onChange={v => setArticleForm({...articleForm, date: v.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Cover Image</label>
                          <div className="flex items-center space-x-4">
                             <input type="file" accept="image/*" onChange={handleNewsImageUpload} className="hidden" id="news-image-upload" />
                             <label htmlFor="news-image-upload" className="flex items-center justify-center space-x-2 bg-blue-50 text-blue-600 px-6 py-4 rounded-[1.2rem] font-bold cursor-pointer hover:bg-blue-100 transition-colors flex-1 text-center">
                                <ImageIcon size={18} />
                                <span>Pilih Gambar</span>
                             </label>
                             {articleForm.image && <img src={articleForm.image} alt="preview" className="w-16 h-12 object-cover rounded-xl" />}
                          </div>
                       </div>
                     </div>
                     <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Konten Berita</label>
                        <div className="border-2 border-slate-100 rounded-[1.2rem] overflow-hidden">
                           <Editor
                             tinymceScriptSrc='/tinymce/tinymce.min.js'
                             value={articleForm.content}
                             onEditorChange={(content) => setArticleForm(prev => ({ ...prev, content }))}
                             init={{
                               height: 400,
                               menubar: false,
                               plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'],
                               toolbar: 'undo redo | blocks | bold italic textcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                               content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                               promotion: false,
                               branding: false,
                               license_key: 'gpl'
                             }}
                           />
                        </div>
                     </div>
                  </form>
                </div>
                <div className="p-8 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                   <button type="button" onClick={() => setShowArticleModal(false)} className="text-slate-500 font-black text-lg hover:text-slate-900 transition-colors px-4">Batal</button>
                   <button form="news-form" type="submit" className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">
                     {editingArticleId ? 'Simpan' : 'Tambah'}
                   </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );

    case 'services':
      const handleServiceSubmit = async (e) => {
        e.preventDefault();
        const method = editingServiceId ? 'PUT' : 'POST';
        const url = editingServiceId ? `/api/services/${editingServiceId}` : '/api/services';
        try {
          const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify(serviceForm),
          });
          if (response.ok) {
            setShowServiceModal(false);
            setEditingServiceId(null);
            fetchData();
            setMessage(editingServiceId ? 'Layanan diperbarui!' : 'Layanan ditambahkan!');
            setTimeout(() => setMessage(''), 3000);
          }
        } catch (err) {
          console.error('Error saving service:', err);
        }
      };

      const handleEditService = (item) => {
        setEditingServiceId(item.id);
        setServiceForm({ title: item.title, desc: item.desc, icon: item.icon || '', color: item.color || '' });
        setShowServiceModal(true);
      };

      const handleDeleteService = async (id) => {
        if (!window.confirm('Hapus layanan ini?')) return;
        try {
          const response = await fetch(`/api/services/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          });
          if (response.ok) {
            fetchData();
            setMessage('Layanan dihapus');
            setTimeout(() => setMessage(''), 3000);
          }
        } catch (err) {
          console.error('Error deleting service:', err);
        }
      };

      return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="flex justify-between items-center">
             <div>
                <h1 className="text-3xl font-black text-slate-900">Layanan</h1>
                <p className="text-slate-500 mt-1">Kelola jenis pelayanan publik.</p>
             </div>
             <button 
                onClick={() => {
                  setEditingServiceId(null);
                  setServiceForm({ title: '', desc: '', icon: '', color: '' });
                  setShowServiceModal(true);
                }}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
             >
                <Plus size={18} />
                <span>Tambah Layanan</span>
             </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                   <tr>
                      <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest">Nama Layanan</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest">Deskripsi Singkat</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest text-right">Aksi</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {props.services?.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                         <td className="px-6 py-4 font-bold text-slate-900">{item.title}</td>
                         <td className="px-6 py-4 text-sm text-slate-400 font-medium max-w-md truncate">{item.desc}</td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                               <button onClick={() => handleEditService(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                               <button onClick={() => handleDeleteService(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
             {(!props.services || props.services.length === 0) && <div className="p-12 text-center text-slate-400 font-medium italic">Belum ada layanan.</div>}
          </div>

          {showServiceModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-10 bg-white flex justify-between items-center">
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editingServiceId ? 'Edit Layanan' : 'Tambah Layanan'}</h2>
                   <button onClick={() => setShowServiceModal(false)} className="text-slate-300 hover:text-slate-900 transition-colors">
                      <Plus size={28} className="rotate-45" />
                   </button>
                </div>
                <form onSubmit={handleServiceSubmit} className="px-10 pb-10 space-y-8">
                   <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nama Layanan</label>
                      <input required className="w-full px-6 py-5 rounded-[1.2rem] bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700" value={serviceForm.title} onChange={v => setServiceForm({...serviceForm, title: v.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Deskripsi Singkat</label>
                      <textarea required rows="4" className="w-full px-6 py-5 rounded-[1.2rem] bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700 resize-none" value={serviceForm.desc} onChange={v => setServiceForm({...serviceForm, desc: v.target.value})}></textarea>
                   </div>
                   <div className="pt-6 flex items-center justify-between">
                      <button type="button" onClick={() => setShowServiceModal(false)} className="text-slate-500 font-black text-lg hover:text-slate-900 transition-colors px-4">Batal</button>
                      <button type="submit" className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">
                        {editingServiceId ? 'Simpan' : 'Tambah'}
                      </button>
                   </div>
                </form>
              </div>
            </div>
          )}
        </div>
      );

    case 'site-setting':
      return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="flex justify-between items-center">
             <div>
                <h1 className="text-3xl font-black text-slate-900">Site Setting</h1>
                <p className="text-slate-500 mt-1">Konfigurasi dasar website dan informasi kontak.</p>
             </div>
             <button 
                onClick={handleSaveContent}
                disabled={saving}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
             >
                <Save size={18} />
                <span>{saving ? 'Menyimpan...' : 'Simpan Konfigurasi'}</span>
             </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card title="Informasi Instansi">
               <div className="space-y-6">
                  <Input label="Nama Website / Instansi" value={content.site_name} onChange={v => setContent({...content, site_name: v})} />
                  <Input label="Alamat Kantor" value={content.site_address} onChange={v => setContent({...content, site_address: v})} />
               </div>
            </Card>
            <Card title="Kontak & Media Sosial">
               <div className="space-y-6">
                  <Input label="Email Resmi" value={content.site_email} onChange={v => setContent({...content, site_email: v})} />
                  <Input label="Nomor Telepon" value={content.site_phone} onChange={v => setContent({...content, site_phone: v})} />
               </div>
            </Card>
          </div>
        </div>
      );

    case 'sub-menu':
      const handleSubMenuSubmit = async (e) => {
        e.preventDefault();
        const method = editingSubMenuId ? 'PUT' : 'POST';
        const url = editingSubMenuId 
          ? `/api/submenu/${editingSubMenuId}` 
          : '/api/submenu';

        try {
          const response = await fetch(url, {
            method,
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(subMenuForm),
          });
          if (response.ok) {
            setShowSubMenuModal(false);
            setEditingSubMenuId(null);
            fetchData();
            setMessage(editingSubMenuId ? 'Sub Menu diperbarui!' : 'Sub Menu ditambahkan!');
            setTimeout(() => setMessage(''), 3000);
          } else {
            if (response.status === 401 || response.status === 403) {
              alert('Sesi Anda telah berakhir. Silakan login kembali.');
              navigate('/login');
              return;
            }
            let errorMessage = response.statusText;
            try {
              const errorData = await response.json();
              errorMessage = errorData.error || errorMessage;
            } catch (e) {
              // Not JSON
            }
            alert(`Gagal menyimpan Sub Menu: ${errorMessage}`);
          }
        } catch (err) {
          console.error('Error saving submenu:', err);
          alert('Terjadi kesalahan saat menghubungi server.');
        }
      };

      const handleEditSubMenu = (item) => {
        setEditingSubMenuId(item.id);
        setSubMenuForm({ parent_id: item.parent_id, label: item.label, link: item.link, order: item.order });
        setShowSubMenuModal(true);
      };

      const handleDeleteSubMenu = async (id) => {
        if (!window.confirm('Hapus sub menu ini?')) return;
        try {
          const response = await fetch(`/api/submenu/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          });
          if (response.ok) {
            fetchData();
            setMessage('Sub Menu dihapus');
            setTimeout(() => setMessage(''), 3000);
          }
        } catch (err) {
          console.error('Error deleting submenu:', err);
        }
      };

      return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="flex justify-between items-center">
             <div>
                <h1 className="text-3xl font-black text-slate-900">Sub Menu</h1>
                <p className="text-slate-500 mt-1">Kelola sub-navigasi untuk menu utama.</p>
             </div>
             <button 
                onClick={() => {
                  setEditingSubMenuId(null);
                  setSubMenuForm({ parent_id: menu[0]?.id || '', label: '', link: '', order: (subMenu?.length || 0) + 1 });
                  setShowSubMenuModal(true);
                }}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
             >
                <Plus size={18} />
                <span>Tambah Sub Menu</span>
             </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                   <tr>
                      <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest">Parent Menu</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest">Label</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest">Link</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest text-right">Aksi</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {props.subMenu.map(item => {
                     const parent = menu.find(m => m.id === item.parent_id);
                     return (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4"><span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider">{parent?.label || 'Unknown'}</span></td>
                           <td className="px-6 py-4 font-bold text-slate-900">{item.label}</td>
                           <td className="px-6 py-4 text-sm text-slate-400 font-medium">{item.link}</td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                 <button onClick={() => handleEditSubMenu(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                                 <button onClick={() => handleDeleteSubMenu(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                              </div>
                           </td>
                        </tr>
                     );
                   })}
                </tbody>
             </table>
             {props.subMenu.length === 0 && <div className="p-12 text-center text-slate-400 font-medium italic">Belum ada sub menu.</div>}
          </div>

          {/* Sub Menu Modal */}
          {showSubMenuModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-10 bg-white flex justify-between items-center">
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editingSubMenuId ? 'Edit Sub Menu' : 'Tambah Sub Menu'}</h2>
                   <button onClick={() => setShowSubMenuModal(false)} className="text-slate-300 hover:text-slate-900 transition-colors">
                      <Plus size={28} className="rotate-45" />
                   </button>
                </div>
                <form onSubmit={handleSubMenuSubmit} className="px-10 pb-10 space-y-8">
                   <div className="space-y-2">
                     <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Parent Menu</label>
                     <div className="relative">
                        <select 
                           className="w-full px-6 py-5 rounded-[1.2rem] bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700 appearance-none"
                           value={subMenuForm.parent_id}
                           onChange={e => setSubMenuForm({...subMenuForm, parent_id: parseInt(e.target.value)})}
                        >
                           <option value="" disabled>Pilih Menu Utama</option>
                           {menu.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                           <ChevronDown size={20} />
                        </div>
                     </div>
                   </div>
                   
                   <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Label Sub Menu</label>
                      <input 
                         className="w-full px-6 py-5 rounded-[1.2rem] bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                         value={subMenuForm.label}
                         onChange={v => setSubMenuForm({...subMenuForm, label: v.target.value})}
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Link URL</label>
                      <input 
                         className="w-full px-6 py-5 rounded-[1.2rem] bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                         value={subMenuForm.link}
                         onChange={v => setSubMenuForm({...subMenuForm, link: v.target.value})}
                      />
                   </div>

                   <div className="pt-6 flex items-center justify-between">
                      <button 
                        type="button" 
                        onClick={() => setShowSubMenuModal(false)} 
                        className="text-slate-500 font-black text-lg hover:text-slate-900 transition-colors px-4"
                      >
                        Batal
                      </button>
                      <button 
                        type="submit" 
                        className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
                      >
                        {editingSubMenuId ? 'Simpan' : 'Tambah'}
                      </button>
                   </div>
                </form>
              </div>
            </div>
          )}
        </div>
      );
    case 'main-menu':
      const handleMainMenuSubmit = async (e) => {
        e.preventDefault();
        const method = editingMainMenuId ? 'PUT' : 'POST';
        const url = editingMainMenuId 
          ? `/api/menu/${editingMainMenuId}` 
          : '/api/menu';

        try {
          const response = await fetch(url, {
            method,
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(mainMenuForm),
          });
          if (response.ok) {
            setShowMainMenuModal(false);
            setEditingMainMenuId(null);
            fetchData();
            setMessage(editingMainMenuId ? 'Menu Utama diperbarui!' : 'Menu Utama ditambahkan!');
            setTimeout(() => setMessage(''), 3000);
          } else {
            if (response.status === 401 || response.status === 403) {
              alert('Sesi Anda telah berakhir. Silakan login kembali.');
              navigate('/login');
              return;
            }
            let errorMessage = response.statusText;
            try {
              const errorData = await response.json();
              errorMessage = errorData.error || errorMessage;
            } catch (e) {
              // Not JSON
            }
            alert(`Gagal menyimpan Menu Utama: ${errorMessage}`);
          }
        } catch (err) {
          console.error('Error saving main menu:', err);
          alert('Terjadi kesalahan saat menghubungi server.');
        }
      };

      const handleEditMainMenu = (item) => {
        setEditingMainMenuId(item.id);
        setMainMenuForm({ label: item.label, link: item.link, order: item.order });
        setShowMainMenuModal(true);
      };

      const handleDeleteMainMenu = async (id) => {
        if (!window.confirm('Hapus menu ini?')) return;
        try {
          const response = await fetch(`/api/menu/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          });
          if (response.ok) {
            fetchData();
            setMessage('Menu dihapus');
            setTimeout(() => setMessage(''), 3000);
          }
        } catch (err) {
          console.error('Error deleting menu:', err);
        }
      };

      return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="flex justify-between items-center">
             <div>
                <h1 className="text-3xl font-black text-slate-900">Main Menu</h1>
                <p className="text-slate-500 mt-1">Kelola navigasi utama website.</p>
             </div>
             <button 
                onClick={() => {
                  setEditingMainMenuId(null);
                  setMainMenuForm({ label: '', link: '', order: menu.length + 1 });
                  setShowMainMenuModal(true);
                }}
                className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95"
             >
                <Plus size={18} />
                <span>Tambah Menu Baru</span>
             </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                   <tr>
                      <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest">Urutan</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest">Label Menu</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest">Link URL</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest text-right">Aksi</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {menu.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                         <td className="px-6 py-4 font-mono text-sm text-slate-400">{item.order || idx + 1}</td>
                         <td className="px-6 py-4 font-bold text-slate-900">{item.label}</td>
                         <td className="px-6 py-4 text-sm text-blue-500 font-medium">{item.link}</td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                               <button onClick={() => handleEditMainMenu(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                               <button onClick={() => handleDeleteMainMenu(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>

          {showMainMenuModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-10 bg-white flex justify-between items-center">
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tambah Menu</h2>
                   <button onClick={() => setShowMainMenuModal(false)} className="text-slate-300 hover:text-slate-900 transition-colors">
                      <Plus size={28} className="rotate-45" />
                   </button>
                </div>
                <form onSubmit={handleMainMenuSubmit} className="px-10 pb-10 space-y-8">
                   <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Label Menu</label>
                      <input 
                         placeholder="organisasi"
                         className="w-full px-6 py-5 rounded-[1.2rem] bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                         value={mainMenuForm.label}
                         onChange={v => setMainMenuForm({...mainMenuForm, label: v.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Link URL</label>
                      <input 
                         className="w-full px-6 py-5 rounded-[1.2rem] bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                         value={mainMenuForm.link}
                         onChange={v => setMainMenuForm({...mainMenuForm, link: v.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Urutan</label>
                      <input 
                         type="number"
                         className="w-full px-6 py-5 rounded-[1.2rem] bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                         value={mainMenuForm.order}
                         onChange={v => setMainMenuForm({...mainMenuForm, order: parseInt(v.target.value) || 0})}
                      />
                   </div>
                   
                   <div className="pt-6 flex items-center justify-between">
                      <button 
                        type="button" 
                        onClick={() => setShowMainMenuModal(false)} 
                        className="text-slate-500 font-black text-lg hover:text-slate-900 transition-colors px-4"
                      >
                        Batal
                      </button>
                      <button 
                        type="submit" 
                        className="bg-[#00a676] text-white px-12 py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20 hover:bg-[#008f65] transition-all active:scale-95"
                      >
                        {editingMainMenuId ? 'Simpan' : 'Tambah'}
                      </button>
                   </div>
                </form>
              </div>
            </div>
          )}
        </div>
      );

    case 'users':
      const handleCreateUser = async (e) => {
        e.preventDefault();
        const method = editingUserId ? 'PUT' : 'POST';
        const url = editingUserId 
          ? `/api/users/${editingUserId}` 
          : '/api/users';

        try {
          const response = await fetch(url, {
            method,
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(newUserForm),
          });
          if (response.ok) {
            setShowUserModal(false);
            setEditingUserId(null);
            setNewUserForm({ username: '', password: '' });
            fetchData();
            setMessage(editingUserId ? 'User berhasil diperbarui!' : 'User berhasil ditambahkan!');
            setTimeout(() => setMessage(''), 3000);
          } else {
            const data = await response.json();
            alert(data.error || 'Gagal menyimpan user');
          }
        } catch (err) {
          console.error('Error saving user:', err);
        }
      };

      const handleEditUser = (user) => {
        setEditingUserId(user.id);
        setNewUserForm({ username: user.username, password: '' }); // Leave password blank for edit unless they want to change it
        setShowUserModal(true);
      };

      const handleDeleteUser = async (id, username) => {
        if (username === localStorage.getItem('username')) {
          alert('Anda tidak bisa menghapus akun Anda sendiri!');
          return;
        }
        if (!window.confirm(`Hapus user "${username}"?`)) return;
        
        try {
          const response = await fetch(`/api/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          });
          if (response.ok) {
            fetchData();
            setMessage('User berhasil dihapus');
            setTimeout(() => setMessage(''), 3000);
          }
        } catch (err) {
          console.error('Error deleting user:', err);
        }
      };

      return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="flex justify-between items-center">
             <div>
                <h1 className="text-3xl font-black text-slate-900">User Management</h1>
                <p className="text-slate-500 mt-1">Daftar pengguna yang memiliki akses backend.</p>
             </div>
             <button 
                onClick={() => {
                  setEditingUserId(null);
                  setNewUserForm({ username: '', password: '' });
                  setShowUserModal(true);
                }}
                className="flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all active:scale-95"
             >
                <Plus size={18} />
                <span>Tambah User</span>
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {users.map(user => (
               <div key={user.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between group">
                  <div className="flex items-center space-x-4">
                     <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 uppercase">
                        {user.username.charAt(0)}
                     </div>
                     <div>
                        <p className="font-bold text-slate-900">{user.username}</p>
                        <p className="text-xs text-slate-400">Administrator</p>
                     </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => handleEditUser(user)}
                      className="text-slate-300 hover:text-blue-500 transition-colors p-2"
                    >
                       <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id, user.username)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-2"
                    >
                       <Trash2 size={18} />
                    </button>
                  </div>
               </div>
             ))}
          </div>

          {/* User Modal */}
          {showUserModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                   <h2 className="text-xl font-black text-slate-900">{editingUserId ? 'Edit Administrator' : 'Tambah Administrator'}</h2>
                   <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-slate-900"><Plus size={24} className="rotate-45" /></button>
                </div>
                <form onSubmit={handleCreateUser} className="p-8 space-y-6">
                   <Input 
                      label="Username" 
                      value={newUserForm.username} 
                      onChange={v => setNewUserForm({...newUserForm, username: v})} 
                   />
                   <Input 
                      label={editingUserId ? "Password Baru (Kosongkan jika tidak diganti)" : "Password"} 
                      type="password"
                      value={newUserForm.password} 
                      onChange={v => setNewUserForm({...newUserForm, password: v})} 
                   />
                   <div className="pt-4 flex space-x-3">
                      <button 
                        type="button"
                        onClick={() => setShowUserModal(false)}
                        className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
                      >
                        Batal
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
                      >
                        {editingUserId ? 'Simpan Perubahan' : 'Simpan User'}
                      </button>
                   </div>
                </form>
              </div>
            </div>
          )}
        </div>
      );

    case 'gallery':
      return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="flex justify-between items-center">
             <div>
                <h1 className="text-3xl font-black text-slate-900">Galeri Foto</h1>
                <p className="text-slate-500 mt-1">Kelola dokumentasi kegiatan dan foto wilayah.</p>
             </div>
             <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">
                <Plus size={18} />
                <span>Upload Foto</span>
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {[1,2,3,4].map(i => (
               <div key={i} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                  <div className="aspect-video bg-slate-100 flex items-center justify-center text-slate-300 overflow-hidden relative">
                     <ImageIcon size={32} />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                        <button className="p-2 bg-white text-slate-900 rounded-xl hover:bg-blue-500 hover:text-white transition-all"><Edit2 size={16} /></button>
                        <button className="p-2 bg-white text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                     </div>
                  </div>
                  <div className="p-5">
                     <p className="font-bold text-slate-900 text-sm">Kegiatan Musrenbang 2026</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Pemerintahan</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      );

    case 'download':
      return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="flex justify-between items-center">
             <div>
                <h1 className="text-3xl font-black text-slate-900">Pusat Unduhan</h1>
                <p className="text-slate-500 mt-1">Kelola dokumen publik, regulasi, dan formulir.</p>
             </div>
             <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">
                <Plus size={18} />
                <span>Upload Dokumen</span>
             </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
             <div className="divide-y divide-slate-100">
                {[1,2,3].map(i => (
                   <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-4">
                         <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                            <FileText size={24} />
                         </div>
                         <div>
                            <p className="font-bold text-slate-900">Peraturan Camat No {i} Tahun 2026</p>
                            <p className="text-xs text-slate-400">PDF • 2.4 MB • Diunduh 124 kali</p>
                         </div>
                      </div>
                      <div className="flex items-center space-x-2">
                         <button className="p-2 text-slate-400 hover:text-blue-600 transition-all"><Edit2 size={18} /></button>
                         <button className="p-2 text-slate-400 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>
      );

    case 'related-links':
      return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="flex justify-between items-center">
             <div>
                <h1 className="text-3xl font-black text-slate-900">Link Terkait</h1>
                <p className="text-slate-500 mt-1">Kelola tautan ke website eksternal atau mitra.</p>
             </div>
             <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95">
                <Plus size={18} />
                <span>Tambah Link</span>
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {['Kementerian Dalam Negeri', 'Pemerintah Kabupaten Kapuas Hulu', 'Layanan Aspirasi Pengaduan'].map((label, idx) => (
               <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between group">
                  <div className="flex items-center space-x-4">
                     <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                        <LinkIcon size={20} />
                     </div>
                     <div>
                        <p className="font-bold text-slate-900">{label}</p>
                        <p className="text-xs text-blue-500 truncate max-w-[200px]">https://link-terkait.go.id/page-{idx}</p>
                     </div>
                  </div>
                  <div className="flex items-center space-x-1">
                     <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                     <button className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
               </div>
             ))}
          </div>
        </div>
      );

    case 'static-pages':
      const handlePageSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        let imageUrl = pageForm.image;

        // Check if there's a new file to upload
        const fileInput = document.getElementById('page-image-input');
        if (fileInput && fileInput.files[0]) {
          const formData = new FormData();
          formData.append('image', fileInput.files[0]);
          
          try {
            const uploadRes = await fetch('/api/upload', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
              body: formData
            });
            if (uploadRes.ok) {
              const data = await uploadRes.json();
              imageUrl = data.imageUrl;
            }
          } catch (err) {
            console.error('Upload failed:', err);
          }
        }

        const method = editingPageId ? 'PUT' : 'POST';
        const url = editingPageId 
          ? `/api/static_pages/${editingPageId}` 
          : '/api/static_pages';

        try {
          const response = await fetch(url, {
            method,
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ ...pageForm, image: imageUrl }),
          });
          if (response.ok) {
            setShowPageModal(false);
            setEditingPageId(null);
            fetchData();
            setMessage(editingPageId ? 'Halaman diperbarui!' : 'Halaman ditambahkan!');
            setTimeout(() => setMessage(''), 3000);
          } else {
            const errData = await response.json().catch(() => ({}));
            alert('Gagal menyimpan halaman: ' + (errData.error || response.statusText));
          }
        } catch (err) {
          console.error('Error saving page:', err);
          alert('Terjadi kesalahan saat menyimpan halaman.');
        } finally {
          setSaving(false);
        }
      };

      const handleEditPage = (page) => {
        setEditingPageId(page.id);
        setPageForm({ title: page.title, slug: page.slug, content: page.content, image: page.image });
        setShowPageModal(true);
      };

      const handleDeletePage = async (id) => {
        if (!window.confirm('Hapus halaman ini?')) return;
        try {
          const response = await fetch(`/api/static_pages/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          });
          if (response.ok) {
            fetchData();
            setMessage('Halaman dihapus');
            setTimeout(() => setMessage(''), 3000);
          }
        } catch (err) {
          console.error('Error deleting page:', err);
        }
      };

      return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="flex justify-between items-center">
             <div>
                <h1 className="text-3xl font-black text-slate-900">Halaman Statis</h1>
                <p className="text-slate-500 mt-1">Kelola konten informasi tetap (Profil, Visi Misi, dll).</p>
             </div>
             <button 
                onClick={() => {
                  setEditingPageId(null);
                  setPageForm({ title: '', slug: '', content: '', image: '' });
                  setShowPageModal(true);
                }}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95"
             >
                <Plus size={18} />
                <span>Tambah Halaman Baru</span>
             </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                   <tr>
                      <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest">Judul Halaman</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest">Slug / URL</th>
                      <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest text-right">Aksi</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {staticPages.map(page => (
                      <tr key={page.id} className="hover:bg-slate-50 transition-colors">
                         <td className="px-6 py-4 font-bold text-slate-900">{page.title}</td>
                         <td className="px-6 py-4 text-sm text-blue-500">/page/{page.slug}</td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                               <button onClick={() => handleEditPage(page)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                               <button onClick={() => handleDeletePage(page.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
             {staticPages.length === 0 && <div className="p-12 text-center text-slate-400 font-medium italic">Belum ada halaman statis.</div>}
          </div>

          {/* Page Modal */}
          {showPageModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-slate-50 rounded-xl w-full max-w-6xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
                <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center space-x-2">
                   <PlusCircle size={24} className="text-slate-700" />
                   <h2 className="text-xl font-bold text-slate-800">Dashboard</h2>
                </div>
                <form onSubmit={handlePageSubmit} className="p-6 space-y-6">
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Judul</label>
                      <input 
                        className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-white"
                        value={pageForm.title} 
                        onChange={e => setPageForm({...pageForm, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} 
                      />
                   </div>
                   
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Isi Page</label>
                      <div className="border border-slate-300 rounded overflow-hidden">
                        <Editor
                          tinymceScriptSrc='/tinymce/tinymce.min.js'
                          value={pageForm.content}
                          init={{
                            height: 400,
                            menubar: true,
                            plugins: [
                              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | formatselect | ' +
                            'bold italic backcolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                            promotion: false, 
                            branding: false,
                            license_key: 'gpl',
                            image_title: true,
                            automatic_uploads: true,
                            file_picker_types: 'image',
                            convert_urls: false,
                            images_upload_handler: (blobInfo) => new Promise((resolve, reject) => {
                              const token = localStorage.getItem('token');
                              if (!token) {
                                reject('Sesi habis, silakan login kembali.');
                                return;
                              }

                              const formData = new FormData();
                              formData.append('image', blobInfo.blob(), blobInfo.filename());

                              fetch('/api/upload', {
                                method: 'POST',
                                headers: { 'Authorization': `Bearer ${token}` },
                                body: formData
                              })
                              .then(async res => {
                                if (!res.ok) {
                                  const text = await res.text();
                                  throw new Error(text || `Server error: ${res.status}`);
                                }
                                return res.json();
                              })
                              .then(data => {
                                if (data && data.imageUrl) {
                                  resolve(data.imageUrl);
                                } else {
                                  reject('Gagal mendapatkan URL gambar');
                                }
                              })
                              .catch(err => {
                                console.error('Upload error:', err);
                                reject('Gagal mengunggah gambar: ' + err.message);
                              });
                            })
                          }}
                          onEditorChange={(content) => setPageForm(prev => ({ ...prev, content }))}
                        />
                      </div>
                   </div>

                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Gambar</label>
                      <div className="p-4 bg-slate-100 border border-slate-200 rounded flex items-center space-x-4">
                         <label className="cursor-pointer bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded border border-slate-300 flex items-center space-x-2 text-sm font-medium transition-colors">
                            <ImageIcon size={16} />
                            <span>Pilih File</span>
                            <input 
                              type="file" 
                              id="page-image-input"
                              className="hidden"
                              accept="image/jpeg,image/jpg,image/png"
                              onChange={(e) => {
                                if (e.target.files[0]) {
                                  // Just to show preview if needed, or we can use the file name
                                  setMessage(`File terpilih: ${e.target.files[0].name}`);
                                  setTimeout(() => setMessage(''), 3000);
                                }
                              }}
                            />
                         </label>
                         <div className="text-xs text-slate-500 italic">
                            Tipe gambar harus JPG/JPEG atau PNG.
                         </div>
                      </div>
                      {pageForm.image && (
                        <div className="mt-2 text-xs text-blue-600 font-medium">Gambar saat ini: {pageForm.image.split('/').pop()}</div>
                      )}
                   </div>

                   <div className="pt-4 flex items-center space-x-3">
                      <button 
                        type="button" 
                        onClick={() => setShowPageModal(false)} 
                        className="px-6 py-2 border border-slate-300 rounded text-slate-600 hover:bg-slate-100 transition-all font-medium text-sm"
                      >
                        Batal
                      </button>
                      <button 
                        type="submit" 
                        disabled={saving}
                        className="px-8 py-2 bg-[#2c3e50] text-white rounded font-bold shadow-lg hover:bg-slate-800 transition-all active:scale-95 text-sm flex items-center space-x-2"
                      >
                        {saving ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : null}
                        <span>{editingPageId ? 'Simpan' : 'Simpan'}</span>
                      </button>
                   </div>
                </form>
              </div>
            </div>
          )}
        </div>
      );
    case 'gallery-photo':
      const handlePhotoSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting Photo:', galleryForm);
        if (!galleryForm.title) { setMessage('Judul foto wajib diisi!'); return; }
        setSaving(true);
        let imageUrl = galleryForm.image;
        const fileInput = document.getElementById('gallery-image-input');
        if (fileInput && fileInput.files[0]) {
          const formData = new FormData();
          formData.append('image', fileInput.files[0]);
          try {
            const uploadRes = await fetch('/api/upload', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
              body: formData
            });
            if (uploadRes.ok) {
              const data = await uploadRes.json();
              imageUrl = data.imageUrl;
            } else {
              const errData = await uploadRes.json();
              throw new Error(errData.message || 'Gagal upload gambar');
            }
          } catch (err) { 
            console.error(err);
            setMessage(`Error Upload: ${err.message}`);
            setSaving(false);
            return;
          }
        } else if (!imageUrl && !editingGalleryId) {
          setMessage('Silakan pilih foto terlebih dahulu!');
          setSaving(false);
          return;
        }

        const method = editingGalleryId ? 'PUT' : 'POST';
        const url = editingGalleryId ? `/api/gallery/${editingGalleryId}` : '/api/gallery';
        try {
          const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({ ...galleryForm, image: imageUrl }),
          });
          if (res.ok) {
            setShowGalleryModal(false);
            setEditingGalleryId(null);
            fetchData();
            setMessage(editingGalleryId ? 'Foto diperbarui!' : 'Foto ditambahkan!');
            setTimeout(() => setMessage(''), 3000);
          } else {
            const errData = await res.json();
            setMessage(`Gagal menyimpan: ${errData.error || res.statusText}`);
          }
        } catch (err) { 
          console.error(err); 
          setMessage(`Error: ${err.message}`);
        } finally { setSaving(false); }
      };
      return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="flex justify-between items-center">
             <div>
                <h1 className="text-3xl font-black text-slate-900">Galeri Foto</h1>
                <p className="text-slate-500 mt-1">Kelola foto-foto kegiatan dan dokumentasi.</p>
             </div>
             <button onClick={() => { setEditingGalleryId(null); setGalleryForm({ title: '', image: '', album_id: '' }); setShowGalleryModal(true); }} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95 flex items-center space-x-2"><Plus size={18} /><span>Tambah Foto</span></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             {photos.map(photo => (
                <div key={photo.id} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                   <div className="aspect-video relative overflow-hidden bg-slate-100">
                      <img src={photo.image} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                         <button onClick={() => { setEditingGalleryId(photo.id); setGalleryForm({ title: photo.title, image: photo.image, album_id: photo.album_id || '' }); setShowGalleryModal(true); }} className="p-2 bg-white text-slate-900 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Edit2 size={16} /></button>
                         <button onClick={async () => { if (!window.confirm('Hapus?')) return; await fetch(`/api/gallery/${photo.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }); fetchData(); }} className="p-2 bg-white text-slate-900 rounded-lg hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                      </div>
                   </div>
                   <div className="p-4"><h3 className="font-bold text-slate-900 truncate">{photo.title}</h3><p className="text-xs text-slate-400 mt-1">Album: {albums.find(a => a.id === photo.album_id)?.title || 'Tanpa Album'}</p></div>
                </div>
             ))}
          </div>
          {showGalleryModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden">
                <div className="p-8 bg-slate-50 border-b flex justify-between items-center"><h2 className="text-xl font-black">{editingGalleryId ? 'Edit Foto' : 'Tambah Foto'}</h2><button onClick={() => setShowGalleryModal(false)} className="text-slate-400"><Plus size={24} className="rotate-45" /></button></div>
                <form onSubmit={handlePhotoSubmit} className="p-8 space-y-6">
                   <Input label="Judul Foto" value={galleryForm.title} onChange={v => setGalleryForm({...galleryForm, title: v})} />
                   <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Album</label>
                      <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 outline-none transition-all appearance-none" value={galleryForm.album_id} onChange={e => setGalleryForm({...galleryForm, album_id: e.target.value})}><option value="">Tanpa Album</option>{albums.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}</select>
                   </div>
                   <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">File Foto</label>
                      <div className="flex items-center space-x-4">
                         {galleryForm.image && <img src={galleryForm.image} className="w-16 h-16 rounded-xl object-cover" />}
                         <input type="file" id="gallery-image-input" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700" accept="image/*" />
                      </div>
                   </div>
                   <div className="pt-4 flex space-x-3"><button type="button" onClick={() => setShowGalleryModal(false)} className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all">Batal</button><button type="submit" disabled={saving} className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2">{saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}<span>Simpan</span></button></div>
                </form>
              </div>
            </div>
          )}
        </div>
      );

    case 'gallery-album':
      const handleAlbumSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting Album:', albumForm);
        if (!albumForm.title) { setMessage('Judul album wajib diisi!'); return; }
        setSaving(true);
        let imageUrl = albumForm.cover_image;
        const fileInput = document.getElementById('album-image-input');
        if (fileInput && fileInput.files[0]) {
          const formData = new FormData();
          formData.append('image', fileInput.files[0]);
          try {
            const res = await fetch('/api/upload', { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }, body: formData });
            if (res.ok) {
              const data = await res.json();
              imageUrl = data.imageUrl;
            } else {
              throw new Error('Gagal upload sampul album');
            }
          } catch (err) { 
            console.error(err);
            setMessage(`Error: ${err.message}`);
            setSaving(false);
            return;
          }
        }
        const method = editingAlbumId ? 'PUT' : 'POST';
        const url = editingAlbumId ? `/api/albums/${editingAlbumId}` : '/api/albums';
        try {
          const res = await fetch(url, { 
            method, 
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }, 
            body: JSON.stringify({ ...albumForm, cover_image: imageUrl }) 
          });
          if (res.ok) { 
            setShowAlbumModal(false); 
            setEditingAlbumId(null); 
            fetchData(); 
            setMessage('Album berhasil disimpan!'); 
            setTimeout(() => setMessage(''), 3000); 
          } else {
            const errData = await res.json();
            setMessage(`Gagal simpan: ${errData.error || res.statusText}`);
          }
        } catch (err) { 
          console.error(err);
          setMessage(`Error: ${err.message}`);
        } finally { setSaving(false); }
      };
      return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="flex justify-between items-center">
             <div><h1 className="text-3xl font-black text-slate-900">Album Foto</h1><p className="text-slate-500 mt-1">Kelola album untuk mengelompokkan foto.</p></div>
             <button onClick={() => { setEditingAlbumId(null); setAlbumForm({ title: '', description: '', cover_image: '' }); setShowAlbumModal(true); }} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg flex items-center space-x-2"><Plus size={18} /><span>Tambah Album</span></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {albums.map(album => (
                <div key={album.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                   <img src={album.cover_image} className="aspect-video w-full object-cover" />
                   <div className="p-6">
                      <h3 className="font-bold text-xl">{album.title}</h3>
                      <p className="text-slate-500 text-sm mt-2 line-clamp-2">{album.description}</p>
                      <div className="mt-6 flex space-x-2">
                         <button onClick={() => { setEditingAlbumId(album.id); setAlbumForm({ title: album.title, description: album.description, cover_image: album.cover_image }); setShowAlbumModal(true); }} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all">Edit</button>
                         <button onClick={async () => { if (!window.confirm('Hapus album?')) return; await fetch(`/api/albums/${album.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }); fetchData(); }} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={18} /></button>
                      </div>
                   </div>
                </div>
             ))}
          </div>
          {showAlbumModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden">
                <div className="p-8 bg-slate-50 border-b flex justify-between items-center"><h2 className="text-xl font-black">Album</h2><button onClick={() => setShowAlbumModal(false)} className="text-slate-400"><Plus size={24} className="rotate-45" /></button></div>
                <form onSubmit={handleAlbumSubmit} className="p-8 space-y-6">
                   <Input label="Judul Album" value={albumForm.title} onChange={v => setAlbumForm({...albumForm, title: v})} />
                   <textarea placeholder="Deskripsi Album" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 outline-none transition-all font-medium" rows="4" value={albumForm.description} onChange={e => setAlbumForm({...albumForm, description: e.target.value})} />
                   <div className="flex items-center space-x-4">
                      {albumForm.cover_image && <img src={albumForm.cover_image} className="w-16 h-16 rounded-xl object-cover" />}
                      <input type="file" id="album-image-input" className="text-sm" accept="image/*" />
                   </div>
                   <div className="pt-4 flex space-x-3"><button type="button" onClick={() => setShowAlbumModal(false)} className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all">Batal</button><button type="submit" disabled={saving} className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2">{saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}<span>Simpan Album</span></button></div>
                </form>
              </div>
            </div>
          )}
        </div>
      );

    case 'gallery-video':
      const handleVideoSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting Video:', videoForm);
        if (!videoForm.title || !videoForm.video_url) { setMessage('Judul dan URL video wajib diisi!'); return; }
        setSaving(true);
        const method = editingVideoId ? 'PUT' : 'POST';
        const url = editingVideoId ? `/api/videos/${editingVideoId}` : '/api/videos';
        try {
          const res = await fetch(url, { 
            method, 
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }, 
            body: JSON.stringify(videoForm) 
          });
          if (res.ok) { 
            setShowVideoModal(false); 
            setEditingVideoId(null); 
            fetchData(); 
            setMessage('Video berhasil disimpan!'); 
            setTimeout(() => setMessage(''), 3000); 
          } else {
            const errData = await res.json();
            setMessage(`Gagal simpan: ${errData.error || res.statusText}`);
          }
        } catch (err) { 
          console.error(err);
          setMessage(`Error: ${err.message}`);
        } finally { setSaving(false); }
      };
      return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="flex justify-between items-center">
             <div><h1 className="text-3xl font-black text-slate-900">Galeri Video</h1><p className="text-slate-500 mt-1">Kelola video kegiatan dari YouTube atau link lainnya.</p></div>
             <button onClick={() => { setEditingVideoId(null); setVideoForm({ title: '', video_url: '', thumbnail: '' }); setShowVideoModal(true); }} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg flex items-center space-x-2"><Plus size={18} /><span>Tambah Video</span></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {videos.map(video => (
                <div key={video.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                   <div className="aspect-video bg-slate-900 flex items-center justify-center">
                      <ExternalLink size={48} className="text-white opacity-20" />
                   </div>
                   <div className="p-6">
                      <h3 className="font-bold text-xl">{video.title}</h3>
                      <p className="text-blue-600 text-sm mt-2 truncate">{video.video_url}</p>
                      <div className="mt-6 flex space-x-2">
                         <button onClick={() => { setEditingVideoId(video.id); setVideoForm({ title: video.title, video_url: video.video_url, thumbnail: video.thumbnail }); setShowVideoModal(true); }} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all">Edit</button>
                         <button onClick={async () => { if (!window.confirm('Hapus video?')) return; await fetch(`/api/videos/${video.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }); fetchData(); }} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={18} /></button>
                      </div>
                   </div>
                </div>
             ))}
          </div>
          {showVideoModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden">
                <div className="p-8 bg-slate-50 border-b flex justify-between items-center"><h2 className="text-xl font-black">Video</h2><button onClick={() => setShowVideoModal(false)} className="text-slate-400"><Plus size={24} className="rotate-45" /></button></div>
                <form onSubmit={handleVideoSubmit} className="p-8 space-y-6">
                   <Input label="Judul Video" value={videoForm.title} onChange={v => setVideoForm({...videoForm, title: v})} />
                   <Input label="URL Video (YouTube)" value={videoForm.video_url} onChange={v => setVideoForm({...videoForm, video_url: v})} />
                   <div className="pt-4 flex space-x-3"><button type="button" onClick={() => setShowVideoModal(false)} className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100">Batal</button><button type="submit" disabled={saving} className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2">{saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}<span>Simpan Video</span></button></div>
                </form>
              </div>
            </div>
          )}
        </div>
      );

    case 'footer-setting':
      return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="flex justify-between items-center">
             <div>
                <h1 className="text-3xl font-black text-slate-900">Footer Setting</h1>
                <p className="text-slate-500 mt-1">Kelola tampilan dan konten footer website.</p>
             </div>
             <button 
                onClick={handleSaveContent}
                disabled={saving}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
             >
                <Save size={18} />
                <span>{saving ? 'Menyimpan...' : 'Simpan Footer'}</span>
             </button>
           </div>

           {/* Branding & Logo */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <Card title="Branding Footer">
                <div className="space-y-6">
                  <div className="flex items-center space-x-6 p-6 bg-blue-950 rounded-2xl">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden bg-white">
                      {content.footer_logo_image ? (
                        <img src={content.footer_logo_image} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-blue-900 font-bold text-2xl">{content.footer_logo_text || 'PK'}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-white leading-tight">{content.footer_title || 'PUTUSSIBAU KOTA'}</h3>
                      <p className="text-[10px] text-blue-300 font-medium uppercase tracking-widest">{content.footer_subtitle || 'Kelurahan Putussibau Kota'}</p>
                    </div>
                  </div>

                  {/* Logo Image Upload */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Logo Image</label>
                    <div className="flex items-center space-x-4">
                      <input type="file" id="footer-logo-upload" className="hidden" accept="image/*" onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append('image', file);
                        try {
                          const res = await fetch('/api/upload', {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                            body: formData
                          });
                          const data = await res.json();
                          if (res.ok) {
                            setContent({...content, footer_logo_image: data.imageUrl});
                            setMessage('Logo berhasil diupload! Klik Simpan untuk menyimpan.');
                            setTimeout(() => setMessage(''), 4000);
                          }
                        } catch (err) {
                          console.error('Error uploading logo', err);
                        }
                      }} />
                      <label htmlFor="footer-logo-upload" className="flex items-center justify-center space-x-2 bg-blue-50 text-blue-600 px-6 py-4 rounded-2xl font-bold cursor-pointer hover:bg-blue-100 transition-colors flex-1 text-center border-2 border-dashed border-blue-200 hover:border-blue-400">
                        <ImageIcon size={20} />
                        <span>Upload Logo</span>
                      </label>
                      {content.footer_logo_image && (
                        <div className="relative">
                          <img src={content.footer_logo_image} alt="Logo preview" className="w-16 h-16 object-contain rounded-xl border-2 border-slate-200 bg-white p-1" />
                          <button 
                            type="button"
                            onClick={() => setContent({...content, footer_logo_image: ''})}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-lg"
                          >✕</button>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 ml-1">Format: JPG, PNG. Jika tidak diupload, akan tampil teks logo.</p>
                  </div>

                  <Input label="Logo Text (Fallback jika tidak ada gambar)" value={content.footer_logo_text} onChange={v => setContent({...content, footer_logo_text: v})} />
                  <Input label="Judul Footer" value={content.footer_title} onChange={v => setContent({...content, footer_title: v})} />
                  <Input label="Sub Judul Footer" value={content.footer_subtitle} onChange={v => setContent({...content, footer_subtitle: v})} />
                </div>
             </Card>

             <Card title="Deskripsi & Copyright">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Deskripsi Footer</label>
                    <textarea 
                      rows="4"
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-medium resize-none"
                      value={content.footer_description || ''}
                      onChange={e => setContent({...content, footer_description: e.target.value})}
                    />
                  </div>
                  <Input label="Teks Copyright" value={content.footer_copyright} onChange={v => setContent({...content, footer_copyright: v})} />
                </div>
             </Card>
           </div>

           {/* Kontak Footer */}
           <Card title="Informasi Kontak Footer">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input label="Alamat Kantor" value={content.footer_address} onChange={v => setContent({...content, footer_address: v})} />
                <Input label="Nomor Telepon" value={content.footer_phone} onChange={v => setContent({...content, footer_phone: v})} />
                <Input label="Email" value={content.footer_email} onChange={v => setContent({...content, footer_email: v})} />
              </div>
           </Card>

           {/* Social Links */}
           <Card title="Link Media Sosial">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input label="Facebook URL" value={content.footer_facebook} onChange={v => setContent({...content, footer_facebook: v})} />
                <Input label="Twitter / X URL" value={content.footer_twitter} onChange={v => setContent({...content, footer_twitter: v})} />
                <Input label="Instagram URL" value={content.footer_instagram} onChange={v => setContent({...content, footer_instagram: v})} />
              </div>
           </Card>

           {/* Pintasan */}
           <Card title="Link Pintasan (Kolom Pintasan)">
              <div className="space-y-4">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <Input label={`Pintasan ${i} — Label`} value={content[`footer_shortcut_${i}_label`]} onChange={v => setContent({...content, [`footer_shortcut_${i}_label`]: v})} />
                    <Input label={`Pintasan ${i} — Link`} value={content[`footer_shortcut_${i}_link`]} onChange={v => setContent({...content, [`footer_shortcut_${i}_link`]: v})} />
                  </div>
                ))}
              </div>
           </Card>

           {/* Layanan Footer */}
           <Card title="Link Layanan (Kolom Layanan)">
              <div className="space-y-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <Input label={`Layanan ${i} — Label`} value={content[`footer_service_${i}_label`]} onChange={v => setContent({...content, [`footer_service_${i}_label`]: v})} />
                    <Input label={`Layanan ${i} — Link`} value={content[`footer_service_${i}_link`]} onChange={v => setContent({...content, [`footer_service_${i}_link`]: v})} />
                  </div>
                ))}
              </div>
           </Card>

           {/* Live Preview */}
           <div className="bg-blue-950 rounded-3xl p-8 text-white shadow-xl">
              <div className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-6">LIVE PREVIEW</div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                      {content.footer_logo_image ? (
                        <img src={content.footer_logo_image} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-blue-900 font-bold text-lg">{content.footer_logo_text || 'PK'}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{content.footer_title || 'PUTUSSIBAU KOTA'}</h4>
                      <p className="text-[8px] text-blue-300 uppercase tracking-widest">{content.footer_subtitle || 'Kelurahan'}</p>
                    </div>
                  </div>
                  <p className="text-blue-200/60 text-xs leading-relaxed">{content.footer_description || '...'}</p>
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-3">Pintasan</h4>
                  <ul className="space-y-1.5 text-xs text-blue-200/60">
                    {[1,2,3,4,5].map(i => content[`footer_shortcut_${i}_label`] && <li key={i}>{content[`footer_shortcut_${i}_label`]}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-3">Layanan</h4>
                  <ul className="space-y-1.5 text-xs text-blue-200/60">
                    {[1,2,3,4].map(i => content[`footer_service_${i}_label`] && <li key={i}>{content[`footer_service_${i}_label`]}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-3">Kontak</h4>
                  <ul className="space-y-1.5 text-xs text-blue-200/60">
                    <li>{content.footer_address || '...'}</li>
                    <li>{content.footer_phone || '...'}</li>
                    <li>{content.footer_email || '...'}</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-blue-200/40">{content.footer_copyright || '...'}</div>
           </div>
        </div>
      );

    default:
      return (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
           <LayoutDashboard size={48} className="mb-4 opacity-20" />
           <p className="font-medium italic text-sm uppercase tracking-widest">Modul "{tab}" akan segera hadir.</p>
        </div>
      );
  }
}

// Helper Components
const StatCard = ({ label, value, icon: Icon, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600'
  };
  
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className={`w-12 h-12 ${colors[color]} rounded-2xl flex items-center justify-center mb-4`}>
        <Icon size={24} />
      </div>
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
    </div>
  );
};

const Card = ({ title, children }) => (
  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50">
       <h2 className="font-bold text-slate-900 uppercase tracking-tighter">{title}</h2>
    </div>
    <div className="p-8">
      {children}
    </div>
  </div>
);

const Input = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">{label}</label>
    <input 
      type={type}
      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);
