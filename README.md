# Discord Projects Platform

منصة لعرض وإدارة مشاريع الديسكورد - جاهزة للنشر على Netlify

## 🚀 النشر على Netlify

### الطريقة الأولى: من GitHub
1. ارفع المشروع على GitHub
2. ادخل على [netlify.com](https://netlify.com)
3. اربط المستودع
4. إعدادات البناء:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/public`
   - **Functions directory**: `netlify/functions`

### متغيرات البيئة المطلوبة:
```
DATABASE_URL=mongodb+srv://codex-us2:codex-us2@codex-us2.62zm1.mongodb.net/?retryWrites=true&w=majority&appName=codex-us2
GITHUB_CLIENT_ID=Ov23lipN5ASsnC3ovIiv
GITHUB_CLIENT_SECRET=7e87124cd44fba88996ac4e7ab1331937c10f4c1
SESSION_SECRET=nuEdb4WjWWj/JQ5qex1mbx5Ia1cn11A0uXySXKAFlzQCJMy5URYBEHjy8uLGU4/vptQT6E+2gtlYjNevSbM06w==
ADMIN_USERS=["190771533"]
```

### بعد النشر:
1. احصل على رابط الموقع من Netlify
2. حدث GitHub OAuth callback URL:
   - اذهب إلى GitHub Settings > Developer settings > OAuth Apps
   - حدث Authorization callback URL إلى: `https://your-site.netlify.app/api/auth/github/callback`

## ✅ الميزات
- تسجيل دخول عبر GitHub
- إدارة المشاريع
- رفع الملفات
- نظام الإعجابات
- لوحة تحكم الإدارة
- تصميم عصري ومتجاوب

## 📋 التقنيات
- React + TypeScript
- Netlify Functions
- MongoDB Atlas
- GitHub OAuth
- Tailwind CSS