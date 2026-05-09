import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      await axios.post(`${apiUrl}/api/v1/auth/signup`, {
        email,
        password,
        name,
      });

      toast.success('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'การสมัครสมาชิกล้มเหลว กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">สร้างบัญชีใหม่</h2>
            <p className="text-gray-500">เข้าร่วมชุมชนนักเขียนและนักอ่านของเรา</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block" htmlFor="name">
                ชื่อ-นามสกุล
              </label>
              <input
                id="name"
                type="text"
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ชื่อที่ใช้แสดงผล"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block" htmlFor="email">
                อีเมล
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block" htmlFor="password">
                รหัสผ่าน
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="รหัสผ่านอย่างน้อย 6 ตัวอักษร"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'กำลังสร้างบัญชี...' : 'สมัครสมาชิกฟรี'}
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm text-gray-600">
            มีบัญชีอยู่แล้ว?{' '}
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
