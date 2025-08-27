# VocabShare Web

Basit, web tabanlı ortak kelime öğrenme uygulaması.

## Özellikler
- Oda kodu ile ortak liste (Firebase Realtime Database)
- Kelime ekleme (artikel opsiyonel), çeviri ve örnek
- Listeleme (artikelsiz alfabetik)
- Quiz: düşük skorlular öncelikli
- Düzenleme / Silme

## Kurulum
1. `npm install`
2. `src/firebase.js` içine kendi Firebase config bilgilerini girin.
3. Firebase Realtime Database kurallarını basit kullanım için açın:
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
   > Güvenlik için sadece kendi odanıza özel kural da yazabilirsiniz.

4. `npm run dev` → tarayıcıda açılır.

## Deploy
- [Vercel](https://vercel.com) veya [Netlify](https://www.netlify.com/) ile tek tık deploy edebilirsiniz.
- Mobil uyumlu çalışır, "Ana ekrana ekle" ile PWA gibi kullanılabilir.
