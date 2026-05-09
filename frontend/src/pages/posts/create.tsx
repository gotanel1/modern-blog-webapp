import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post(`${apiUrl}/api/v1/media/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setCoverImage(res.data.url);
      toast.success('อัปโหลดรูปภาพสำเร็จ');
    } catch (err: any) {
      toast.error('ไม่สามารถอัปโหลดรูปภาพได้');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      
      const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

      await axios.post(
        `${apiUrl}/api/v1/posts`,
        {
          title,
          content,
          tags: tagList,
          coverImage: coverImage || undefined,
          published: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('สร้างบทความสำเร็จแล้ว!');
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'ไม่สามารถสร้างบทความได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">สร้างบทความใหม่</h1>
          <p className="mt-2 text-lg text-gray-500">แบ่งปันเรื่องราว ความรู้ และประสบการณ์ของคุณ</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-gray-100 space-y-8">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              รูปภาพปก (Cover Image)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>อัปโหลดรูปภาพ</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                  </label>
                  <p className="pl-1">หรือลากและวางที่นี่</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF ขนาดไม่เกิน 10MB</p>
              </div>
            </div>
            {uploadingImage && <p className="text-sm text-indigo-600 mt-2 flex items-center"><span className="animate-spin mr-2 h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full"></span>กำลังอัปโหลด...</p>}
            {coverImage && (
              <div className="mt-4 relative rounded-xl overflow-hidden shadow-sm">
                <img src={process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}${coverImage}` : `http://localhost:4000${coverImage}`} alt="Cover preview" className="w-full h-auto object-cover max-h-64" />
                <button type="button" onClick={() => setCoverImage('')} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block" htmlFor="title">
              หัวข้อบทความ
            </label>
            <input
              id="title"
              type="text"
              required
              className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 text-lg font-medium"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ตั้งชื่อที่น่าดึงดูดใจ..."
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block" htmlFor="tags">
              แท็ก (คั่นด้วยคอมม่า)
            </label>
            <input
              id="tags"
              type="text"
              className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="เช่น technology, lifestyle, programming"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block" htmlFor="content">
              เนื้อหา (รองรับ Markdown)
            </label>
            <textarea
              id="content"
              required
              rows={15}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 font-mono text-sm resize-y"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="เริ่มเขียนเนื้อหาที่ยอดเยี่ยมของคุณที่นี่..."
            ></textarea>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end sm:space-x-4 pt-6 border-t border-gray-100 gap-3 sm:gap-0">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full sm:w-auto px-8 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-bold transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'กำลังบันทึก...' : 'เผยแพร่บทความ'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
