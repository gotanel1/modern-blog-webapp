import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';

interface Post {
  id: number;
  title: string;
  content: string;
  slug: string;
  createdAt: string;
  coverImage?: string;
  author: {
    name: string;
  };
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchPosts = async (searchQuery: string) => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const url = searchQuery ? `${apiUrl}/api/v1/posts?search=${encodeURIComponent(searchQuery)}` : `${apiUrl}/api/v1/posts`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      setPosts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(search);
  }, [search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative overflow-hidden py-24 mb-16 rounded-[2.5rem] bg-black text-white shadow-2xl">
        {/* Abstract Gradient Background */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/40 blur-[120px] mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/40 blur-[120px] mix-blend-screen pointer-events-none"></div>
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-blue-500/30 blur-[100px] mix-blend-screen pointer-events-none"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-medium tracking-wide mb-6">
            ✨ ยินดีต้อนรับสู่ประสบการณ์การอ่านใหม่
          </span>
          <h1 className="text-5xl font-extrabold sm:text-6xl md:text-7xl tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-gray-300">
            ModernBlog
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300 sm:mt-6 font-light leading-relaxed">
            ติดตามข่าวสารและบทความที่น่าสนใจจากนักเขียนทั่วทุกมุมโลก แบ่งปันความรู้และประสบการณ์ของคุณวันนี้
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/posts/create" className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 duration-300">
              เริ่มเขียนบทความเลย
            </a>
            <a href="#latest-posts" className="inline-flex items-center justify-center px-8 py-3.5 bg-white/10 text-white font-semibold rounded-full border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all duration-300">
              สำรวจบทความ
            </a>
          </div>
        </div>
      </div>

      {/* Search and Header */}
      <div id="latest-posts" className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">บทความล่าสุด</h2>
          <p className="text-gray-500 mt-1">อัปเดตเรื่องราวใหม่ๆ ให้คุณทุกวัน ({posts.length} รายการ)</p>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="ค้นหาบทความ..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-11 pr-24 py-3 bg-gray-50 border border-gray-200 rounded-full focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none shadow-sm"
          />
          <button type="submit" className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors">
            ค้นหา
          </button>
        </form>
      </div>

      {/* Loading Skeleton & Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
              <div className="bg-gray-200 h-48 rounded-2xl mb-6"></div>
              <div className="h-4 bg-gray-200 rounded-full w-1/3 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded-full w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded-full w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded-full w-5/6 mb-6"></div>
              <div className="flex items-center mt-4">
                <div className="rounded-full bg-gray-200 h-10 w-10 mr-3"></div>
                <div className="h-4 bg-gray-200 rounded-full w-24"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50/50 border border-red-100 p-8 rounded-3xl text-center">
          <div className="text-red-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-1">ไม่สามารถโหลดข้อมูลได้</h3>
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
          {posts.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">ไม่พบบทความ</h3>
              <p className="text-gray-500 max-w-md">ยังไม่มีบทความที่ตรงกับการค้นหาในขณะนี้ ลองค้นหาด้วยคำอื่น หรือสร้างบทความใหม่เลย</p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
