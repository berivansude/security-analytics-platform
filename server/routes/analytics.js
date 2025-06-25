const express = require('express');
const router = express.Router();

// Veri madenciliği analizi
router.post('/data-mining', (req, res) => {
  const { data, analysisType } = req.body;

  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ error: 'Geçerli veri gerekli' });
  }

  let analysis;
  switch (analysisType) {
    case 'pattern':
      analysis = performPatternAnalysis(data);
      break;
    case 'clustering':
      analysis = performClusteringAnalysis(data);
      break;
    case 'anomaly':
      analysis = performAnomalyDetection(data);
      break;
    case 'trend':
      analysis = performTrendAnalysis(data);
      break;
    default:
      analysis = performComprehensiveAnalysis(data);
  }

  res.json({
    message: 'Veri madenciliği analizi tamamlandı',
    analysisType: analysisType,
    analysis: analysis
  });
});

// Pattern analizi
function performPatternAnalysis(data) {
  const patterns = {
    frequentItems: {},
    sequences: [],
    correlations: {},
    summary: {}
  };

  // Sık kullanılan öğeler
  data.forEach(item => {
    if (typeof item === 'object') {
      Object.keys(item).forEach(key => {
        const value = item[key];
        if (!patterns.frequentItems[key]) {
          patterns.frequentItems[key] = {};
        }
        patterns.frequentItems[key][value] = (patterns.frequentItems[key][value] || 0) + 1;
      });
    }
  });

  // En sık kullanılan değerleri bul
  Object.keys(patterns.frequentItems).forEach(key => {
    const values = patterns.frequentItems[key];
    const sortedValues = Object.entries(values)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
    patterns.frequentItems[key] = sortedValues;
  });

  // Korelasyon analizi
  if (data.length > 1) {
    const numericFields = Object.keys(data[0]).filter(key => 
      typeof data[0][key] === 'number'
    );

    numericFields.forEach(field1 => {
      numericFields.forEach(field2 => {
        if (field1 !== field2) {
          const correlation = calculateCorrelation(data, field1, field2);
          if (Math.abs(correlation) > 0.5) {
            patterns.correlations[`${field1}-${field2}`] = correlation;
          }
        }
      });
    });
  }

  patterns.summary = {
    totalRecords: data.length,
    uniqueFields: Object.keys(patterns.frequentItems).length,
    strongCorrelations: Object.keys(patterns.correlations).length
  };

  return patterns;
}

// Kümeleme analizi
function performClusteringAnalysis(data) {
  const clusters = {
    groups: [],
    centroids: [],
    summary: {}
  };

  // Basit k-means benzeri kümeleme
  if (data.length > 0 && typeof data[0] === 'object') {
    const numericFields = Object.keys(data[0]).filter(key => 
      typeof data[0][key] === 'number'
    );

    if (numericFields.length >= 2) {
      // 2D kümeleme için ilk iki sayısal alanı kullan
      const field1 = numericFields[0];
      const field2 = numericFields[1];

      // Basit kümeleme (3 küme)
      const k = 3;
      const centroids = [];
      
      // Başlangıç merkezleri
      for (let i = 0; i < k; i++) {
        const randomIndex = Math.floor(Math.random() * data.length);
        centroids.push({
          x: data[randomIndex][field1],
          y: data[randomIndex][field2],
          clusterId: i
        });
      }

      // Veri noktalarını kümelere ata
      data.forEach((point, index) => {
        let minDistance = Infinity;
        let closestCluster = 0;

        centroids.forEach((centroid, clusterId) => {
          const distance = Math.sqrt(
            Math.pow(point[field1] - centroid.x, 2) + 
            Math.pow(point[field2] - centroid.y, 2)
          );
          if (distance < minDistance) {
            minDistance = distance;
            closestCluster = clusterId;
          }
        });

        clusters.groups.push({
          pointIndex: index,
          clusterId: closestCluster,
          distance: minDistance
        });
      });

      clusters.centroids = centroids;
    }
  }

  clusters.summary = {
    totalRecords: data.length,
    numberOfClusters: clusters.centroids.length,
    clusteredRecords: clusters.groups.length
  };

  return clusters;
}

// Anomali tespiti
function performAnomalyDetection(data) {
  const anomalies = {
    outliers: [],
    unusualPatterns: [],
    summary: {}
  };

  if (data.length > 0 && typeof data[0] === 'object') {
    const numericFields = Object.keys(data[0]).filter(key => 
      typeof data[0][key] === 'number'
    );

    numericFields.forEach(field => {
      const values = data.map(item => item[field]).filter(val => !isNaN(val));
      
      if (values.length > 0) {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);

        // 3-sigma kuralı ile anomali tespiti
        values.forEach((value, index) => {
          const zScore = Math.abs((value - mean) / stdDev);
          if (zScore > 3) {
            anomalies.outliers.push({
              field: field,
              value: value,
              index: index,
              zScore: zScore,
              description: `${field} alanında anormal değer: ${value}`
            });
          }
        });
      }
    });
  }

  anomalies.summary = {
    totalRecords: data.length,
    outliersFound: anomalies.outliers.length,
    fieldsAnalyzed: numericFields ? numericFields.length : 0
  };

  return anomalies;
}

