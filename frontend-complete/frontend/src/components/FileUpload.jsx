import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { parseCSV, parseJSON, validateDeliveryData } from '../utils/helpers';

/**
 * FileUpload Component
 * Handles file upload, parsing, and validation for CSV/JSON delivery data
 * 
 * @param {Function} onDataLoaded - Callback when data is successfully loaded
 * @param {Function} onError - Callback when error occurs
 */
const FileUpload = ({ onDataLoaded, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  /**
   * Handle file selection or drop
   */
  const handleFile = async (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['text/csv', 'application/json', 'application/vnd.ms-excel'];
    const validExtensions = ['.csv', '.json'];
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));

    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      const errorMsg = 'Invalid file type. Please upload a CSV or JSON file.';
      setUploadStatus('error');
      onError && onError(errorMsg);
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);
    setUploadStatus(null);

    try {
      let data;

      // Parse based on file type
      if (fileExtension === '.csv' || file.type === 'text/csv' || file.type === 'application/vnd.ms-excel') {
        data = await parseCSV(file);
      } else if (fileExtension === '.json' || file.type === 'application/json') {
        data = await parseJSON(file);
      }

      // Validate parsed data
      const validation = validateDeliveryData(data);

      if (!validation.isValid) {
        setUploadStatus('error');
        onError && onError(`Validation failed: ${validation.errors.join(', ')}`);
        setIsProcessing(false);
        return;
      }

      // Success
      setUploadStatus('success');
      onDataLoaded && onDataLoaded(data);
      setIsProcessing(false);

    } catch (error) {
      setUploadStatus('error');
      onError && onError(error.message);
      setIsProcessing(false);
    }
  };

  /**
   * Handle file input change
   */
  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  /**
   * Handle drag over event
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  /**
   * Handle drag leave event
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  /**
   * Handle drop event
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  /**
   * Trigger file input click
   */
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.json"
        onChange={handleFileInputChange}
        className="hidden"
        aria-label="File upload input"
      />

      {/* Drop zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragging 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400 bg-white'
          }
          ${isProcessing ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        {/* Upload icon and text */}
        <div className="flex flex-col items-center justify-center space-y-4">
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="text-sm text-gray-600">Processing file...</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-700">
                  Drop your file here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports CSV and JSON formats
                </p>
              </div>
            </>
          )}
        </div>

        {/* File info */}
        {fileName && !isProcessing && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 font-medium">{fileName}</span>
          </div>
        )}

        {/* Status indicator */}
        {uploadStatus && !isProcessing && (
          <div className={`
            mt-4 flex items-center justify-center space-x-2 text-sm
            ${uploadStatus === 'success' ? 'text-green-600' : 'text-red-600'}
          `}>
            {uploadStatus === 'success' ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">File uploaded successfully!</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Upload failed</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* File format help text */}
      <div className="mt-3 text-xs text-gray-500">
        <p className="font-medium mb-1">Expected file format:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Required fields: id, customer_name, lat, lng, address</li>
          <li>Optional fields: delivery_window, priority, notes</li>
          <li>Coordinates should be valid (lat: -90 to 90, lng: -180 to 180)</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
