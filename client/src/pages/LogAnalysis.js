import React, { useState, useRef } from 'react';
import { Upload, FileText, Search, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';

const LogAnalysis = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [logs, setLogs] = useState([]);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('logFile', file);

    try {
      const response = await axios.post('/api/logs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadedFile(file);
      setAnalysis(response.data.analysis);
      toast.success('Log dosyası başarıyla yüklendi ve analiz edildi');
    } catch (error) {
      console.error('Log yükleme hatası:', error);
      toast.error('Log dosyası yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'text/plain': ['.txt']
    },
    multiple: false
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(`/api/logs/search?query=${encodeURIComponent(searchQuery)}`);
      setLogs(response.data.results);
    } catch (error) {
      console.error('Arama hatası:', error);
      toast.error('Arama sırasında hata oluştu');
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'ERROR': return 'text-red-600 bg-red-100';
      case 'WARNING': return 'text-yellow-600 bg-yellow-100';
      case 'INFO': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Log Analizi</h1>
      </div>

      {/* File Upload */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Log Dosyası Yükle</h2>
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          {isDragActive ? (
            <p className="text-primary-600">Dosyayı buraya bırakın...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                Dosyayı sürükleyip bırakın veya tıklayarak seçin
              </p>
              <p className="text-sm text-gray-500">
                Desteklenen formatlar: CSV, JSON, TXT
              </p>
            </div>
          )}
        </div>

        {loading && (
          <div className="mt-4 flex justify-center">
            <div className="loading-spinner"></div>
          </div>
        )}

        {uploadedFile && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800">
                {uploadedFile.name} başarıyla yüklendi
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analiz Özeti</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Toplam Kayıt:</span>
                <span className="font-semibold">{analysis.totalEntries}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hata Sayısı:</span>
                <span className="font-semibold text-red-600">{analysis.errorCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Uyarı Sayısı:</span>
                <span className="font-semibold text-yellow-600">{analysis.warningCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bilgi Sayısı:</span>
                <span className="font-semibold text-blue-600">{analysis.infoCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Benzersiz IP:</span>
                <span className="font-semibold">{analysis.uniqueIPs.length}</span>
              </div>
            </div>
          </div>

          {/* Threats */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tespit Edilen Tehditler</h3>
            {analysis.suspiciousPatterns.length > 0 ? (
              <div className="space-y-2">
                {analysis.suspiciousPatterns.slice(0, 5).map((pattern, index) => (
                  <div key={index} className="flex items-center p-2 bg-red-50 rounded">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                    <span className="text-sm text-red-800">{pattern.pattern}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Şüpheli pattern tespit edilmedi</p>
            )}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Log Arama</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Log mesajında ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
          >
            <Search className="w-4 h-4 mr-2" />
            Ara
          </button>
        </div>

        {/* Search Results */}
        {logs.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Arama Sonuçları</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{log.timestamp}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(log.level)}`}>
                      {log.level}
                    </span>
                  </div>
                  <p className="text-gray-900 mt-1">{log.message}</p>
                  {log.source && (
                    <p className="text-xs text-gray-500 mt-1">Kaynak: {log.source}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Real-time Log Stream */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Gerçek Zamanlı Log İzleme</h2>
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
          <div className="flex items-center mb-2">
            <Activity className="w-4 h-4 mr-2 animate-pulse" />
            <span>Log akışı başlatılıyor...</span>
          </div>
          <div className="space-y-1">
            <div>[INFO] Sistem başlatıldı - {new Date().toLocaleTimeString()}</div>
            <div>[INFO] Veritabanı bağlantısı kuruldu - {new Date().toLocaleTimeString()}</div>
            <div>[WARNING] Yüksek CPU kullanımı tespit edildi - {new Date().toLocaleTimeString()}</div>
            <div>[ERROR] Dosya okuma hatası - {new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogAnalysis; 