'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CompanyInfo, COMPANY_SIZES } from '@/types/onboarding';

interface CompanyInfoStepProps {
  data: CompanyInfo;
  onChange: (data: CompanyInfo) => void;
}

export function CompanyInfoStep({ data, onChange }: CompanyInfoStepProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(data.logoUrl || null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }

      // Validate file type
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        alert('Only PNG and JPG files are allowed');
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      onChange({ ...data, logo: file });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Tell us about your company</h2>
        <p className="mt-2 text-sm text-gray-600">
          This helps us personalize your proposals and branding.
        </p>
      </div>

      <div className="space-y-4">
        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="companyName">
            Company Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="companyName"
            placeholder="Acme Digital Agency"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            className="h-11"
          />
        </div>

        {/* Company Logo */}
        <div className="space-y-2">
          <Label htmlFor="companyLogo">Company Logo (Optional)</Label>
          <div className="flex items-center gap-4">
            <label
              htmlFor="companyLogo"
              className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Company logo preview"
                  className="h-full w-full rounded-lg object-cover"
                  width={80}
                  height={80}
                />
              ) : (
                <Upload className="h-6 w-6 text-gray-400" />
              )}
            </label>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Upload Logo</p>
              <p className="text-sm text-gray-500">PNG, JPG up to 2MB</p>
            </div>
            <input
              id="companyLogo"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleLogoChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Industry */}
        <div className="space-y-2">
          <Label htmlFor="industry">Industry (Optional)</Label>
          <Input
            id="industry"
            placeholder="e.g., Technology, Marketing, Consulting"
            value={data.industry || ''}
            onChange={(e) => onChange({ ...data, industry: e.target.value })}
            className="h-11"
          />
        </div>

        {/* Company Size */}
        <div className="space-y-2">
          <Label htmlFor="companySize">Company Size (Optional)</Label>
          <Select
            value={data.companySize || ''}
            onValueChange={(value) => onChange({ ...data, companySize: value })}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              {COMPANY_SIZES.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
