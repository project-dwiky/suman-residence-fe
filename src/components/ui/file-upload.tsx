"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  label?: string;
  onFileUpload: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
  onFileRemove?: () => void;
  currentFileUrl?: string;
  currentFileName?: string;
  accept?: string;
  maxSize?: number; // in MB
  disabled?: boolean;
}

export function FileUpload({
  label = "Upload File",
  onFileUpload,
  onFileRemove,
  currentFileUrl,
  currentFileName,
  accept = ".pdf,.jpg,.jpeg,.png,.docx",
  maxSize = 10,
  disabled = false
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File terlalu besar. Maksimal ${maxSize}MB.`);
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Format file tidak didukung. Gunakan PDF, JPG, PNG, atau DOCX.');
      return;
    }

    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const result = await onFileUpload(file);
      
      if (result.success) {
        toast.success('File berhasil diupload!');
      } else {
        toast.error(result.error || 'Gagal upload file');
      }
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error(error.message || 'Gagal upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDownload = () => {
    if (currentFileUrl) {
      window.open(currentFileUrl, '_blank');
    }
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      {/* Current file display */}
      {currentFileUrl && currentFileName && (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">{currentFileName}</span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownload}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <Download className="w-3 h-3" />
            </Button>
            {onFileRemove && (
              <Button
                size="sm"
                variant="outline"
                onClick={onFileRemove}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Upload area */}
      {!currentFileUrl && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop file here, or click to select
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Supported: PDF, JPG, PNG, DOCX (Max: {maxSize}MB)
          </p>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('file-input')?.click()}
            disabled={disabled || uploading}
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Uploading...' : 'Choose File'}
          </Button>
          
          <Input
            id="file-input"
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="hidden"
            disabled={disabled || uploading}
          />
        </div>
      )}
    </div>
  );
}
