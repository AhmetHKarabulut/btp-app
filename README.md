# BTP Mobil Uygulama

Bağımsız Türkiye Partisi (BTP) üye yönetim mobil uygulaması. React Native ve Expo kullanılarak geliştirilmiştir.

## 🚀 Özellikler

- ✅ Kullanıcı girişi
- ✅ Üye listesi görüntüleme
- ✅ Üye bilgilerini filtreleme (İsim, Telefon)
- ✅ Sıralama seçenekleri (Tarih, Alfabetik)
- ✅ Üye detayları görüntüleme
- ✅ Üye bilgilerini güncelleme
- ✅ Teşkilat ve Sempatizan ayrımı
- ✅ Mobil uyumlu modern tasarım

## 📱 Kurulum

### Gereksinimler

- Node.js (v18 veya üzeri)
- npm veya yarn
- Expo CLI
- iOS için: Xcode (Mac gerekli)
- Android için: Android Studio

### Adımlar

1. Bağımlılıkları yükleyin:
```bash
cd btp-mobile
npm install
```

2. Uygulamayı başlatın:
```bash
npm start
```

## 🎯 Kullanım

### Development Modunda Çalıştırma

```bash
# Expo geliştirme sunucusunu başlat
npm start

# Android emülatörde çalıştır
npm run android

# iOS simülatörde çalıştır (sadece Mac)
npm run ios

# Web tarayıcısında çalıştır
npm run web
```

### Fiziksel Cihazda Test Etme

1. **Expo Go** uygulamasını indirin:
   - iOS: App Store'dan "Expo Go"
   - Android: Play Store'dan "Expo Go"

2. `npm start` komutu ile QR kodu görüntüleyin

3. Expo Go uygulaması ile QR kodu tarayın

## 📂 Proje Yapısı

```
btp-mobile/
├── App.js                      # Ana uygulama ve navigasyon
├── src/
│   ├── screens/
│   │   ├── LoginScreen.js      # Giriş ekranı
│   │   ├── MainMenuScreen.js   # Ana menü ve üye listesi
│   │   └── PersonDetailScreen.js # Kişi detay ekranı
│   ├── components/             # Yeniden kullanılabilir bileşenler
│   └── api/                    # API servisleri
├── assets/                     # Görseller ve statik dosyalar
└── package.json
```

## 🎨 Teknolojiler

- **React Native** - Mobil uygulama framework'ü
- **Expo** - React Native geliştirme platformu
- **React Navigation** - Sayfa yönlendirme
- **Axios** - HTTP istekleri (gelecekte API entegrasyonu için)

## 🔄 Web Uygulamasından Farklar

Bu mobil uygulama, mevcut web uygulamasının React Native versiyonudur:

| Özellik | Web App | Mobil App |
|---------|---------|-----------|
| Platform | Tarayıcı | iOS/Android |
| UI Framework | React DOM | React Native |
| Stil | CSS | StyleSheet |
| Navigasyon | React Router | React Navigation |
| Dağıtım | Web sunucu | App Store/Play Store |

## 📝 Geliştirme Notları

### Demo Veriler

Uygulama şu anda demo verilerle çalışmaktadır. Gerçek API entegrasyonu için `src/api` klasöründeki dosyaları kullanabilirsiniz.

### Stil Özelleştirme

Tüm renkler ve stiller her ekranın `StyleSheet` bölümünde tanımlanmıştır. BTP'nin kurumsal rengi `#c8102e` kullanılmıştır.

### Performans

- FlatList kullanılarak büyük listeler optimize edilmiştir
- useMemo ile gereksiz yeniden hesaplamalar önlenmiştir
- Modal'lar için animasyonlar eklenmiştir

## 🚢 Production Build

### Android APK Oluşturma

```bash
# EAS Build kullanarak
npm install -g eas-cli
eas build --platform android
```

### iOS IPA Oluşturma

```bash
# EAS Build kullanarak (Mac gerekli)
eas build --platform ios
```

## 📄 Lisans

© 2026 Bağımsız Türkiye Partisi

## 🤝 Katkıda Bulunma

Bu proje BTP için geliştirilmiştir. Değişiklik önerileri için lütfen iletişime geçin.

## 📞 İletişim

Sorularınız için BTP teknoloji ekibi ile iletişime geçebilirsiniz.


