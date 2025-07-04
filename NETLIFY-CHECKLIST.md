# قائمة التحقق قبل النشر على Netlify ✅

## الملفات المطلوبة (موجودة ✓)

- [x] `netlify.toml` - ملف إعدادات Netlify
- [x] `package.json` - ملف تبعيات المشروع
- [x] `.env.example` - مثال لمتغيرات البيئة
- [x] `netlify/functions/api.js` - ملف API Functions

## متغيرات البيئة المطلوبة

قم بنسخ هذه المتغيرات وإضافتها في Netlify:

```env
DATABASE_URL=mongodb+srv://codex-us2:codex-us2@codex-us2.62zm1.mongodb.net/?retryWrites=true&w=majority&appName=codex-us2
GITHUB_CLIENT_ID=Ov23lihaX4CSTXNgP0F4
GITHUB_CLIENT_SECRET=39c16791e0e0438def3f45e67fa84cb848a746ff
SESSION_SECRET=nuEdb4WjWWj/JQ5qex1mbx5Ia1cn11A0uXySXKAFlzQCJMy5URYBEHjy8uLGU4/vptQT6E+2gtlYjNevSbM06w==
ADMIN_USERS=["190771533"]
```

## أوامر البناء

```bash
Build command: npm run build
Publish directory: dist/public
Functions directory: netlify/functions
```

## خطوات النشر السريع

### 1. من GitHub (موصى به):
1. ارفع المشروع على GitHub
2. اربط Netlify بالمستودع
3. أضف متغيرات البيئة
4. اضغط Deploy

### 2. السحب والإفلات:
1. شغّل `npm run build`
2. اسحب مجلد `dist/public` إلى Netlify

## بعد النشر

1. احصل على رابط الموقع (مثل: `https://amazing-site-123.netlify.app`)
2. حدّث GitHub OAuth:
   - Homepage URL: رابط موقعك
   - Callback URL: `رابط-موقعك/api/auth/github/callback`

---

🎉 **المشروع جاهز للنشر!**