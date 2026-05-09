import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await axios.post(`${apiUrl}/api/v1/auth/login`, {
        email,
        password,
      });

      localStorage.setItem('token', response.data.access_token);
      toast.success('เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับกลับมา');
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">ยินดีต้อนรับกลับมา</h2>
            <p className="text-gray-500">ลงชื่อเข้าใช้เพื่อจัดการบทความของคุณ</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700 block" htmlFor="password">
                  รหัสผ่าน
                </label>
                <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500 transition-colors">ลืมรหัสผ่าน?</a>
              </div>
              <input
                id="password"
                type="password"
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm text-gray-600">
            ยังไม่มีบัญชี?{' '}
            <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              สมัครสมาชิกฟรี
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
