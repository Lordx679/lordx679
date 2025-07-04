# حل مشكلة GitHub OAuth - خطوات مفصلة

## المشكلة الحالية
لا يزال GitHub يظهر خطأ "redirect_uri is not associated with this application" رغم إضافة callback URLs.

## الحلول البديلة

### الحل 1: إنشاء GitHub OAuth App جديد (الأسرع)

1. **أنشئ OAuth App جديد**:
   - اذهب إلى: https://github.com/settings/developers
   - اضغط "New OAuth App"

2. **الإعدادات الجديدة**:
   ```
   Application name: Discord World
   Homepage URL: https://discordworld.netlify.app
   Authorization callback URL: https://b7ceafba-f681-4c0e-8b37-5a6a30548e1b-00-dbkkclcrhexb.riker.replit.dev/api/auth/github/callback
   ```

3. **بعد الإنشاء**:
   - انسخ Client ID الجديد
   - اضغط "Generate a new client secret"
   - انسخ Client Secret الجديد

4. **أضف callback URL الثاني**:
   - اضغط "Edit" على التطبيق الجديد
   - أضف في Authorization callback URL:
   ```
   https://b7ceafba-f681-4c0e-8b37-5a6a30548e1b-00-dbkkclcrhexb.riker.replit.dev/api/auth/github/callback
   https://discordworld.netlify.app/api/auth/github/callback
   ```

### الحل 2: تحقق من التطبيق الحالي

1. **تأكد من callback URLs**:
   - يجب أن تكون في خانة "Authorization callback URL"
   - كل رابط في سطر منفصل
   - بدون مسافات إضافية

2. **الروابط الصحيحة**:
   ```
   https://b7ceafba-f681-4c0e-8b37-5a6a30548e1b-00-dbkkclcrhexb.riker.replit.dev/api/auth/github/callback
   https://discordworld.netlify.app/api/auth/github/callback
   ```

3. **احفظ وانتظر**:
   - اضغط "Update application"
   - انتظر 30-60 ثانية
   - جرب تسجيل الدخول مرة أخرى

### الحل 3: استخدام رابط واحد مؤقتاً

إذا لم تعمل الحلول السابقة، استخدم رابط Replit فقط مؤقتاً:

```
Authorization callback URL:
https://b7ceafba-f681-4c0e-8b37-5a6a30548e1b-00-dbkkclcrhexb.riker.replit.dev/api/auth/github/callback
```

وعند النشر على Netlify، غير الرابط إلى:
```
https://discordworld.netlify.app/api/auth/github/callback
```

## ما تفعله بعد الحل

بمجرد حصولك على Client ID و Client Secret جديد، أرسلهما وسأحدث الإعدادات فوراً.