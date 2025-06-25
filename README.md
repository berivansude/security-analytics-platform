# Security Analytics Platform

Web tabanlı güvenlik analizi, log yönetimi, zararlı yazılım tespiti, veri madenciliği ve otomatik raporlama platformu.

## 🚀 Özellikler

### 📊 Log Analizi
- CSV, JSON, TXT formatlarında log dosyası yükleme
- Gerçek zamanlı log izleme
- Log seviyesi analizi (ERROR, WARNING, INFO)
- IP adresi ve zaman analizi
- Şüpheli pattern tespiti
- Gelişmiş arama ve filtreleme

### 🛡️ Güvenlik Analizi
- Dosya güvenlik taraması
- Zararlı yazılım pattern tespiti
- Ağ trafiği analizi
- DDoS ve port tarama tespiti
- Güvenlik durumu raporlama
- Risk seviyesi değerlendirmesi

### 🔍 Veri Madenciliği
- Pattern analizi
- Kümeleme analizi
- Anomali tespiti
- Trend analizi
- Korelasyon analizi
- Gerçek zamanlı analitik

### 📈 Otomatik Raporlama
- Güvenlik raporları
- Performans raporları
- Analitik raporları
- Kapsamlı raporlar
- JSON ve CSV formatında indirme
- Zamanlanmış raporlama

## 🛠️ Teknolojiler

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **Socket.io** - Gerçek zamanlı iletişim
- **Multer** - Dosya yükleme
- **CSV Parser** - Log dosyası işleme
- **Helmet** - Güvenlik middleware
- **Morgan** - Logging

### Frontend
- **React.js** - UI framework
- **React Router** - Sayfa yönlendirme
- **Recharts** - Grafik ve chart'lar
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Socket.io Client** - Gerçek zamanlı veri
- **React Dropzone** - Dosya yükleme
- **Lucide React** - İkonlar

## 📦 Kurulum

### Gereksinimler
- Node.js (v16 veya üzeri)
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd security-analytics-platform
```

2. **Bağımlılıkları yükleyin**
```bash
npm run install-all
```

3. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

Bu komut hem backend (port 5000) hem de frontend (port 3000) sunucularını başlatacaktır.

## 🏃‍♂️ Kullanım

### Backend API Endpoints

#### Log Analizi
- `POST /api/logs/upload` - Log dosyası yükleme
- `GET /api/logs/stream` - Gerçek zamanlı log izleme
- `GET /api/logs/search` - Log arama ve filtreleme

#### Güvenlik
- `POST /api/security/scan` - Dosya güvenlik taraması
- `POST /api/security/network-analysis` - Ağ trafiği analizi
- `GET /api/security/status` - Güvenlik durumu

#### Analitik
- `POST /api/analytics/data-mining` - Veri madenciliği
- `GET /api/analytics/realtime` - Gerçek zamanlı analitik
- `GET /api/analytics/dashboard` - Dashboard verileri

#### Raporlar
- `POST /api/reports/generate` - Rapor oluşturma
- `GET /api/reports/download/:id` - Rapor indirme
- `GET /api/reports/list` - Rapor listesi
- `POST /api/reports/schedule` - Rapor zamanlama

### Frontend Sayfaları

- **Dashboard** (`/`) - Genel bakış ve metrikler
- **Log Analizi** (`/logs`) - Log yükleme ve analiz
- **Güvenlik** (`/security`) - Güvenlik taraması
- **Veri Madenciliği** (`/analytics`) - Veri analizi
- **Raporlar** (`/reports`) - Rapor yönetimi

## 📁 Proje Yapısı

```
security-analytics-platform/
├── server/                 # Backend
│   ├── routes/            # API route'ları
│   │   ├── logs.js        # Log analizi
│   │   ├── security.js    # Güvenlik analizi
│   │   ├── analytics.js   # Veri madenciliği
│   │   ├── reports.js     # Raporlama
│   │   └── auth.js        # Kimlik doğrulama
│   ├── uploads/           # Yüklenen dosyalar
│   ├── reports/           # Oluşturulan raporlar
│   ├── index.js           # Ana server dosyası
│   └── package.json       # Backend bağımlılıkları
├── client/                # Frontend
│   ├── src/
│   │   ├── components/    # React bileşenleri
│   │   ├── pages/         # Sayfa bileşenleri
│   │   ├── App.js         # Ana uygulama
│   │   └── App.css        # Stiller
│   ├── public/            # Statik dosyalar
│   └── package.json       # Frontend bağımlılıkları
├── package.json           # Ana proje dosyası
└── README.md              # Bu dosya
```

## 🔧 Konfigürasyon

### Environment Variables

Backend için `.env` dosyası oluşturun:

```env
PORT=5000
NODE_ENV=development
```

### Güvenlik Ayarları

- Helmet.js güvenlik middleware'i aktif
- CORS konfigürasyonu
- Dosya yükleme güvenliği
- Rate limiting (eklenebilir)

## 📊 Özellik Detayları

### Log Analizi
- **Desteklenen formatlar**: CSV, JSON, TXT
- **Analiz özellikleri**: 
  - Log seviyesi dağılımı
  - IP adresi çıkarma
  - Zaman serisi analizi
  - Şüpheli pattern tespiti
  - Hata oranı hesaplama

### Güvenlik Taraması
- **Dosya analizi**:
  - JavaScript injection tespiti
  - XSS pattern'ları
  - Şüpheli dosya uzantıları
  - Hash hesaplama
- **Ağ analizi**:
  - Port tarama tespiti
  - DDoS göstergeleri
  - Şüpheli bağlantılar

### Veri Madenciliği
- **Pattern analizi**: Sık kullanılan öğeler, korelasyonlar
- **Kümeleme**: K-means benzeri algoritma
- **Anomali tespiti**: 3-sigma kuralı
- **Trend analizi**: Zaman serisi analizi

### Raporlama
- **Rapor türleri**: Güvenlik, performans, analitik, kapsamlı
- **Formatlar**: JSON, CSV
- **Zamanlama**: Günlük, haftalık, aylık
- **Otomatik gönderim**: Email entegrasyonu (eklenebilir)

## 🚀 Geliştirme

### Yeni özellik ekleme

1. Backend route'u oluşturun (`server/routes/`)
2. Frontend sayfası ekleyin (`client/src/pages/`)
3. Navbar'a link ekleyin (`client/src/components/Navbar.js`)
4. App.js'e route ekleyin

### Test etme

```bash
# Backend test
cd server
npm test

# Frontend test
cd client
npm test
```

## 🔒 Güvenlik

- Dosya yükleme güvenliği
- Input validation
- SQL injection koruması
- XSS koruması
- CORS konfigürasyonu

## 📈 Performans

- Dosya yükleme optimizasyonu
- Gerçek zamanlı veri akışı
- Chart rendering optimizasyonu
- Lazy loading (eklenebilir)

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Proje hakkında sorularınız için issue açabilirsiniz.

## 🙏 Teşekkürler

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Lucide](https://lucide.dev/) 