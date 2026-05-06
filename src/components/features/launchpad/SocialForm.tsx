import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { SocialData } from '../../pages/LaunchpadPage';

interface SocialFormProps {
  data: SocialData;
  updateData: (data: Partial<SocialData>) => void;
}

const SocialForm: React.FC<SocialFormProps> = ({ data, updateData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Social Media</h2>
      <p className="mb-6 text-[#464E54]">
        Connect your social media accounts to your website. Enter the full URLs to your profiles.
        These links will be displayed in the footer and header of your site.
      </p>

      <div className="form-group">
        <label htmlFor="facebook" className="flex items-center">
          <Facebook size={20} className="text-[#1877F2] mr-2" />
          Facebook URL
        </label>
        <input
          type="url"
          id="facebook"
          name="facebook"
          value={data.facebook}
          onChange={handleChange}
          className="form-control"
          placeholder="e.g., https://facebook.com/yourbusiness"
        />
      </div>

      <div className="form-group">
        <label htmlFor="instagram" className="flex items-center">
          <Instagram size={20} className="text-[#E4405F] mr-2" />
          Instagram URL
        </label>
        <input
          type="url"
          id="instagram"
          name="instagram"
          value={data.instagram}
          onChange={handleChange}
          className="form-control"
          placeholder="e.g., https://instagram.com/yourbusiness"
        />
      </div>

      <div className="form-group">
        <label htmlFor="twitter" className="flex items-center">
          <Twitter size={20} className="text-[#1DA1F2] mr-2" />
          Twitter/X URL
        </label>
        <input
          type="url"
          id="twitter"
          name="twitter"
          value={data.twitter}
          onChange={handleChange}
          className="form-control"
          placeholder="e.g., https://twitter.com/yourbusiness"
        />
      </div>

      <div className="form-group">
        <label htmlFor="linkedin" className="flex items-center">
          <Linkedin size={20} className="text-[#0A66C2] mr-2" />
          LinkedIn URL
        </label>
        <input
          type="url"
          id="linkedin"
          name="linkedin"
          value={data.linkedin}
          onChange={handleChange}
          className="form-control"
          placeholder="e.g., https://linkedin.com/company/yourbusiness"
        />
      </div>

      <div className="mt-8 p-4 bg-[#f5f5f5] rounded-lg">
        <h3 className="text-lg font-medium mb-3">Social Media Tips</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Use complete URLs including 'https://'</li>
          <li>Verify that your links work before submitting</li>
          <li>You don't have to fill in all social media links - only include the platforms where your business is active</li>
          <li>Consistent branding across all platforms helps strengthen your online presence</li>
        </ul>
      </div>
    </div>
  );
};

export default SocialForm;