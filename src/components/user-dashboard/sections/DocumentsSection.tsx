"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Document, DocumentType, RentalData } from '../types';

interface DocumentsSectionProps {
  rentalData: RentalData;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ rentalData }) => {
  const [downloadStatus, setDownloadStatus] = useState<Record<string, 'idle' | 'loading' | 'success' | 'error'>>({});
  
  // Document type display names and icons - menggunakan ikon seragam untuk semua jenis dokumen
  const documentTypeInfo = {
    [DocumentType.BOOKING_SLIP]: {
      name: 'Bukti Booking',
      icon: (
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      ),
    },
    [DocumentType.RECEIPT]: {
      name: 'Kuitansi Pembayaran',
      icon: (
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      ),
    },
    [DocumentType.SOP]: {
      name: 'Peraturan & Ketentuan',
      icon: (
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      ),
    },
    [DocumentType.INVOICE]: {
      name: 'Faktur Pembayaran',
      icon: (
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      ),
    },
  };

  // Handle download/view document
  const handleDownload = async (document: Document) => {
    try {
      setDownloadStatus(prev => ({ ...prev, [document.id]: 'loading' }));
      
      if (!document.fileUrl) {
        throw new Error('Document URL not available');
      }

      // Fetch the file as blob to avoid popup blockers
      const response = await fetch(document.fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.status}`);
      }

      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const blobUrl = URL.createObjectURL(blob);
      
      // Create a temporary anchor element for download
      const link = window.document.createElement('a');
      link.href = blobUrl;
      
      // Set the download filename
      const fileName = document.fileName || `document-${document.id}.${getFileExtension(blob.type)}`;
      link.download = fileName;
      
      // Append to body (required for Firefox)
      window.document.body.appendChild(link);
      
      // Trigger download
      link.click();
      
      // Clean up
      window.document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      
      setDownloadStatus(prev => ({ ...prev, [document.id]: 'success' }));
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setDownloadStatus(prev => ({ ...prev, [document.id]: 'idle' }));
      }, 2000);
    } catch (error) {
      setDownloadStatus(prev => ({ ...prev, [document.id]: 'error' }));
      console.error("Error downloading document:", error);
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setDownloadStatus(prev => ({ ...prev, [document.id]: 'idle' }));
      }, 2000);
    }
  };

  // Helper function to get file extension from MIME type
  const getFileExtension = (mimeType: string): string => {
    const mimeToExt: Record<string, string> = {
      'application/pdf': 'pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/msword': 'doc',
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'text/plain': 'txt',
    };
    return mimeToExt[mimeType] || 'file';
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.section 
      className="md:mt-4 pt-2 p-5 bg-background rounded-lg shadow-sm border border-border/40"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      viewport={{ once: true }}
    >
      <div>
        <motion.h2 
          className="text-lg font-semibold mb-3"
          variants={itemVariants}
        >
          Dokumen
        </motion.h2>

        {(!rentalData.documents || !Array.isArray(rentalData.documents) || rentalData.documents.length === 0) ? (
          <motion.div 
            className="text-center py-8"
            variants={itemVariants}
          >
            <div className="mx-auto w-16 h-16 text-gray-300">
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <p className="mt-2 text-gray-500">Belum ada dokumen tersedia</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {rentalData.documents.map((document, index) => (
              <motion.div 
                key={document.id}
                className="py-3 flex items-center justify-between"
                variants={itemVariants}
                whileHover={{ y: -1 }}
                transition={{ type: 'tween', duration: 0.2 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-1">
                    {documentTypeInfo[document.type].icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{documentTypeInfo[document.type].name}</h3>
                    <p className="text-sm text-gray-400">
                      {new Date(document.createdAt).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(document)}
                  className={`p-2 rounded-full flex items-center justify-center transition-colors
                    ${downloadStatus[document.id] === 'loading' 
                      ? 'bg-gray-200 text-gray-500 cursor-wait' 
                      : downloadStatus[document.id] === 'success'
                        ? 'bg-green-500 text-white'
                        : downloadStatus[document.id] === 'error'
                          ? 'bg-red-500 text-white'
                          : 'bg-primary text-white hover:bg-primary/90'
                    }
                  `}
                  disabled={downloadStatus[document.id] === 'loading'}
                >
                  {downloadStatus[document.id] === 'loading' ? (
                    <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : downloadStatus[document.id] === 'success' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : downloadStatus[document.id] === 'error' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default DocumentsSection;
