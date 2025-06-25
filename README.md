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

## 📋 Kurulum Rehberi

### Yöntem 1: Hazır Paket Yükleme (Önerilen)

1. **Dosyayı İndirin**
   - `web-ext-artifacts/download-notify-1.0.zip` dosyasını bilgisayarınıza kaydedin

2. **Firefox Geliştirici Modunu Etkinleştirin**
   - Firefox adres çubuğuna `about:config` yazın
   - `xpinstall.signatures.required` ayarını `false` yapın (isteğe bağlı)

3. **Uzantıyı Yükleyin**
   - Firefox menüsünden **Eklentiler ve Temalar** seçin
   - Sağ üst köşedeki ⚙️ (ayarlar) simgesine tıklayın
   - **Add-on'u Dosyadan Yükle** seçeneğini seçin
   - İndirdiğiniz `.zip` dosyasını seçin

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

## 🛠️ Teknik Gereksinimler

- **Firefox**: 57+ (WebExtensions API desteği)
- **İşletim Sistemi**: Windows, macOS, Linux
- **İzinler**: `downloads`, `notifications`
- **Manifest Versiyonu**: 2.0

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

---

💡 **İpucu**: Bu uzantı Chrome/Edge tarayıcılarında da çalışabilir, ancak Firefox için optimize edilmiştir.
