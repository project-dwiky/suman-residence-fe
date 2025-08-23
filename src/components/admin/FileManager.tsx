"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  RefreshCw,
  Filter,
  Calendar
} from 'lucide-react';
import { 
  FixedCostService, 
  FixedCost 
} from '@/services/fixed-cost.service';
import { 
  VariableCostService, 
  VariableCost 
} from '@/services/variable-cost.service';
import { 
  SupportCostService, 
  SupportCost 
} from '@/services/support-cost.service';
import { toast } from 'sonner';

interface FileRecord {
  id: string;
  type: 'Fixed Cost' | 'Variable Cost' | 'Support Cost';
  description: string;
  fileName: string;
  fileUrl: string;
  amount: number;
  date: string;
  status: string;
  createdAt: string;
}

export function FileManager() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    fetchAllFiles();
  }, []);

  useEffect(() => {
    filterFiles();
  }, [files, searchQuery, typeFilter]);

  const fetchAllFiles = async () => {
    try {
      setLoading(true);
      
      // Fetch all costs in parallel
      const [fixedResult, variableResult, supportResult] = await Promise.all([
        FixedCostService.getAllFixedCosts(),
        VariableCostService.getAllVariableCosts(),
        SupportCostService.getAllSupportCosts()
      ]);

      const fileRecords: FileRecord[] = [];

      // Process Fixed Costs
      if (fixedResult.success) {
        fixedResult.fixedCosts?.forEach((cost: FixedCost) => {
          if (cost.receiptFile) {
            fileRecords.push({
              id: cost.id,
              type: 'Fixed Cost',
              description: cost.caption,
              fileName: cost.receiptFile.fileName,
              fileUrl: cost.receiptFile.url,
              amount: cost.harga,
              date: cost.tanggal,
              status: cost.status,
              createdAt: typeof cost.createdAt === 'string' ? cost.createdAt : 
                        cost.createdAt?.toDate ? cost.createdAt.toDate().toISOString() :
                        new Date(cost.createdAt).toISOString()
            });
          }
        });
      }

      // Process Variable Costs
      if (variableResult.success) {
        variableResult.variableCosts?.forEach((cost: VariableCost) => {
          if (cost.receiptFile) {
            fileRecords.push({
              id: cost.id,
              type: 'Variable Cost',
              description: cost.caption,
              fileName: cost.receiptFile.fileName,
              fileUrl: cost.receiptFile.url,
              amount: cost.harga,
              date: cost.tanggal,
              status: cost.status,
              createdAt: typeof cost.createdAt === 'string' ? cost.createdAt : 
                        cost.createdAt?.toDate ? cost.createdAt.toDate().toISOString() :
                        new Date(cost.createdAt).toISOString()
            });
          }
        });
      }

      // Process Support Costs
      if (supportResult.success) {
        supportResult.supportCosts?.forEach((cost: SupportCost) => {
          if (cost.receiptFile) {
            fileRecords.push({
              id: cost.id,
              type: 'Support Cost',
              description: cost.caption,
              fileName: cost.receiptFile.fileName,
              fileUrl: cost.receiptFile.url,
              amount: cost.harga,
              date: cost.tanggal,
              status: cost.status,
              createdAt: typeof cost.createdAt === 'string' ? cost.createdAt : 
                        cost.createdAt?.toDate ? cost.createdAt.toDate().toISOString() :
                        new Date(cost.createdAt).toISOString()
            });
          }
        });
      }

      // Sort by creation date (newest first)
      fileRecords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setFiles(fileRecords);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to fetch uploaded files');
    } finally {
      setLoading(false);
    }
  };

  const filterFiles = () => {
    let filtered = files;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(file => 
        file.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(file => file.type === typeFilter);
    }

    setFilteredFiles(filtered);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'Overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Fixed Cost':
        return <Badge className="bg-blue-100 text-blue-800">Fixed</Badge>;
      case 'Variable Cost':
        return <Badge className="bg-purple-100 text-purple-800">Variable</Badge>;
      case 'Support Cost':
        return <Badge className="bg-orange-100 text-orange-800">Support</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{type}</Badge>;
    }
  };

  const handleViewFile = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  const handleDownloadFile = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      
      toast.success('File downloaded successfully');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const typeOptions = ['all', 'Fixed Cost', 'Variable Cost', 'Support Cost'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <span>Uploaded Receipt Files</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAllFiles}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            {typeOptions.map((type) => (
              <Button
                key={type}
                variant={typeFilter === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTypeFilter(type)}
              >
                <Filter className="h-4 w-4 mr-1" />
                {type === 'all' ? 'All' : type}
                {type !== 'all' && (
                  <span className="ml-1 text-xs">
                    ({files.filter(f => f.type === type).length})
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Files Table */}
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading files...</span>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No files found</p>
            <p className="text-sm">
              {files.length === 0 
                ? 'No receipt files have been uploaded yet' 
                : searchQuery || typeFilter !== 'all'
                  ? 'No files match your current filters'
                  : 'No files available'
              }
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={`${file.type}-${file.id}`}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{file.fileName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getTypeBadge(file.type)}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{file.description}</div>
                    <div className="text-xs text-gray-500">
                      Uploaded: {formatDate(file.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(file.amount)}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(file.date)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(file.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewFile(file.fileUrl)}
                        className="h-8 px-2"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadFile(file.fileUrl, file.fileName)}
                        className="h-8 px-2"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Summary */}
        {!loading && filteredFiles.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span>
                Showing {filteredFiles.length} of {files.length} files
              </span>
              <span className="text-gray-500">
                Total: {formatCurrency(filteredFiles.reduce((sum, file) => sum + file.amount, 0))}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
