import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

interface Post {
  title: string;
  content: string;
  createdAt: string;
  coverImage?: string;
  author: {
    name: string;
  };
  tags: { name: string }[];
}

export default function PostDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await axios.get(`${apiUrl}/api/v1/posts/${slug}`);
        setPost(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
           <div className="h-8 bg-gray-200 rounded-full w-1/4 mb-8"></div>
           <div className="h-14 bg-gray-200 rounded-2xl w-3/4 mb-6"></div>
           <div className="flex items-center gap-4 mb-12">
             <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
             <div className="space-y-2">
               <div className="h-4 bg-gray-200 rounded w-24"></div>
               <div className="h-3 bg-gray-200 rounded w-32"></div>
             </div>
           </div>
           <div className="h-96 bg-gray-200 rounded-3xl w-full mb-12"></div>
           <div className="space-y-4">
             <div className="h-4 bg-gray-200 rounded w-full"></div>
             <div className="h-4 bg-gray-200 rounded w-full"></div>
             <div className="h-4 bg-gray-200 rounded w-5/6"></div>
           </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto mt-20 text-center bg-gray-50 border border-gray-100 rounded-3xl p-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">อุ๊ปส์!</h2>
          <p className="text-gray-500 mb-8">{error || 'ไม่พบบทความที่คุณกำลังมองหา'}</p>
          <button onClick={() => router.push('/')} className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
            กลับหน้าแรก
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="max-w-4xl mx-auto pb-20">
        <header className="pt-10 pb-8 md:pt-16 md:pb-12 text-center px-4">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag.name}
                  className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold tracking-wide rounded-full border border-indigo-100/50"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight max-w-3xl mx-auto">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4 text-left">
              <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold shadow-md">
                {post.author?.name?.[0].toUpperCase() || 'U'}
              </div>
              <div>
                <div className="font-bold text-gray-900">{post.author?.name || 'Unknown Author'}</div>
                <div className="text-sm text-gray-500 font-medium">
                  {new Date(post.createdAt).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </div>
        </header>

        {post.coverImage && (
          <div className="mb-12 md:mb-16 px-4 sm:px-0">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl mx-auto max-w-5xl ring-1 ring-gray-900/5">
              <img 
                src={process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}${post.coverImage}` : `http://localhost:4000${post.coverImage}`} 
                alt={post.title} 
                className="w-full h-auto object-cover max-h-[600px] hover:scale-105 transition-transform duration-1000" 
              />
            </div>
          </div>
        )}

        <div className="px-4 sm:px-8">
          <div className="prose prose-lg prose-indigo mx-auto text-gray-800 prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 prose-img:rounded-2xl">
            <ReactMarkdown>{post.content || ''}</ReactMarkdown>
          </div>
        </div>
      </article>

      <div className="max-w-3xl mx-auto mt-8 mb-16 px-4 border-t border-gray-100 pt-8">
        <button
          onClick={() => router.back()}
          className="group inline-flex items-center text-sm font-semibold text-gray-500 hover:text-black transition-colors"
        >
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          ย้อนกลับ
        </button>
      </div>
    </Layout>
  );
}
