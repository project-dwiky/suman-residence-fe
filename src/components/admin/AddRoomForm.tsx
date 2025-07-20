"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface AddRoomFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface RoomFormData {
  name: string;
  type: 'Standard' | 'Deluxe' | 'Premium';
  price: string;
  monthlyPrice: string;
  description: string;
  facilities: string[];
  images: File[];
  maxOccupancy: string;
  size: string;
}

const AddRoomForm: React.FC<AddRoomFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<RoomFormData>({
    name: '',
    type: 'Standard',
    price: '',
    monthlyPrice: '',
    description: '',
    facilities: [''],
    images: [],
    maxOccupancy: '1',
    size: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle array field changes (facilities only, images handled separately)
  const handleArrayFieldChange = (field: 'facilities', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  // Handle image file uploads
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error('Please upload only JPEG, PNG, or WebP images');
      return;
    }

    // Validate file sizes (max 5MB each)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('Each image must be less than 5MB');
      return;
    }

    // Add new images to existing ones
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  // Remove image
  const removeImage = (index: number) => {
    // Revoke the preview URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Add new item to facilities
  const addArrayItem = (field: 'facilities') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  // Remove item from facilities
  const removeArrayItem = (field: 'facilities', index: number) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  // Upload images to backend
  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_BACKEND_API_KEY || 'gaadaKey'}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }

      const result = await response.json();
      return result.url;
    });

    return Promise.all(uploadPromises);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.monthlyPrice || !formData.size) {
        toast.error('Please fill all required fields');
        return;
      }

      // Filter out empty facilities
      const cleanedFacilities = formData.facilities.filter(f => f.trim() !== '');

      // Upload images first if any
      let imageUrls: string[] = [];
      if (formData.images.length > 0) {
        toast.info('Uploading images...');
        imageUrls = await uploadImages(formData.images);
      }

      // Prepare room data
      const roomData = {
        name: formData.name,
        type: formData.type,
        price: parseInt(formData.price) || 0,
        monthlyPrice: parseInt(formData.monthlyPrice),
        description: formData.description,
        facilities: cleanedFacilities,
        images: imageUrls,
        maxOccupancy: parseInt(formData.maxOccupancy),
        size: parseFloat(formData.size)
      };

      // Submit room data to backend
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
      const apiKey = process.env.NEXT_PUBLIC_BACKEND_API_KEY || 'gaadaKey';
      
      console.log('Backend URL:', backendUrl);
      console.log('API Key:', apiKey ? 'Set' : 'Missing');
      
      const response = await fetch(`${backendUrl}/api/admin/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(roomData)
      });

      if (!response.ok) {
        let errorMessage = 'Failed to create room';
        try {
          const error = await response.json();
          errorMessage = error.error || error.message || errorMessage;
        } catch (parseError) {
          // If JSON parsing fails, get the raw text
          const errorText = await response.text();
          console.error('Raw error response:', errorText);
          errorMessage = `HTTP ${response.status}: ${errorText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      toast.success('Room created successfully!');
      
      // Clean up image previews
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      
      // Reset form
      setFormData({
        name: '',
        type: 'Standard',
        price: '',
        monthlyPrice: '',
        description: '',
        facilities: [''],
        images: [],
        maxOccupancy: '1',
        size: ''
      });
      setImagePreviews([]);

      onSuccess?.();
    } catch (error: any) {
      console.error('Error creating room:', error);
      toast.error(error.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tambah Kamar Baru</CardTitle>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nama Kamar *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Kamar A1, Kamar B2"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="type">Tipe Kamar</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Deluxe">Deluxe</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monthlyPrice">Harga Bulanan (Rp) *</Label>
              <Input
                id="monthlyPrice"
                name="monthlyPrice"
                type="number"
                value={formData.monthlyPrice}
                onChange={handleInputChange}
                placeholder="1200000"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="price">Harga Harian (Rp)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="50000"
              />
            </div>
          </div>

          {/* Size and Occupancy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="size">Ukuran (m²) *</Label>
              <Input
                id="size"
                name="size"
                type="number"
                step="0.1"
                value={formData.size}
                onChange={handleInputChange}
                placeholder="12"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="maxOccupancy">Kapasitas Maksimal</Label>
              <Select value={formData.maxOccupancy} onValueChange={(value) => handleSelectChange('maxOccupancy', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Orang</SelectItem>
                  <SelectItem value="2">2 Orang</SelectItem>
                  <SelectItem value="3">3 Orang</SelectItem>
                  <SelectItem value="4">4 Orang</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Deskripsi kamar..."
              rows={3}
            />
          </div>

          {/* Facilities */}
          <div>
            <Label>Fasilitas</Label>
            <div className="space-y-2">
              {formData.facilities.map((facility, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={facility}
                    onChange={(e) => handleArrayFieldChange('facilities', index, e.target.value)}
                    placeholder="e.g., AC, Wi-Fi, Kamar Mandi Dalam"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('facilities', index)}
                    disabled={formData.facilities.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('facilities')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Fasilitas
              </Button>
            </div>
          </div>

          {/* Images Upload */}
          <div>
            <Label>Upload Gambar Kamar</Label>
            
            {/* Image Upload Button */}
            <div className="mb-4">
              <Label 
                htmlFor="image-upload" 
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
              >
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Click to upload images
                  </span>
                  <span className="text-xs text-gray-400">
                    JPEG, PNG, WebP (max 5MB each)
                  </span>
                </div>
              </Label>
              <input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Image Previews */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video relative rounded-lg overflow-hidden border bg-gray-100">
                      <Image
                        src={imagePreviews[index]}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Menyimpan...' : 'Simpan Kamar'}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Batal
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddRoomForm;
