import React, { useState } from 'react';
import { BarChart3, Upload, Database, TrendingUp, AlertTriangle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import toast from 'react-hot-toast';

const DataMining = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState('comprehensive');

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    
    try {
      // Dosyayı oku
      const text = await file.text();
      let data;
      
      try {
        data = JSON.parse(text);
      } catch {
        // CSV formatında parse et
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        data = lines.slice(1).map(line => {
          const values = line.split(',');
          const obj = {};
          headers.forEach((header, index) => {
            obj[header.trim()] = values[index]?.trim() || '';
          });
          return obj;
        });
      }

      const response = await axios.post('/api/analytics/data-mining', {
        data: data,
        analysisType: analysisType
      });

      setUploadedFile(file);
      setAnalysis(response.data.analysis);
      toast.success('Veri madenciliği analizi tamamlandı');
    } catch (error) {
      console.error('Veri madenciliği hatası:', error);
      toast.error('Veri madenciliği sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
      'text/csv': ['.csv']
    },
    multiple: false
  });

  const mockData = [
    { name: 'Pattern Analizi', value: 85 },
    { name: 'Kümeleme', value: 72 },
    { name: 'Anomali Tespiti', value: 68 },
    { name: 'Trend Analizi', value: 91 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Veri Madenciliği</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Veri Analizi</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Analiz Türü
          </label>
          <select
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="comprehensive">Kapsamlı Analiz</option>
            <option value="pattern">Pattern Analizi</option>
            <option value="clustering">Kümeleme</option>
            <option value="anomaly">Anomali Tespiti</option>
            <option value="trend">Trend Analizi</option>
          </select>
        </div>
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
          }`}
        >
          <input {...getInputProps()} />
          <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          {isDragActive ? (
            <p className="text-primary-600">Dosyayı buraya bırakın...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                JSON veya CSV dosyasını sürükleyip bırakın
              </p>
              <p className="text-sm text-gray-500">
                Desteklenen formatlar: JSON, CSV
              </p>
            </div>
          )}
        </div>

        {loading && (
          <div className="mt-4 flex justify-center">
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analiz Sonuçları</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tespit Edilen Anomaliler</h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                <div>
                  <p className="font-medium text-yellow-800">Anormal Veri Noktası</p>
                  <p className="text-sm text-yellow-600">Z-score: 3.2</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                <div>
                  <p className="font-medium text-red-800">Şüpheli Pattern</p>
                  <p className="text-sm text-red-600">Güven: %85</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Analytics */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Gerçek Zamanlı Analitik</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={Array.from({ length: 20 }, (_, i) => ({
            time: i,
            value: Math.floor(Math.random() * 100) + 50
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Veri İçgörüleri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
              <div>
                <p className="font-semibold text-blue-800">Trend Analizi</p>
                <p className="text-sm text-blue-600">Veri trendi yükseliyor</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <BarChart3 className="w-6 h-6 text-green-600 mr-2" />
              <div>
                <p className="font-semibold text-green-800">Pattern Tespiti</p>
                <p className="text-sm text-green-600">5 pattern bulundu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataMining; 