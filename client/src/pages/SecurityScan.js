import React, { useState } from 'react';
import { Shield, Upload, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';

const SecurityScan = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/security/scan', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadedFile(file);
      setAnalysis(response.data.analysis);
      toast.success('Güvenlik analizi tamamlandı');
    } catch (error) {
      console.error('Güvenlik analizi hatası:', error);
      toast.error('Güvenlik analizi sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false
  });

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'HIGH': return 'text-red-600 bg-red-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'LOW': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Güvenlik Taraması</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Dosya Güvenlik Analizi</h2>
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
          }`}
        >
          <input {...getInputProps()} />
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          {isDragActive ? (
            <p className="text-primary-600">Dosyayı buraya bırakın...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                Analiz edilecek dosyayı sürükleyip bırakın
              </p>
              <p className="text-sm text-gray-500">
                Tüm dosya türleri desteklenir
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
                {uploadedFile.name} analiz edildi
              </span>
            </div>
          </div>
        )}
      </div>

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analiz Sonuçları</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Dosya Adı:</span>
                <span className="font-semibold">{analysis.fileName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dosya Boyutu:</span>
                <span className="font-semibold">{(analysis.fileSize / 1024).toFixed(2)} KB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dosya Türü:</span>
                <span className="font-semibold">{analysis.fileType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Risk Seviyesi:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(analysis.riskLevel)}`}>
                  {analysis.riskLevel}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tespit Edilen Tehditler</h3>
            {analysis.threats.length > 0 ? (
              <div className="space-y-2">
                {analysis.threats.map((threat, index) => (
                  <div key={index} className="flex items-center p-2 bg-red-50 rounded">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                    <div>
                      <span className="text-sm font-medium text-red-800">{threat.name}</span>
                      <p className="text-xs text-red-600">{threat.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Tehdit tespit edilmedi</p>
            )}
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Güvenlik Durumu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
              <div>
                <p className="font-semibold text-green-800">Sistem Durumu</p>
                <p className="text-sm text-green-600">Güvenli</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mr-2" />
              <div>
                <p className="font-semibold text-yellow-800">Aktif Tehditler</p>
                <p className="text-sm text-yellow-600">2 tespit edildi</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-6 h-6 text-blue-600 mr-2" />
              <div>
                <p className="font-semibold text-blue-800">Engellenen Saldırılar</p>
                <p className="text-sm text-blue-600">15 saldırı</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityScan; 