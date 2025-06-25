const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.mimetype === 'text/plain' || file.mimetype === 'application/json') {
      cb(null, true);
    } else {
      cb(new Error('Sadece CSV, TXT ve JSON dosyaları kabul edilir'), false);
    }
  }
});

// Log dosyası yükleme
router.post('/upload', upload.single('logFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Dosya yüklenmedi' });
    }

    const filePath = req.file.path;
    const fileType = path.extname(req.file.originalname).toLowerCase();
    let logs = [];

    if (fileType === '.csv') {
      logs = await parseCSV(filePath);
    } else if (fileType === '.json') {
      logs = await parseJSON(filePath);
    } else {
      logs = await parseTXT(filePath);
    }

    // Log analizi yap
    const analysis = analyzeLogs(logs);

    res.json({
      message: 'Log dosyası başarıyla yüklendi ve analiz edildi',
      filename: req.file.originalname,
      totalLogs: logs.length,
      analysis: analysis
    });

  } catch (error) {
    console.error('Log yükleme hatası:', error);
    res.status(500).json({ error: 'Log dosyası işlenirken hata oluştu' });
  }
});

// Log analizi fonksiyonları
async function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

async function parseJSON(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

async function parseTXT(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  return data.split('\n').filter(line => line.trim()).map(line => ({ message: line }));
}

function analyzeLogs(logs) {
  const analysis = {
    totalEntries: logs.length,
    errorCount: 0,
    warningCount: 0,
    infoCount: 0,
    uniqueIPs: new Set(),
    timeDistribution: {},
    suspiciousPatterns: [],
    topErrors: {}
  };

  logs.forEach(log => {
    const logMessage = JSON.stringify(log).toLowerCase();
    
    // Log seviyesi analizi
    if (logMessage.includes('error') || logMessage.includes('hata')) {
      analysis.errorCount++;
    } else if (logMessage.includes('warning') || logMessage.includes('uyarı')) {
      analysis.warningCount++;
    } else {
      analysis.infoCount++;
    }

    // IP adresi çıkarma
    const ipMatch = logMessage.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/);
    if (ipMatch) {
      analysis.uniqueIPs.add(ipMatch[0]);
    }

    // Zaman analizi
    const timeMatch = logMessage.match(/\d{4}-\d{2}-\d{2}|\d{2}:\d{2}:\d{2}/);
    if (timeMatch) {
      const timeKey = timeMatch[0].substring(0, 10); // YYYY-MM-DD
      analysis.timeDistribution[timeKey] = (analysis.timeDistribution[timeKey] || 0) + 1;
    }

    // Şüpheli pattern'lar
    const suspiciousPatterns = [
      'sql injection', 'xss', 'csrf', 'brute force', 'ddos',
      'unauthorized access', 'failed login', 'suspicious activity'
    ];

    suspiciousPatterns.forEach(pattern => {
      if (logMessage.includes(pattern)) {
        analysis.suspiciousPatterns.push({
          pattern: pattern,
          log: log
        });
      }
    });
  });

  analysis.uniqueIPs = Array.from(analysis.uniqueIPs);
  
  return analysis;
}

// Gerçek zamanlı log izleme
router.get('/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const interval = setInterval(() => {
    const mockLog = {
      timestamp: new Date().toISOString(),
      level: ['INFO', 'WARNING', 'ERROR'][Math.floor(Math.random() * 3)],
      message: `Mock log entry ${Date.now()}`,
      source: 'system'
    };

    res.write(`data: ${JSON.stringify(mockLog)}\n\n`);
  }, 2000);

  req.on('close', () => {
    clearInterval(interval);
  });
});

// Log filtreleme ve arama
router.get('/search', (req, res) => {
  const { query, level, startDate, endDate, limit = 100 } = req.query;
  
  // Burada gerçek bir veritabanı sorgusu yapılacak
  const mockResults = [
    {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message: 'Database connection failed',
      source: 'database'
    }
  ];

  res.json({
    results: mockResults,
    total: mockResults.length,
    query: query
  });
});

module.exports = router; 