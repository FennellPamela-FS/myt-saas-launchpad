import React from 'react';
import { ServiceItem } from '../../pages/LaunchpadPage';

interface ServiceFormProps {
  data: {
    title: string;
    subtitle: string;
    items: ServiceItem[];
  };
  updateData: (data: Partial<{
    title: string;
    subtitle: string;
    items: ServiceItem[];
  }>) => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ data, updateData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  const handleServiceChange = (index: number, field: keyof ServiceItem, value: string) => {
    const newServices = [...data.items];
    newServices[index] = {
      ...newServices[index],
      [field]: value
    };
    updateData({ items: newServices });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Services Information</h2>
      <p className="mb-6 text-[#464E54]">
        Describe the key services that your business offers. These will be showcased
        in a dedicated section on your website.
      </p>

      <div className="form-group">
        <label htmlFor="title">Services Section Title*</label>
        <input
          type="text"
          id="title"
          name="title"
          value={data.title}
          onChange={handleChange}
          className="form-control"
          placeholder="e.g., Our Services"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="subtitle">Services Section Subtitle</label>
        <input
          type="text"
          id="subtitle"
          name="subtitle"
          value={data.subtitle}
          onChange={handleChange}
          className="form-control"
          placeholder="e.g., How we can help you succeed"
        />
      </div>

      <h3 className="text-xl font-bold mt-8 mb-4">Your Services</h3>
      <p className="mb-4 text-[#464E54]">
        List 3 primary services that you offer to your customers.
        Be clear and concise in your descriptions.
      </p>

      {data.items.map((service, index) => (
        <div key={index} className="p-4 mb-4 border border-[#e6e6e6] rounded-lg bg-[#fafafa]">
          <h4 className="font-medium mb-3">Service {index + 1}</h4>
          
          <div className="form-group">
            <label htmlFor={`service-name-${index}`}>Service Name*</label>
            <input
              type="text"
              id={`service-name-${index}`}
              value={service.name}
              onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
              className="form-control"
              placeholder={`e.g., Service ${index + 1} Name`}
              required
            />
          </div>
          
          <div className="form-group mb-0">
            <label htmlFor={`service-desc-${index}`}>Service Description*</label>
            <input
              type="text"
              id={`service-desc-${index}`}
              value={service.description}
              onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
              className="form-control"
              placeholder="Describe what this service includes and its benefits..."
              required
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceForm;