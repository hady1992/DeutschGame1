# رحلة الكلمات – نسخة أندرويد (APK) تعمل بدون إنترنت

## المتطلبات
- Node.js 18+ و NPM
- Android Studio + Android SDK (للتحزيم إلى APK)
- Java 17 (موصى به لـ Android Gradle)

## خطوات التجربة على المتصفح (اختياري)
```bash
npm install
npm run dev
```

## إنشاء نسخة إنتاج وبناء تطبيق أندرويد (APK)
> التطبيق يعمل بدون إنترنت لأن كل الملفات محزّمة داخل APK. النطق الألماني يعتمد على محرّك TTS في الجهاز، وإن لم يكن متوفّرًا سيعمل التطبيق بدون صوت.

1) تثبيت الحزم:
```bash
npm install
```

2) بناء نسخة الويب (تُستخدم كمصدر للتطبيق):
```bash
npm run build
```

3) تهيئة Capacitor (مرة واحدة فقط في أول مشروع):
```bash
npm run android:init
```

4) إضافة منصة أندرويد:
```bash
npm run android:add
```

5) مزامنة الملفات إلى مشروع أندرويد:
```bash
npm run android:sync
```

6) فتح المشروع في Android Studio وبناء APK:
```bash
npm run android:open
```
- من Android Studio: Build > Build Bundle(s)/APK(s) > Build APK(s)
- ستجد الـ APK داخل: `android/app/build/outputs/apk/debug/` (أو release عند إنشاء إصدار توقيع).

## ملاحظات
- لا حاجة لخادم أو اتصال إنترنت.
- لو أردت إصدار Release موقّع للنشر، أنشئ key store وفعّل signingConfig في Gradle.
- في حال عدم وجود محرك TTS ألماني بالجهاز، يمكنك تثبيته من إعدادات الجهاز > اللغات والإدخال > إخراج النص إلى كلام.
