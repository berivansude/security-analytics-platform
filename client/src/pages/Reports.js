import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Settings, Plus } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [scheduledReports, setScheduledReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [reportForm, setReportForm] = useState({
    reportType: 'security',
    dateRange: 'last7days',
    format: 'json'
  });

  useEffect(() => {
    fetchReports();
    fetchScheduledReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('/api/reports/list');
      setReports(response.data.reports);
    } catch (error) {
      console.error('Raporlar alınamadı:', error);
      toast.error('Raporlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduledReports = async () => {
    try {
      const response = await axios.get('/api/reports/scheduled');
      setScheduledReports(response.data.scheduledReports);
    } catch (error) {
      console.error('Zamanlanmış raporlar alınamadı:', error);
    }
  };

  const generateReport = async () => {
    try {
      const response = await axios.post('/api/reports/generate', reportForm);
      toast.success('Rapor başarıyla oluşturuldu');
      setShowGenerateForm(false);
      fetchReports();
    } catch (error) {
      console.error('Rapor oluşturma hatası:', error);
      toast.error('Rapor oluşturulurken hata oluştu');
    }
  };

  const downloadReport = async (reportId) => {
    try {
      const response = await axios.get(`/api/reports/download/${reportId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${reportId}.${reportForm.format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Rapor indirildi');
    } catch (error) {
      console.error('Rapor indirme hatası:', error);
      toast.error('Rapor indirilirken hata oluştu');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Raporlar</h1>
        <button
          onClick={() => setShowGenerateForm(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Rapor
        </button>
      </div>

      {/* Generate Report Form */}
      {showGenerateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Yeni Rapor Oluştur</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rapor Türü
              </label>
              <select
                value={reportForm.reportType}
                onChange={(e) => setReportForm({...reportForm, reportType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="security">Güvenlik Raporu</option>
                <option value="performance">Performans Raporu</option>
                <option value="analytics">Analitik Raporu</option>
                <option value="comprehensive">Kapsamlı Rapor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tarih Aralığı
              </label>
              <select
                value={reportForm.dateRange}
                onChange={(e) => setReportForm({...reportForm, dateRange: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="last7days">Son 7 Gün</option>
                <option value="last30days">Son 30 Gün</option>
                <option value="last90days">Son 90 Gün</option>
                <option value="custom">Özel Aralık</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format
              </label>
              <select
                value={reportForm.format}
                onChange={(e) => setReportForm({...reportForm, format: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={generateReport}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Rapor Oluştur
            </button>
            <button
              onClick={() => setShowGenerateForm(false)}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Oluşturulan Raporlar</h2>
        <div className="space-y-3">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-gray-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{report.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString('tr-TR')} - {report.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">{formatFileSize(report.size)}</span>
                  <button
                    onClick={() => downloadReport(report.id)}
                    className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors flex items-center"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    İndir
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">Henüz rapor oluşturulmamış</p>
          )}
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Zamanlanmış Raporlar</h2>
        <div className="space-y-3">
          {scheduledReports.length > 0 ? (
            scheduledReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-blue-900">{report.reportType} Raporu</p>
                    <p className="text-sm text-blue-600">
                      {report.frequency} - Sonraki çalışma: {new Date(report.nextRun).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    report.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {report.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                  <button className="p-1 text-gray-600 hover:text-gray-800">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">Zamanlanmış rapor bulunmuyor</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports; 