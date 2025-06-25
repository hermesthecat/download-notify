# Download Notify 📥

Firefox için geliştirilmiş basit ve etkili indirme bildirim uzantısı. Firefox'ta varsayılan olarak bulunmayan indirme bildirimleri özelliğini ekler.

## ✨ Özellikler

### 🔔 Bildirim Sistemi

- **İndirme Başlatma Bildirimi**: Yeni bir indirme başladığında anında bildirim
- **İndirme Tamamlanma Bildirimi**: İndirme tamamlandığında başarı bildirimi
- **Dosya Adı Gösterimi**: Bildirimlerde indirilen dosyanın adı görüntülenir
- **Görsel İkon**: Her bildirimde uzantının özel ikonu gösterilir

### 🚀 Performans

- **Hafif Yapı**: Sadece 25 satır kod ile minimal kaynak kullanımı
- **Hızlı Tepki**: Gerçek zamanlı indirme durumu takibi
- **Otomatik Temizlik**: Tamamlanan indirmeler hafızadan otomatik silinir

### 🎯 Kullanım Alanları

- Büyük dosya indirirken durumu takip etme
- Arka planda çalışırken indirme tamamlanma bildirimi
- Çoklu indirme süreçlerini organize etme
- Firefox'un eksik bildirim özelliğini tamamlama

## 🌐 Cross-Browser Uyumluluk

Bu uzantı **Firefox**, **Chrome**, **Edge** ve diğer Chromium tabanlı tarayıcılarda çalışır.

### 📦 Mevcut Versiyonlar

- **Firefox V2** (`manifest.json`) - Firefox için optimize edilmiş
- **Chrome V2** (`manifest-chrome.json`) - Chrome/Edge için optimize edilmiş  
- **Universal V3** (`manifest-v3.json`) - Gelecek uyumlu, tüm tarayıcılar

## 📋 Kurulum Rehberi

### 🦊 Firefox İçin Kurulum

1. **Hazır Paketi İndirin**
   - Firefox V2 paketini (`build/firefox-v2/`) kullanın
   - Veya `web-ext-artifacts/download-notify-1.0.zip` dosyasını indirin

2. **Firefox'ta Yükleyin**
   - Firefox adres çubuğuna `about:debugging` yazın
   - **Bu Firefox** sekmesine gidin
   - **Geçici Eklenti Yükle** butonuna tıklayın
   - `manifest.json` dosyasını seçin

### 🌟 Chrome/Edge İçin Kurulum

1. **Chrome Paketi Hazırlayın**
   - Chrome V2 paketini (`build/chrome-v2/`) kullanın

2. **Chrome'da Geliştirici Modunu Etkinleştirin**
   - Chrome'da `chrome://extensions/` adresine gidin
   - Sağ üst köşedeki **Geliştirici modu** anahtarını açın

3. **Uzantıyı Yükleyin**
   - **Paketlenmemiş öğe yükle** butonuna tıklayın
   - Chrome V2 paket klasörünü seçin

### ⚡ Manifest V3 (Gelecek Uyumlu)

1. **V3 Paketini Kullanın**
   - Universal V3 paketini (`build/universal-v3/`) kullanın

2. **Chrome/Edge'de Yükleyin**
   - Yukarıdaki Chrome kurulum adımlarını takip edin
   - V3 paketi hem Chrome hem de Firefox'un gelecek versiyonlarında çalışır

### Yöntem 2: Geliştirici Modu ile Yükleme

1. **Kaynak Kodunu Hazırlayın**
   - Proje klasörünü bilgisayarınızda bir konuma kopyalayın
   - Tüm dosyaların (`manifest.json`, `download-notify.js`, `icons/`) mevcut olduğundan emin olun

2. **Firefox Geliştirici Araçlarını Açın**
   - Firefox adres çubuğuna `about:debugging` yazın
   - Sol menüden **Bu Firefox** seçeneğini tıklayın

3. **Geçici Eklenti Yükleyin**
   - **Geçici Eklenti Yükle** butonuna tıklayın
   - Proje klasöründeki `manifest.json` dosyasını seçin
   - Uzantı otomatik olarak yüklenecek ve aktif olacaktır

### Yöntem 3: Web-ext Aracı ile Yükleme (Geliştiriciler için)

1. **Web-ext Aracını Kurun**

   ```bash
   npm install -g web-ext
   ```

2. **Proje Dizinine Gidin**

   ```bash
   cd download-notify-master
   ```

3. **Uzantıyı Çalıştırın**

   ```bash
   web-ext run
   ```

## 🔧 Kurulum Sonrası Kontrol

### Uzantının Çalıştığını Doğrulama

1. **Uzantı Listesini Kontrol Edin**
   - Firefox menüsünden **Eklentiler ve Temalar** açın
   - "download-notify" uzantısının listede ve aktif olduğunu görün

