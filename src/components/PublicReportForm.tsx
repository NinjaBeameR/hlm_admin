import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Camera } from 'lucide-react';
import { submitReport } from '../utils/supabase';
import type { ReportFormData } from '../types';

const PublicReportForm: React.FC = () => {
  const [formData, setFormData] = useState<ReportFormData>({
    type: 'bug',
    description: '',
    app_version: '',
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      setScreenshot(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      alert('Please provide a description');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    const submitData = {
      ...formData,
      screenshot: screenshot || undefined,
    };

    const result = await submitReport(submitData);

    if (result.error) {
      setSubmitStatus('error');
      setErrorMessage(result.error.message);
    } else {
      setSubmitStatus('success');
      // Reset form
      setFormData({
        type: 'bug',
        description: '',
        app_version: '',
      });
      setScreenshot(null);
      // Reset file input
      const fileInput = document.getElementById('screenshot') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }

    setIsSubmitting(false);
  };

  const resetStatus = () => {
    setSubmitStatus('idle');
    setErrorMessage('');
  };

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {formData.type === 'bug' ? 'Bug Report' : 'Suggestion'} Submitted!
            </h2>
            <p className="text-gray-600 mb-8">
              Thank you for your feedback. We'll review it soon.
            </p>
            <button
              onClick={resetStatus}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-colors duration-200"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 text-center">Report an Issue</h1>
          <p className="text-gray-600 text-center mt-2">Help us improve by sharing your feedback</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-md mx-auto p-4 pb-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 mt-6 space-y-6">
          
          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Report Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-3">
              What would you like to report?
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white"
            >
              <option value="bug">🐛 Bug Report</option>
              <option value="suggestion">💡 Suggestion</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-3">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={
                formData.type === 'bug' 
                  ? "Describe the bug you encountered. What happened? What were you trying to do?"
                  : "Share your suggestion. How can we improve the app?"
              }
              rows={5}
              className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
              required
            />
          </div>

          {/* App Version */}
          {formData.type === 'bug' && (
            <div>
              <label htmlFor="app_version" className="block text-sm font-semibold text-gray-700 mb-3">
                App Version (Optional)
              </label>
              <input
                type="text"
                id="app_version"
                name="app_version"
                value={formData.app_version}
                onChange={handleInputChange}
                placeholder="e.g., 1.2.3"
                className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            </div>
          )}

          {/* Screenshot Upload */}
          <div>
            <label htmlFor="screenshot" className="block text-sm font-semibold text-gray-700 mb-3">
              Screenshot (Optional)
            </label>
            <div className="relative">
              <input
                type="file"
                id="screenshot"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="screenshot"
                className="w-full flex items-center justify-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200"
              >
                <div className="text-center">
                  {screenshot ? (
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                      <span className="text-green-700 font-medium">{screenshot.name}</span>
                    </div>
                  ) : (
                    <div>
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-gray-600 font-medium">Add Screenshot</span>
                      <p className="text-xs text-gray-500 mt-1">Max 5MB, image files only</p>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !formData.description.trim()}
            className="w-full bg-blue-600 text-white py-5 rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                Submitting...
              </div>
            ) : (
              <div className="flex items-center">
                <Send className="w-5 h-5 mr-3" />
                Submit {formData.type === 'bug' ? 'Bug Report' : 'Suggestion'}
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublicReportForm;
