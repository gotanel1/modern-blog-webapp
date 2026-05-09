import Link from 'next/link';

interface PostCardProps {
  title: string;
  content: string;
  slug: string;
  coverImage?: string;
  author?: {
    name: string;
  };
  createdAt: string;
}

export default function PostCard({ title, content, slug, coverImage, author, createdAt }: PostCardProps) {
  const preview = content ? (content.length > 120 ? content.substring(0, 120) + '...' : content) : '';

  return (
    <Link href={`/posts/${slug}`} className="group block h-full">
      <div className="flex flex-col h-full bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
        {coverImage ? (
          <div className="relative overflow-hidden aspect-video">
            <div className="absolute inset-0 bg-gray-200 animate-pulse -z-10"></div>
            <img 
              src={process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}${coverImage}` : `http://localhost:4000${coverImage}`} 
              alt={title} 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        ) : (
          <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-indigo-50 to-purple-50">
             <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-110 transition-transform duration-700">
                <svg className="w-16 h-16 text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19V5h14l.002 14H5z"/><path d="m10 14-1-1-3 4h12l-5-7z"/></svg>
             </div>
          </div>
        )}
        
        <div className="p-6 md:p-8 flex-grow flex flex-col">
          <div className="text-xs font-semibold text-indigo-600/80 uppercase tracking-wider mb-3">
            {new Date(createdAt).toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2 leading-tight">
            {title}
          </h2>
          <p className="text-gray-500 mb-6 line-clamp-3 text-sm md:text-base leading-relaxed flex-grow">
            {preview}
          </p>
          
          <div className="flex items-center mt-auto pt-4 border-t border-gray-100">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold mr-3 shadow-sm">
              {author?.name?.[0].toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">
                {author?.name || 'Unknown'}
              </span>
              <span className="text-xs text-gray-500">Author</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
