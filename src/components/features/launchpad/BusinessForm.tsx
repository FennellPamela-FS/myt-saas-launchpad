import React from 'react';
import { BusinessData } from '../../pages/LaunchpadPage';

interface BusinessFormProps {
  data: BusinessData;
  updateData: (data: Partial<BusinessData>) => void;
}

const BusinessForm: React.FC<BusinessFormProps> = ({ data, updateData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Business Details</h2>
      <p className="mb-6 text-[#464E54]">
        Let's start with the core information about your business. This will be used
        throughout your website to create a consistent brand message.
      </p>

      <div className="form-group">
        <label htmlFor="businessName">Business Name*</label>
        <input
          type="text"
          id="businessName"
          name="businessName"
          value={data.businessName}
          onChange={handleChange}
          className="form-control"
          placeholder="e.g., Acme Solutions"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="tagline">Tagline</label>
        <input
          type="text"
          id="tagline"
          name="tagline"
          value={data.tagline}
          onChange={handleChange}
          className="form-control"
          placeholder="e.g., Innovative solutions for modern businesses"
        />
      </div>

      <div className="form-group">
        <label htmlFor="mainHeadline">Main Headline*</label>
        <input
          type="text"
          id="mainHeadline"
          name="mainHeadline"
          value={data.mainHeadline}
          onChange={handleChange}
          className="form-control"
          placeholder="e.g., Transform Your Business with Our Solutions"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="subheadline1">Sub-headline 1</label>
        <input
          type="text"
          id="subheadline1"
          name="subheadline1"
          value={data.subheadline1}
          onChange={handleChange}
          className="form-control"
          placeholder="e.g., Innovative approaches to common challenges"
        />
      </div>

      <div className="form-group">
        <label htmlFor="subheadline2">Sub-headline 2</label>
        <input
          type="text"
          id="subheadline2"
          name="subheadline2"
          value={data.subheadline2}
          onChange={handleChange}
          className="form-control"
          placeholder="e.g., Trusted by businesses across the country"
        />
      </div>

      <div className="form-group">
        <label htmlFor="introTitle">Introduction Section Title*</label>
        <input
          type="text"
          id="introTitle"
          name="introTitle"
          value={data.introTitle}
          onChange={handleChange}
          className="form-control"
          placeholder="e.g., Welcome to Acme Solutions"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="introText">Introduction Text*</label>
        <textarea
          id="introText"
          name="introText"
          value={data.introText}
          onChange={handleChange}
          className="form-control"
          placeholder="Briefly introduce your business and what you do..."
          required
        ></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="aboutText">About Us / Solutions Text*</label>
        <textarea
          id="aboutText"
          name="aboutText"
          value={data.aboutText}
          onChange={handleChange}
          className="form-control"
          placeholder="Describe your business, solutions, or unique value proposition..."
          required
        ></textarea>
      </div>
    </div>
  );
};

export default BusinessForm;