# คู่มือการ Deploy Modern Blog (Vercel + Render)

สถาปัตยกรรมที่คุณเลือกคือการแยกหน้าบ้านและหลังบ้านออกจากกัน เพื่อดึงประสิทธิภาพสูงสุดของแต่ละแพลตฟอร์มออกมา

## 1. ฐานข้อมูล (Database) บน Render.com
1. สมัคร/ล็อกอินที่ [Render](https://render.com/)
2. กด **New +** > **PostgreSQL**
3. ตั้งชื่อ Database (เช่น `modern-blog-db`)
4. เลือก Region ที่ใกล้ที่สุด (เช่น Singapore หรือ Frankfurt)
5. กด **Create Database**
6. ก๊อปปี้ **Internal Database URL** (สำหรับใช้ใน Render) และ **External Database URL** (สำหรับเชื่อมต่อชั่วคราวจากเครื่องคุณ) เก็บไว้

## 2. หลังบ้าน (Backend - NestJS) บน Render.com
1. อัปโหลดโค้ดโปรเจกต์นี้ขึ้น GitHub Repository ของคุณ
2. ที่หน้า Render กด **New +** > **Web Service**
3. เชื่อมต่อกับ GitHub และเลือก Repository ของคุณ
4. ตั้งค่าตามนี้:
   - **Root Directory:** `modern-blog-webapp/backend` (หรือ `backend` ขึ้นอยู่กับโครงสร้างโฟลเดอร์ใน Git)
   - **Environment:** `Node`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm run start:prod`
5. ไปที่แท็บ **Environment** เพิ่มค่าดังนี้:
   - `DATABASE_URL` = (วาง **Internal Database URL** ที่ได้จากขั้นตอนที่ 1)
   - `JWT_SECRET` = (ตั้งรหัสลับสุ่มที่คาดเดายากๆ)
   - `PORT` = `3000` (Render จะจัดการโยงพอร์ตให้อัตโนมัติ)
6. กด **Create Web Service** รอจนกว่าจะ Deploy เสร็จ
7. ก๊อปปี้ URL ของ Backend ที่ได้ (เช่น `https://modern-blog-api.onrender.com`) ไปใช้ในขั้นตอนถัดไป

*หมายเหตุ: ก่อนรัน Frontend ครั้งแรก อย่าลืมรันคำสั่ง `npx prisma db push` ผ่านเมนู Shell ในหน้า Dashboard ของ Render Web Service เพื่อสร้างตารางในฐานข้อมูล*

## 3. หน้าบ้าน (Frontend - Next.js) บน Vercel
1. สมัคร/ล็อกอินที่ [Vercel](https://vercel.com/)
2. กด **Add New...** > **Project**
3. นำเข้า Repository จาก GitHub ตัวเดียวกัน
4. ตรงส่วน **Root Directory** ให้กด Edit แล้วเลือกโฟลเดอร์ `frontend` (หรือ `modern-blog-webapp/frontend`)
5. ตรงส่วน **Environment Variables** ให้เพิ่ม:
   - `NEXT_PUBLIC_API_URL` = (วาง URL ของ Backend ที่ได้จากขั้นตอนที่ 2 เช่น `https://modern-blog-api.onrender.com`)
6. กด **Deploy**

---

🎉 **เสร็จสมบูรณ์!** ระบบของคุณพร้อมรองรับคนอ่านระดับโลกแล้ว!