2. **Test İndirmesi Yapın**
   - Herhangi bir dosyayı indirmeye başlayın
   - Ekranın sağ üst köşesinde "Download Started" bildirimi görmelisiniz
   - İndirme tamamlandığında "Download Completed" bildirimi çıkmalıdır

3. **İzinleri Kontrol Edin**
   - Uzantının `downloads` ve `notifications` izinlerine sahip olduğunu doğrulayın

## ⚠️ Sorun Giderme

### Bildirimler Görünmüyor

- **Sistem Bildirimleri**: Windows bildirim ayarlarının açık olduğundan emin olun
- **Firefox İzinleri**: Firefox'ta bildirim izinlerinin verildiğini kontrol edin
- **Uzantı Durumu**: Uzantının aktif olduğunu ve hata vermediğini kontrol edin

### Uzantı Yüklenmiyor

- **Manifest Hatası**: `manifest.json` dosyasının doğru formatta olduğunu kontrol edin
- **Dosya Eksikliği**: Tüm gerekli dosyaların (`download-notify.js`, `icons/icon-48.png`) mevcut olduğunu doğrulayın
- **Firefox Versiyonu**: Firefox'un güncel bir versiyonunu kullandığınızdan emin olun

### İndirme Takip Edilmiyor

- **İzin Sorunu**: Uzantının `downloads` izinine sahip olduğunu kontrol edin
- **Konsol Hataları**: Firefox Geliştirici Araçları'nda (F12) konsol hatalarını kontrol edin

## 🔄 Güncelleme

Uzantıyı güncellemek için:

1. Eski versiyonu kaldırın
2. Yeni versiyonu yukarıdaki adımları takip ederek yükleyin

## 🔧 Geliştirici İçin Build Rehberi

### Otomatik Build (Önerilen)

```bash
# Bağımlılıkları yükle
npm install

# Tüm browser paketlerini oluştur
npm run build

# Firefox'ta test et
npm run dev:firefox

# Chrome'da test et  
npm run dev:chrome

# Dağıtım paketleri oluştur
npm run package:firefox
npm run package:chrome
npm run package:v3
```

## 🛠️ Teknik Gereksinimler

### Firefox V2

- **Firefox**: 57+ (WebExtensions API desteği)
- **Manifest**: V2
- **İzinler**: `downloads`, `notifications` (optional)

### Chrome V2  

- **Chrome**: 88+
- **Edge**: 88+
- **Manifest**: V2
- **İzinler**: `downloads`, `notifications` (optional)

### Universal V3

- **Chrome**: 88+
- **Firefox**: 109+ (V3 desteği)
- **Edge**: 88+
- **Manifest**: V3
- **Service Worker**: Evet
- **Storage API**: chrome.storage.local

### Ortak Gereksinimler

- **İşletim Sistemi**: Windows, macOS, Linux
- **Dosya Boyutu**: ~15KB (tüm dosyalar dahil)

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 📁 Proje Yapısı

```bash
download-notify-master/
├── 📄 manifest.json           # Firefox V2 manifest
├── 📄 manifest-chrome.json    # Chrome V2 manifest  
├── 📄 manifest-v3.json        # Universal V3 manifest
├── 📜 download-notify.js      # V2 ana script (cross-browser)
├── 📜 permission-manager.js   # V2 izin yöneticisi (cross-browser)
├── 📜 background-v3.js        # V3 service worker
├── 🔧 build.js               # Otomatik build script
├── 📦 package.json           # NPM konfigürasyonu
├── 📖 README.md              # Bu dokümantasyon
├── 📄 LICENSE                # MIT lisansı
├── 🖼️ icons/
│   └── icon-48.png           # Uzantı ikonu
├── 📦 build/                 # Build çıktıları (otomatik)
│   ├── firefox-v2/           # Firefox paketi
│   ├── chrome-v2/            # Chrome paketi
│   └── universal-v3/         # V3 paketi
└── 📦 web-ext-artifacts/     # Eski paket
    └── download-notify-1.0.zip
```

## 🎯 Özellik Karşılaştırması

| Özellik | V2 (Chrome/Firefox) | V3 (Universal) |
|---------|--------------------|--------------------|
| Bildirimler | ✅ | ✅ |
| Throttling | ✅ | ✅ |
| Memory Management | ✅ (RAM) | ✅ (Storage API) |
| Cross-browser | ✅ | ✅ |
| Service Worker | ❌ | ✅ |
| Persistent Storage | ❌ | ✅ |
| Future-proof | ⚠️ | ✅ |

---

💡 **Tavsiye**: Yeni projeler için **Universal V3** versiyonunu, mevcut sistemler için **V2** versiyonlarını kullanın.
