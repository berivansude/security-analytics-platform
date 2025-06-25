const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Dosya yükleme konfigürasyonu
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/security');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Dosya güvenlik analizi
router.post('/scan', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Dosya yüklenmedi' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const fileSize = req.file.size;

    // Dosya analizi
    const analysis = await performSecurityAnalysis(filePath, fileName, fileSize);

    res.json({
      message: 'Güvenlik analizi tamamlandı',
      filename: fileName,
      analysis: analysis
    });

  } catch (error) {
    console.error('Güvenlik analizi hatası:', error);
    res.status(500).json({ error: 'Güvenlik analizi sırasında hata oluştu' });
  }
});

// Güvenlik analizi fonksiyonu
async function performSecurityAnalysis(filePath, fileName, fileSize) {
  const analysis = {
    fileName: fileName,
    fileSize: fileSize,
    scanTimestamp: new Date().toISOString(),
    threats: [],
    riskLevel: 'LOW',
    recommendations: [],
    fileType: path.extname(fileName).toLowerCase(),
    hash: await calculateFileHash(filePath)
  };

  // Dosya içeriğini oku
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const fileBuffer = fs.readFileSync(filePath);

  // Zararlı yazılım pattern'ları
  const malwarePatterns = [
    { pattern: /eval\s*\(/, name: 'JavaScript Code Injection', severity: 'HIGH' },
    { pattern: /<script.*?>.*?<\/script>/gi, name: 'XSS Script Tag', severity: 'HIGH' },
    { pattern: /document\.write\s*\(/, name: 'DOM Manipulation', severity: 'MEDIUM' },
    { pattern: /innerHTML\s*=/, name: 'InnerHTML Assignment', severity: 'MEDIUM' },
    { pattern: /onload\s*=/, name: 'Event Handler Injection', severity: 'MEDIUM' },
    { pattern: /onclick\s*=/, name: 'Click Event Injection', severity: 'MEDIUM' },
    { pattern: /javascript:/gi, name: 'JavaScript Protocol', severity: 'HIGH' },
    { pattern: /data:text\/html/, name: 'Data URI HTML', severity: 'HIGH' },
    { pattern: /base64/, name: 'Base64 Encoding', severity: 'LOW' },
    { pattern: /\\x[0-9a-fA-F]{2}/g, name: 'Hex Encoding', severity: 'MEDIUM' }
  ];

  // Pattern kontrolü
  malwarePatterns.forEach(({ pattern, name, severity }) => {
    const matches = fileContent.match(pattern);
    if (matches) {
      analysis.threats.push({
        name: name,
        severity: severity,
        count: matches.length,
        description: `${name} pattern'i ${matches.length} kez tespit edildi`
      });
    }
  });

  // Dosya boyutu kontrolü
  if (fileSize > 10 * 1024 * 1024) { // 10MB
    analysis.threats.push({
      name: 'Large File Size',
      severity: 'LOW',
      count: 1,
      description: 'Dosya boyutu 10MB\'dan büyük'
    });
  }

  // Şüpheli dosya uzantıları
  const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com'];
  if (suspiciousExtensions.includes(analysis.fileType)) {
    analysis.threats.push({
      name: 'Suspicious File Extension',
      severity: 'HIGH',
      count: 1,
      description: `Şüpheli dosya uzantısı: ${analysis.fileType}`
    });
  }

  // Risk seviyesi hesaplama
  const highThreats = analysis.threats.filter(t => t.severity === 'HIGH').length;
  const mediumThreats = analysis.threats.filter(t => t.severity === 'MEDIUM').length;

  if (highThreats > 0) {
    analysis.riskLevel = 'HIGH';
  } else if (mediumThreats > 2) {
    analysis.riskLevel = 'MEDIUM';
  }

  // Öneriler
  if (analysis.riskLevel === 'HIGH') {
    analysis.recommendations.push('Dosyayı karantinaya alın');
    analysis.recommendations.push('Antivirus yazılımı ile tam tarama yapın');
    analysis.recommendations.push('Dosyayı güvenli bir ortamda test edin');
  } else if (analysis.riskLevel === 'MEDIUM') {
    analysis.recommendations.push('Dosyayı dikkatli inceleyin');
    analysis.recommendations.push('Sandbox ortamında test edin');
  } else {
    analysis.recommendations.push('Dosya güvenli görünüyor');
  }

  return analysis;
}

// Dosya hash hesaplama
async function calculateFileHash(filePath) {
  const crypto = require('crypto');
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

// Ağ trafiği analizi
router.post('/network-analysis', (req, res) => {
  const { trafficData } = req.body;

  if (!trafficData || !Array.isArray(trafficData)) {
    return res.status(400).json({ error: 'Geçerli trafik verisi gerekli' });
  }

  const analysis = analyzeNetworkTraffic(trafficData);

  res.json({
    message: 'Ağ trafiği analizi tamamlandı',
    analysis: analysis
  });
});

// Ağ trafiği analiz fonksiyonu
function analyzeNetworkTraffic(trafficData) {
  const analysis = {
    totalPackets: trafficData.length,
    suspiciousConnections: [],
    portScanAttempts: [],
    ddosIndicators: [],
    unusualPatterns: [],
    summary: {}
  };

  const connectionCounts = {};
  const portCounts = {};
  const ipCounts = {};

  trafficData.forEach(packet => {
    const { sourceIP, destIP, sourcePort, destPort, protocol, timestamp } = packet;

    // Bağlantı sayısı
    const connectionKey = `${sourceIP}:${sourcePort}-${destIP}:${destPort}`;
    connectionCounts[connectionKey] = (connectionCounts[connectionKey] || 0) + 1;

    // Port sayısı
    portCounts[destPort] = (portCounts[destPort] || 0) + 1;

    // IP sayısı
    ipCounts[sourceIP] = (ipCounts[sourceIP] || 0) + 1;
  });

  // Şüpheli bağlantılar
  Object.entries(connectionCounts).forEach(([connection, count]) => {
    if (count > 100) {
      analysis.suspiciousConnections.push({
        connection: connection,
        count: count,
        description: 'Yüksek bağlantı sayısı'
      });
    }
  });

  // Port tarama tespiti
  Object.entries(portCounts).forEach(([port, count]) => {
    if (count > 50) {
      analysis.portScanAttempts.push({
        port: port,
        count: count,
        description: 'Port tarama girişimi'
      });
    }
  });

  // DDoS göstergeleri
  Object.entries(ipCounts).forEach(([ip, count]) => {
    if (count > 1000) {
      analysis.ddosIndicators.push({
        ip: ip,
        count: count,
        description: 'DDoS saldırısı göstergesi'
      });
    }
  });

  analysis.summary = {
    totalConnections: Object.keys(connectionCounts).length,
    uniqueIPs: Object.keys(ipCounts).length,
    uniquePorts: Object.keys(portCounts).length,
    suspiciousConnectionsCount: analysis.suspiciousConnections.length,
    portScanAttemptsCount: analysis.portScanAttempts.length,
    ddosIndicatorsCount: analysis.ddosIndicators.length
  };

  return analysis;
}

// Güvenlik durumu raporu
router.get('/status', (req, res) => {
  const securityStatus = {
    timestamp: new Date().toISOString(),
    overallStatus: 'SECURE',
    activeThreats: 0,
    blockedAttacks: 0,
    systemHealth: 'GOOD',
    recommendations: []
  };

  // Mock veri - gerçek uygulamada veritabanından alınacak
  const mockThreats = Math.floor(Math.random() * 5);
  const mockBlocked = Math.floor(Math.random() * 20);

  securityStatus.activeThreats = mockThreats;
  securityStatus.blockedAttacks = mockBlocked;

  if (mockThreats > 3) {
    securityStatus.overallStatus = 'WARNING';
    securityStatus.recommendations.push('Aktif tehditler tespit edildi');
  }

  if (mockBlocked > 15) {
    securityStatus.recommendations.push('Yüksek sayıda saldırı engellendi');
  }

  res.json(securityStatus);
});

module.exports = router; 