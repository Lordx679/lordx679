# Discord Projects Platform

منصة لعرض وإدارة مشاريع الديسكورد باللغة العربية مع واجهة عصرية وأنيقة.

## الإعداد للاستضافة

### 1. إعداد GitHub OAuth

قبل رفع المشروع على الاستضافة، تحتاج لإعداد تطبيق GitHub OAuth:

1. اذهب إلى [GitHub Developer Settings](https://github.com/settings/developers)
2. انقر على "New OAuth App"
3. املأ التفاصيل:
   - **Application name**: اسم تطبيقك
   - **Homepage URL**: رابط موقعك (مثال: `https://yoursite.com`)
   - **Authorization callback URL**: `https://yoursite.com/api/auth/github/callback`

### 2. تحديث ملف الإعدادات

افتح ملف `server/config.ts` وحدث القيم التالية:

```javascript
export const GITHUB_CONFIG = {
  clientId: "your_actual_github_client_id",
  clientSecret: "your_actual_github_client_secret"
};

export const SESSION_CONFIG = {
  secret: "a-very-secure-random-string-for-production"
};
```

### 3. إعداد قاعدة البيانات

المشروع يستخدم PostgreSQL. تأكد من:
- إعداد متغير البيئة `DATABASE_URL` في الاستضافة
- تشغيل `npm run db:push` لإنشاء الجداول

### 4. البناء والنشر

```bash
# تثبيت التبعيات
npm install

# بناء المشروع
npm run build

# تشغيل الخادم
npm start
```

## الميزات

- 🔐 تسجيل دخول آمن عبر GitHub
- 🎨 تصميم عصري بألوان البنفسجي الأنيق
- 📱 متجاوب مع جميع الأجهزة
- 🔍 بحث وتصفية المشاريع
- ❤️ نظام الإعجابات
- 👥 لوحة تحكم الإدارة
- 🌙 وضع مظلم افتراضي

## الفئات المتاحة

- بوتات
- سيرفرات  
- أدوات
- قوالب
- مصممين

## تقنيات المشروع

- **Frontend**: React 18 + TypeScript
- **Backend**: Express.js + Node.js  
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: GitHub OAuth
- **Styling**: Tailwind CSS + shadcn/ui
- **Build**: Vite + ESBuild