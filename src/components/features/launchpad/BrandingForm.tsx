import React, { useRef } from 'react';
import { BrandingData } from '../../pages/LaunchpadPage';

interface BrandingFormProps {
  data: BrandingData;
  updateData: (data: Partial<BrandingData>) => void;
}

const BrandingForm: React.FC<BrandingFormProps> = ({ data, updateData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      updateData({ logo: e.target.files[0] });
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Branding</h2>
      <p className="mb-6 text-[#464E54]">
        Define your brand's visual identity by uploading your logo and selecting your brand colors.
        These elements will be used throughout your website for a consistent look.
      </p>

      <div className="form-group">
        <label>Logo Upload</label>
        <div className="mb-2 text-sm text-[#818284]">
          Upload your business logo (PNG or JPG format recommended)
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <div className="flex items-center mb-2">
          <button
            type="button"
            onClick={triggerFileInput}
            className="btn btn-outline py-2"
          >
            Choose File
          </button>
          <span className="ml-3 text-[#818284]">
            {data.logo ? data.logo.name : 'No file chosen'}
          </span>
        </div>
        {data.logo && (
          <div className="mt-4 p-3 border rounded-lg inline-block">
            <div className="text-sm font-medium mb-2">Preview:</div>
            <img
              src={URL.createObjectURL(data.logo)}
              alt="Logo preview"
              className="max-h-24"
            />
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="primaryColor">Primary Brand Color</label>
        <div className="flex items-center">
          <input
            type="color"
            id="primaryColor"
            name="primaryColor"
            value={data.primaryColor}
            onChange={handleChange}
            className="h-10 w-10 rounded border"
          />
          <input
            type="text"
            value={data.primaryColor}
            onChange={handleChange}
            name="primaryColor"
            className="form-control ml-3"
            placeholder="#4EBCED"
          />
        </div>
        <div className="mt-2 text-sm text-[#818284]">
          This color will be used for buttons, highlights, and key elements
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="secondaryColor">Secondary Brand Color</label>
        <div className="flex items-center">
          <input
            type="color"
            id="secondaryColor"
            name="secondaryColor"
            value={data.secondaryColor}
            onChange={handleChange}
            className="h-10 w-10 rounded border"
          />
          <input
            type="text"
            value={data.secondaryColor}
            onChange={handleChange}
            name="secondaryColor"
            className="form-control ml-3"
            placeholder="#464E54"
          />
        </div>
        <div className="mt-2 text-sm text-[#818284]">
          This color will be used for text, backgrounds, and secondary elements
        </div>
      </div>

      <div className="mt-8 p-4 bg-[#f5f5f5] rounded-lg">
        <h3 className="text-lg font-medium mb-3">Color Preview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div
            className="p-4 rounded text-white font-medium text-center"
            style={{ backgroundColor: data.primaryColor }}
          >
            Primary Color
          </div>
          <div
            className="p-4 rounded text-white font-medium text-center"
            style={{ backgroundColor: data.secondaryColor }}
          >
            Secondary Color
          </div>
        </div>
        <div className="mt-4 p-4 bg-white rounded">
          <div className="mb-2">Sample Button:</div>
          <button
            className="px-4 py-2 rounded text-white font-medium"
            style={{ backgroundColor: data.primaryColor }}
          >
            Click Me
          </button>
          <div className="mt-4 mb-2">Sample Text:</div>
          <div style={{ color: data.secondaryColor }}>
            This text uses your secondary color.
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingForm;