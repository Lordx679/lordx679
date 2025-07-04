# دليل نشر المشروع على Netlify

## المتطلبات الأساسية

1. حساب على Netlify (https://app.netlify.com/)
2. مستودع GitHub يحتوي على الكود
3. خادم backend منفصل (لأن Netlify يستضيف فقط المواقع الثابتة)

## خطوات النشر

### 1. إعداد Backend (الخادم)

بما أن Netlify لا يدعم تشغيل خوادم Node.js، ستحتاج إلى استضافة Backend على منصة أخرى مثل:
- Railway.app
- Render.com
- Heroku
- DigitalOcean App Platform
- أو أي خدمة VPS

### 2. تحديث إعدادات Frontend

قم بإنشاء ملف `.env` في المجلد الرئيسي وأضف:

```env
VITE_API_URL=https://your-backend-url.com
```

### 3. ربط المشروع بـ Netlify

1. ادخل إلى Netlify Dashboard
2. انقر على "Add new site" > "Import an existing project"
3. اختر GitHub واربط المستودع
4. استخدم الإعدادات التالية:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/public`
   - **Node version**: 20

### 4. إضافة متغيرات البيئة في Netlify

في إعدادات الموقع على Netlify:
1. اذهب إلى Site settings > Environment variables
2. أضف المتغير:
   - Key: `VITE_API_URL`
   - Value: رابط الـ Backend API الخاص بك

### 5. النشر

1. Netlify سينشر الموقع تلقائياً عند كل push للمستودع
2. أو يمكنك النشر يدوياً من خلال "Trigger deploy"

## ملاحظات مهمة

### بخصوص الملفات المرفوعة

- الملفات المرفوعة (الصور والمشاريع) يجب أن تُحفظ على خدمة خارجية مثل:
  - Cloudinary
  - AWS S3
  - Google Cloud Storage
  - أو على خادم Backend

### بخصوص قاعدة البيانات

- MongoDB Atlas يجب أن يكون متصلاً بخادم Backend فقط
- تأكد من إضافة IP خادم Backend في whitelist في MongoDB Atlas

### بخصوص المصادقة

- GitHub OAuth يحتاج إلى تحديث callback URL ليشير إلى:
  - Development: `http://localhost:5000/auth/github/callback`
  - Production: `https://your-backend-url.com/auth/github/callback`

## الهيكل المتوقع

```
Frontend (Netlify) <---> Backend API (خدمة أخرى) <---> MongoDB Atlas
```

## أوامر البناء المحلي

```bash
# للتطوير المحلي
npm run dev

# لبناء النسخة للإنتاج
npm run build

# لاختبار البناء محلياً
npm run preview
```

## استكشاف الأخطاء

### مشكلة CORS

إذا واجهت مشاكل CORS، تأكد من إضافة domain Netlify في إعدادات CORS في Backend:

```javascript
// في server/config.env.ts
corsOrigin: "https://your-site.netlify.app"
```

### مشكلة 404 للمسارات

ملف `_redirects` في `client/public/` يحل هذه المشكلة تلقائياً.

### مشكلة البناء

تأكد من أن جميع المكتبات مُثبتة في `package.json` وليس فقط في `devDependencies` إذا كانت مطلوبة للبناء.