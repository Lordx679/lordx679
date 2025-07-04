# GitHub OAuth Debug Information

## Current OAuth App Details
- **Client ID**: Ov23lipN5ASsnC3ovIiv
- **Client Secret**: 7e87124cd44fba88996ac4e7ab1331937c10f4c1
- **Homepage URL**: https://discordworld.netlify.app

## Required Callback URLs for GitHub OAuth App
يجب أن تكون Authorization callback URLs في GitHub كالتالي:

```
https://b7ceafba-f681-4c0e-8b37-5a6a30548e1b-00-dbkkclcrhexb.riker.replit.dev/api/auth/github/callback
https://discordworld.netlify.app/api/auth/github/callback
```

## خطوات التحقق

### 1. تحقق من GitHub OAuth App
- اذهب إلى: https://github.com/settings/developers
- ابحث عن التطبيق (Client ID: Ov23lipN5ASsnC3ovIiv)
- تأكد أن Authorization callback URL تحتوي على الرابطين أعلاه

### 2. إذا لم ينجح، جرب رابط واحد فقط
ضع فقط رابط Replit:
```
https://b7ceafba-f681-4c0e-8b37-5a6a30548e1b-00-dbkkclcrhexb.riker.replit.dev/api/auth/github/callback
```

### 3. Callback URL للاختبار المحلي
إذا كنت تختبر محلياً، استخدم:
```
http://localhost:5000/api/auth/github/callback
```

## معلومات إضافية

### الروابط الحالية في الكود:
- Replit Development: https://b7ceafba-f681-4c0e-8b37-5a6a30548e1b-00-dbkkclcrhexb.riker.replit.dev
- Netlify Production: https://discordworld.netlify.app

### لاختبار OAuth:
1. افتح: https://b7ceafba-f681-4c0e-8b37-5a6a30548e1b-00-dbkkclcrhexb.riker.replit.dev
2. اضغط زر تسجيل الدخول
3. يجب أن يعيدك إلى GitHub OAuth
4. بعد الموافقة، يجب العودة للموقع مع تسجيل دخول ناجح