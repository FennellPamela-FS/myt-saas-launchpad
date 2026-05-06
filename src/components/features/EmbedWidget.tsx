// EmbedWidget.tsx
import React, { useEffect, useRef } from 'react';
import { Mail } from 'lucide-react';

export interface EmbedWidgetProps {
  // You can add custom props if needed in the future.
}

const EmbedWidget: React.FC<EmbedWidgetProps> = () => {
  // Create a ref to the container element where the script will be injected.
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically create the script element.
    const script = document.createElement('script');
    script.src = "https://io.mytcreative.com/js/form_embed.js";
    script.async = true;

    // Append the script element to the container div.
    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }
    
    // Optional cleanup if necessary.
    return () => {
      if (containerRef.current && containerRef.current.contains(script)) {
        containerRef.current.removeChild(script); 
      }
    };
  }, []);

  return (
    <div>
      {/* Wrap the iframe and the script injection in a container div. */}
      <div ref={containerRef}>
        <div className="flex items-center mb-4">
          <Mail size={24} className="text-[#4EBCED] mr-3" />
          <h4 className="text-white text-xl font-bold">Stay Updated</h4>
        </div>  
        
        <p className="mb-6 text-[#F3F3F3] leading-relaxed">
          Subscribe to our newsletter for the latest insights.
        </p>
        <iframe
          src="https://io.mytcreative.com/widget/form/iDvAyW9yzr57tOGOJ0Kc"
          style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px' }}
          id="inline-iDvAyW9yzr57tOGOJ0Kc"
          data-layout="{'id':'INLINE'}"
          data-trigger-type="alwaysShow"
          data-trigger-value=""
          data-activation-type="alwaysActivated"
          data-activation-value=""
          data-deactivation-type="neverDeactivate"
          data-deactivation-value=""
          data-form-name="mytSubscription"
          data-height="200"
          data-layout-iframe-id="inline-iDvAyW9yzr57tOGOJ0Kc"
          data-form-id="iDvAyW9yzr57tOGOJ0Kc"
          title="mytSubscription"
        ></iframe>
      </div>
    </div>
  );
};

export default EmbedWidget;