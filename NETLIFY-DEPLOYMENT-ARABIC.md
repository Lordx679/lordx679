# دليل رفع المشروع على Netlify

## 📋 المتطلبات الأساسية

1. حساب على [Netlify](https://app.netlify.com)
2. حساب على [GitHub](https://github.com) (اختياري لكن موصى به)
3. التأكد من وجود ملف `.env` بالمعلومات الصحيحة

## 🚀 الطريقة الأولى: النشر من GitHub (الأفضل)

### 1️⃣ رفع المشروع على GitHub

```bash
# إنشاء مستودع جديد على GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/project-name.git
git push -u origin main
```

### 2️⃣ ربط Netlify بـ GitHub

1. **ادخل لحسابك على Netlify**
   - اذهب إلى [app.netlify.com](https://app.netlify.com)
   - اضغط على "Add new site"
   - اختر "Import an existing project"

2. **اربط مستودع GitHub**
   - اختر "GitHub"
   - اسمح لـ Netlify بالوصول للمستودعات
   - اختر مستودع المشروع

### 3️⃣ إعدادات البناء في Netlify

```
Base directory: (اتركه فارغ)
Build command: npm run build
Publish directory: dist/public
Functions directory: netlify/functions
```

### 4️⃣ إضافة متغيرات البيئة

1. اضغط على "Show advanced"
2. اضغط على "New variable"
3. أضف المتغيرات التالية:

```
DATABASE_URL = mongodb+srv://codex-us2:codex-us2@codex-us2.62zm1.mongodb.net/?retryWrites=true&w=majority&appName=codex-us2
GITHUB_CLIENT_ID = Ov23lihaX4CSTXNgP0F4
GITHUB_CLIENT_SECRET = 39c16791e0e0438def3f45e67fa84cb848a746ff
SESSION_SECRET = nuEdb4WjWWj/JQ5qex1mbx5Ia1cn11A0uXySXKAFlzQCJMy5URYBEHjy8uLGU4/vptQT6E+2gtlYjNevSbM06w==
ADMIN_USERS = ["190771533"]
```

### 5️⃣ نشر الموقع

- اضغط على "Deploy site"
- انتظر حتى ينتهي البناء (3-5 دقائق)

## 🎯 الطريقة الثانية: النشر المباشر (السحب والإفلات)

### 1️⃣ بناء المشروع محلياً

```bash
# تأكد من وجود ملف .env
# ثم قم بالبناء
npm run build
```

### 2️⃣ التحقق من البناء

```bash
# تأكد من وجود المجلدات
ls -la dist/public/
ls -la netlify/functions/
```

### 3️⃣ رفع المشروع

1. اذهب إلى [app.netlify.com](https://app.netlify.com)
2. اسحب مجلد `dist/public` مباشرة إلى الصفحة
3. انتظر حتى يتم الرفع

⚠️ **ملاحظة**: هذه الطريقة لن تدعم Netlify Functions تلقائياً

## 🔧 إعداد GitHub OAuth

بعد نشر الموقع، احصل على رابط الموقع (مثل: `https://your-site.netlify.app`)

### تحديث إعدادات OAuth في GitHub:

1. اذهب إلى GitHub Settings
2. Developer settings > OAuth Apps
3. اختر التطبيق أو أنشئ جديد
4. حدّث الإعدادات:
   ```
   Homepage URL: https://your-site.netlify.app
   Authorization callback URL: https://your-site.netlify.app/api/auth/github/callback
   ```
5. احفظ التغييرات

## 📝 إعدادات إضافية (اختياري)

### تغيير اسم الموقع

1. في Netlify، اذهب إلى Site settings
2. Change site name
3. اختر اسم مميز (مثل: `discord-projects-arabic`)

### إضافة دومين خاص

1. Site settings > Domain management
2. Add custom domain
3. اتبع التعليمات لربط الدومين

## 🐛 حل المشاكل الشائعة

### مشكلة: "Page not found" عند التنقل

✅ **الحل**: ملف `netlify.toml` يحتوي على إعدادات إعادة التوجيه الصحيحة

### مشكلة: "Failed to fetch" أو أخطاء CORS

✅ **الحل**: تأكد من إضافة متغيرات البيئة في Netlify

### مشكلة: تسجيل الدخول لا يعمل

✅ **الحل**: 
1. تحقق من تحديث GitHub OAuth URLs
2. تأكد من إضافة `GITHUB_CLIENT_ID` و `GITHUB_CLIENT_SECRET` في Netlify

### مشكلة: "MongoDB connection failed"

✅ **الحل**: تأكد من إضافة `DATABASE_URL` في متغيرات البيئة

## ✅ التحقق من نجاح النشر

1. **الصفحة الرئيسية**: يجب أن تظهر بدون أخطاء
2. **تسجيل الدخول**: يجب أن يحولك إلى GitHub
3. **إضافة مشروع**: يجب أن يعمل بعد تسجيل الدخول
4. **رفع الملفات**: يجب أن يعمل بشكل طبيعي

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من سجلات البناء في Netlify (Deploy log)
2. تحقق من Function logs للأخطاء
3. تأكد من إضافة جميع متغيرات البيئة

---

🎉 **مبروك! موقعك الآن مباشر على الإنترنت**