// Trend analizi
function performTrendAnalysis(data) {
  const trends = {
    timeSeries: {},
    seasonalPatterns: [],
    summary: {}
  };

  // Zaman serisi analizi
  if (data.length > 0 && typeof data[0] === 'object') {
    const timeFields = Object.keys(data[0]).filter(key => 
      key.toLowerCase().includes('time') || 
      key.toLowerCase().includes('date') ||
      key.toLowerCase().includes('timestamp')
    );

    const numericFields = Object.keys(data[0]).filter(key => 
      typeof data[0][key] === 'number'
    );

    if (timeFields.length > 0 && numericFields.length > 0) {
      const timeField = timeFields[0];
      const valueField = numericFields[0];

      // Zaman serisi verisi oluştur
      const timeSeriesData = data
        .filter(item => item[timeField] && item[valueField])
        .sort((a, b) => new Date(a[timeField]) - new Date(b[timeField]));

      if (timeSeriesData.length > 0) {
        // Basit trend hesaplama
        const values = timeSeriesData.map(item => item[valueField]);
        const n = values.length;
        
        if (n > 1) {
          const xMean = (n - 1) / 2;
          const yMean = values.reduce((a, b) => a + b, 0) / n;
          
          let numerator = 0;
          let denominator = 0;
          
          for (let i = 0; i < n; i++) {
            numerator += (i - xMean) * (values[i] - yMean);
            denominator += Math.pow(i - xMean, 2);
          }
          
          const slope = denominator !== 0 ? numerator / denominator : 0;
          
          trends.timeSeries = {
            slope: slope,
            trend: slope > 0 ? 'INCREASING' : slope < 0 ? 'DECREASING' : 'STABLE',
            dataPoints: timeSeriesData.length,
            averageValue: yMean
          };
        }
      }
    }
  }

  trends.summary = {
    totalRecords: data.length,
    timeSeriesAnalyzed: Object.keys(trends.timeSeries).length > 0,
    seasonalPatternsFound: trends.seasonalPatterns.length
  };

  return trends;
}

// Kapsamlı analiz
function performComprehensiveAnalysis(data) {
  return {
    pattern: performPatternAnalysis(data),
    clustering: performClusteringAnalysis(data),
    anomaly: performAnomalyDetection(data),
    trend: performTrendAnalysis(data),
    summary: {
      totalRecords: data.length,
      analysisTypes: ['pattern', 'clustering', 'anomaly', 'trend']
    }
  };
}

// Korelasyon hesaplama
function calculateCorrelation(data, field1, field2) {
  const values1 = data.map(item => item[field1]).filter(val => !isNaN(val));
  const values2 = data.map(item => item[field2]).filter(val => !isNaN(val));
  
  if (values1.length !== values2.length || values1.length === 0) {
    return 0;
  }

  const n = values1.length;
  const sum1 = values1.reduce((a, b) => a + b, 0);
  const sum2 = values2.reduce((a, b) => a + b, 0);
  const sum1Sq = values1.reduce((a, b) => a + b * b, 0);
  const sum2Sq = values2.reduce((a, b) => a + b * b, 0);
  const pSum = values1.reduce((a, b, i) => a + b * values2[i], 0);
  
  const num = pSum - (sum1 * sum2 / n);
  const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
  
  return den === 0 ? 0 : num / den;
}

// Gerçek zamanlı analitik
router.get('/realtime', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const interval = setInterval(() => {
    const analyticsData = {
      timestamp: new Date().toISOString(),
      metrics: {
        activeUsers: Math.floor(Math.random() * 100) + 50,
        requestsPerMinute: Math.floor(Math.random() * 1000) + 500,
        errorRate: Math.random() * 0.05,
        responseTime: Math.random() * 200 + 50
      },
      alerts: []
    };

    // Anomali tespiti
    if (analyticsData.metrics.errorRate > 0.03) {
      analyticsData.alerts.push({
        type: 'HIGH_ERROR_RATE',
        message: 'Yüksek hata oranı tespit edildi',
        severity: 'WARNING'
      });
    }

    res.write(`data: ${JSON.stringify(analyticsData)}\n\n`);
  }, 5000);

  req.on('close', () => {
    clearInterval(interval);
  });
});

// Analitik dashboard verileri
router.get('/dashboard', (req, res) => {
  const dashboardData = {
    overview: {
      totalLogs: 15420,
      securityIncidents: 23,
      dataProcessed: '2.5GB',
      uptime: '99.8%'
    },
    charts: {
      logTrends: generateMockChartData('logTrends'),
      securityEvents: generateMockChartData('securityEvents'),
      performanceMetrics: generateMockChartData('performanceMetrics')
    },
    topAlerts: [
      { id: 1, type: 'SECURITY', message: 'Şüpheli IP tespit edildi', severity: 'HIGH' },
      { id: 2, type: 'PERFORMANCE', message: 'Yüksek CPU kullanımı', severity: 'MEDIUM' },
      { id: 3, type: 'ERROR', message: 'Database bağlantı hatası', severity: 'LOW' }
    ]
  };

  res.json(dashboardData);
});

// Mock chart verisi oluşturma
function generateMockChartData(type) {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < 24; i++) {
    const time = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
    let value;
    
    switch (type) {
      case 'logTrends':
        value = Math.floor(Math.random() * 1000) + 500;
        break;
      case 'securityEvents':
        value = Math.floor(Math.random() * 10) + 1;
        break;
      case 'performanceMetrics':
        value = Math.random() * 100;
        break;
      default:
        value = Math.floor(Math.random() * 100);
    }
    
    data.push({
      time: time.toISOString(),
      value: value
    });
  }
  
  return data;
}

module.exports = router; 