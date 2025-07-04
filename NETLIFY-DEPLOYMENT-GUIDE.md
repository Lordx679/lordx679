# دليل نشر المشروع على Netlify - خطوة بخطوة

## نظرة عامة على المشروع

هذا المشروع يتكون من:
- **Frontend**: React + TypeScript + Vite
- **Backend**: Express + Node.js + MongoDB
- **Database**: MongoDB Atlas

⚠️ **مهم**: Netlify يستضيف فقط المواقع الثابتة (Frontend)، لذا ستحتاج إلى استضافة Backend منفصلة.

## الخطوة 1: استضافة Backend أولاً

### خيارات استضافة Backend الموصى بها:

1. **Railway.app** (الأسهل)
   - يدعم Node.js مباشرة
   - يوفر MongoDB مجاني
   - نشر تلقائي من GitHub

2. **Render.com** 
   - خطة مجانية متاحة
   - يدعم Node.js
   - نشر من GitHub

3. **Heroku** (مدفوع)
   - موثوق وسريع
   - دعم ممتاز

### خطوات نشر Backend على Railway:

1. اذهب إلى [railway.app](https://railway.app)
2. انقر "Start a New Project"
3. اختر "Deploy from GitHub repo"
4. اربط مستودع GitHub
5. أضف المتغيرات التالية في Railway:
   ```
   DATABASE_URL=mongodb+srv://codex-us2:codex-us2@codex-us2.62zm1.mongodb.net/discord-projects
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   SESSION_SECRET=your_session_secret
   NODE_ENV=production
   ```
6. Railway سينشر Backend تلقائياً
7. احصل على رابط Backend (مثل: https://your-app.railway.app)

## الخطوة 2: تحضير Frontend للنشر على Netlify

### 1. تحديث متغيرات البيئة

أنشئ ملف `.env` في المجلد الرئيسي:
```env
VITE_API_URL=https://your-backend-url.railway.app
```

### 2. اختبار البناء محلياً

```bash
# تأكد من أن البناء يعمل
npm run build

# تحقق من وجود مجلد dist/public
ls -la dist/public/
```

## الخطوة 3: النشر على Netlify

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
   ```

5. **متغيرات البيئة**
   - انقر "Show advanced"
   - أضف متغير:
     ```
     Key: VITE_API_URL
     Value: https://your-backend-url.railway.app
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

## الخطوة 4: تحديث GitHub OAuth

1. اذهب إلى GitHub Settings > Developer settings > OAuth Apps
2. حدث OAuth App:
   - **Homepage URL**: https://your-site.netlify.app
   - **Authorization callback URL**: https://your-backend-url.railway.app/auth/github/callback

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

## البنية النهائية

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Netlify       │────▶│    Railway       │────▶│  MongoDB    │
│   (Frontend)    │     │   (Backend API)  │     │   Atlas     │
└─────────────────┘     └──────────────────┘     └─────────────┘
```

## الدعم

إذا واجهت أي مشاكل:
1. تحقق من سجلات Netlify
2. تحقق من سجلات Railway/Backend
3. افتح Console في المتصفح
4. تأكد من أن جميع الروابط تستخدم HTTPS