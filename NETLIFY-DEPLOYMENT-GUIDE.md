# دليل نشر المشروع على Netlify - خطوة بخطوة

## نظرة عامة على المشروع

هذا المشروع يتكون من:
- **Frontend**: React + TypeScript + Vite
- **Backend**: Netlify Functions (Serverless)
- **Database**: MongoDB Atlas

✅ **الآن يمكن استضافة المشروع بالكامل على Netlify!** تم تحويل Backend إلى Netlify Functions.

## الخطوة 1: التحضير للنشر على Netlify

المشروع جاهز للنشر المباشر على Netlify! لا تحتاج إلى خدمات استضافة إضافية.

### 1. متغيرات البيئة المطلوبة

ستحتاج إلى إضافة هذه المتغيرات في إعدادات Netlify:

```env
DATABASE_URL=mongodb+srv://codex-us2:codex-us2@codex-us2.62zm1.mongodb.net/?retryWrites=true&w=majority&appName=codex-us2
GITHUB_CLIENT_ID=Ov23lihaX4CSTXNgP0F4
GITHUB_CLIENT_SECRET=05036e43f71f928b4b7b32584babbc0ba93d7546
SESSION_SECRET=nuEdb4WjWWj/JQ5qex1mbx5Ia1cn11A0uXySXKAFlzQCJMy5URYBEHjy8uLGU4/vptQT6E+2gtlYjNevSbM06w==
ADMIN_USERS=["190771533"]
```

### 2. إعداد GitHub OAuth Callback URLs

**مهم جداً**: لاستخدام GitHub OAuth مع كل من Replit وNetlify، تحتاج إلى إضافة عدة callback URLs في تطبيق GitHub OAuth:

1. **انتقل إلى GitHub Developer Settings**:
   - اذهب إلى https://github.com/settings/developers
   - اضغط على "OAuth Apps"
   - ابحث عن التطبيق (Client ID: `Ov23lihaX4CSTXNgP0F4`)

2. **أضف Callback URLs متعددة**:
   ```
   # للتطوير على Replit
   https://b7ceafba-f681-4c0e-8b37-5a6a30548e1b-00-dbkkclcrhexb.riker.replit.dev/api/auth/github/callback
   
   # للإنتاج على Netlify
   https://discordworld.netlify.app/api/auth/github/callback
   ```

3. **GitHub يدعم عدة callback URLs**:
   - يمكنك إضافة كل URL في سطر منفصل
   - سيعمل التطبيق تلقائياً مع البيئة الصحيحة

### 2. اختبار البناء محلياً

```bash
# تأكد من أن البناء يعمل
npm run build

# تحقق من وجود مجلد dist/public
ls -la dist/public/
```

## الخطوة 2: النشر على Netlify

### الطريقة الأولى: من GitHub (موصى بها)

1. **ادخل إلى Netlify**
   - اذهب إلى [app.netlify.com](https://app.netlify.com)
   - سجل دخول أو أنشئ حساب

2. **أنشئ موقع جديد**
   - انقر "Add new site"
   - اختر "Import an existing project"

3. **اربط GitHub**
   - اختر GitHub
   - اربط مستودع المشروع

4. **إعدادات البناء**
   ```
   Base directory: (اتركه فارغ)
   Build command: npm run build
   Publish directory: dist/public
   Functions directory: netlify/functions
   ```

5. **متغيرات البيئة**
   - انقر "Show advanced"
   - أضف المتغيرات التالية:
     ```
     DATABASE_URL: mongodb+srv://codex-us2:codex-us2@codex-us2.62zm1.mongodb.net/?retryWrites=true&w=majority&appName=codex-us2
     GITHUB_CLIENT_ID: Ov23lihaX4CSTXNgP0F4
     GITHUB_CLIENT_SECRET: 39c16791e0e0438def3f45e67fa84cb848a746ff
     SESSION_SECRET: your_secure_session_secret_here
     ADMIN_USERS: ["190771533"]
     ```

6. **انقر "Deploy site"**

### الطريقة الثانية: النشر اليدوي

1. **ابني المشروع محلياً**
   ```bash
   npm run build
   ```

2. **ارفع المجلد**
   - اذهب إلى Netlify
   - اسحب مجلد `dist/public` إلى صفحة Netlify

## الخطوة 3: تحديث GitHub OAuth

1. اذهب إلى GitHub Settings > Developer settings > OAuth Apps
2. حدث OAuth App:
   - **Homepage URL**: https://your-site.netlify.app
   - **Authorization callback URL**: https://your-site.netlify.app/api/auth/github/callback

## الخطوة 5: اختبار الموقع

1. **تحقق من الصفحة الرئيسية**
   - يجب أن تظهر بدون أخطاء

2. **اختبر تسجيل الدخول**
   - انقر زر تسجيل الدخول
   - يجب أن يحولك إلى GitHub

3. **تحقق من وحدة التحكم**
   - افتح Console في المتصفح (F12)
   - تأكد من عدم وجود أخطاء CORS

## حل المشاكل الشائعة

### مشكلة: "Failed to fetch" أو CORS errors

**الحل**: في Backend (server/config.env.ts):
```javascript
corsOrigin: "https://your-site.netlify.app"
```

### مشكلة: صفحة 404 عند تحديث الصفحة

**الحل**: تأكد من وجود ملف `client/public/_redirects`:
```
/* /index.html 200
```

### مشكلة: تسجيل الدخول لا يعمل

**الحل**: تحقق من:
1. رابط callback في GitHub OAuth صحيح
2. متغير VITE_API_URL يشير للbackend الصحيح
3. Backend يعمل ويمكن الوصول إليه

### مشكلة: الصور المرفوعة لا تظهر

**الحل**: 
- الصور يجب رفعها على خدمة خارجية (Cloudinary, S3)
- أو حفظها على Backend server

## نصائح مهمة

1. **احفظ نسخة احتياطية** من جميع متغيرات البيئة
2. **اختبر دائماً** على localhost قبل النشر
3. **راقب السجلات** في Netlify و Railway للأخطاء
4. **استخدم HTTPS** دائماً في الإنتاج

## الأوامر المفيدة

```bash
# للتطوير المحلي
npm run dev

# لبناء الإنتاج
npm run build

# لتنظيف البناء السابق
rm -rf dist/

# للتحقق من المتغيرات
echo $VITE_API_URL
```

## البنية النهائية المبسطة

```
┌─────────────────────────────────┐     ┌─────────────┐
│           Netlify               │────▶│  MongoDB    │
│  ┌─────────────┐ ┌─────────────┐│     │   Atlas     │
│  │  Frontend   │ │  Functions  ││     │             │
│  │   (React)   │ │ (Serverless)││     │             │
│  └─────────────┘ └─────────────┘│     │             │
└─────────────────────────────────┘     └─────────────┘
```

✅ **جميع المكونات في منصة واحدة!**

## الدعم

إذا واجهت أي مشاكل:
1. تحقق من سجلات Netlify
2. تحقق من سجلات Railway/Backend
3. افتح Console في المتصفح
4. تأكد من أن جميع الروابط تستخدم HTTPS