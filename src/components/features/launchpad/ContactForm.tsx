import React from 'react';
import { ContactData, BenefitItem } from '../../pages/LaunchpadPage';

interface ContactFormProps {
  data: ContactData;
  updateData: (data: Partial<ContactData>) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ data, updateData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  const handleBenefitChange = (index: number, field: keyof BenefitItem, value: string) => {
    const newBenefits = [...data.benefits];
    newBenefits[index] = {
      ...newBenefits[index],
      [field]: value
    };
    updateData({ benefits: newBenefits });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Contact Information & Benefits</h2>
      <p className="mb-6 text-[#464E54]">
        Add your contact details and key benefits that your business provides to customers.
        Benefits will be displayed prominently on your site.
      </p>

      <div className="form-group">
        <label htmlFor="phone">Business Phone Number*</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={data.phone}
          onChange={handleChange}
          className="form-control"
          placeholder="e.g., (555) 123-4567"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Business Email Address*</label>
        <input
          type="email"
          id="email"
          name="email"
          value={data.email}
          onChange={handleChange}
          className="form-control"
          placeholder="e.g., contact@example.com"
          required
        />
      </div>

      <h3 className="text-xl font-bold mt-8 mb-4">Business Benefits</h3>
      <p className="mb-4 text-[#464E54]">
        List 4 key benefits that your customers get from working with you.
        These will be featured prominently on your website.
      </p>

      {data.benefits.map((benefit, index) => (
        <div key={index} className="p-4 mb-4 border border-[#e6e6e6] rounded-lg bg-[#fafafa]">
          <h4 className="font-medium mb-3">Benefit {index + 1}</h4>
          
          <div className="form-group">
            <label htmlFor={`benefit-title-${index}`}>Benefit Title*</label>
            <input
              type="text"
              id={`benefit-title-${index}`}
              value={benefit.title}
              onChange={(e) => handleBenefitChange(index, 'title', e.target.value)}
              className="form-control"
              placeholder={`e.g., Benefit ${index + 1} Title`}
              required
            />
          </div>
          
          <div className="form-group mb-0">
            <label htmlFor={`benefit-desc-${index}`}>Benefit Description*</label>
            <input
              type="text"
              id={`benefit-desc-${index}`}
              value={benefit.description}
              onChange={(e) => handleBenefitChange(index, 'description', e.target.value)}
              className="form-control"
              placeholder="Brief description of this benefit..."
              required
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactForm;