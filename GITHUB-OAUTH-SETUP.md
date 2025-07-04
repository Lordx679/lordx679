# إعداد GitHub OAuth للعمل مع Replit و Netlify

## المشكلة الحالية
تظهر رسالة خطأ "redirect_uri is not associated with this application" لأن GitHub OAuth App لا يحتوي على جميع callback URLs المطلوبة.

## الحل

### 1. انتقل إلى GitHub Developer Settings
- اذهب إلى: https://github.com/settings/developers
- اضغط على "OAuth Apps"
- ابحث عن التطبيق (Client ID: `Ov23lihaX4CSTXNgP0F4`)
- اضغط "Edit"

### 2. أضف Authorization callback URLs
في خانة "Authorization callback URL"، أضف كل رابط في سطر منفصل:

```
https://b7ceafba-f681-4c0e-8b37-5a6a30548e1b-00-dbkkclcrhexb.riker.replit.dev/api/auth/github/callback
https://discordworld.netlify.app/api/auth/github/callback
```

**مهم**: 
- GitHub يدعم عدة callback URLs
- ضع كل رابط في سطر منفصل
- تأكد من عدم وجود مسافات إضافية

### 3. احفظ التغييرات
- اضغط "Update application"
- انتظر بضع ثوانٍ لتطبيق التغييرات

### 4. اختبر التسجيل
- عد إلى الموقع وجرب تسجيل الدخول
- يجب أن يعمل الآن بدون أخطاء

## معلومات إضافية

### للتطوير على Replit:
- الرابط: `https://b7ceafba-f681-4c0e-8b37-5a6a30548e1b-00-dbkkclcrhexb.riker.replit.dev/api/auth/github/callback`
- يعمل تلقائياً مع متغير `REPLIT_DEV_DOMAIN`

### للإنتاج على Netlify:
- الرابط: `https://discordworld.netlify.app/api/auth/github/callback`
- يعمل تلقائياً مع متغير `URL` في Netlify

### للتطوير المحلي:
- الرابط: `http://localhost:5000/api/auth/github/callback`
- للاختبار المحلي فقط