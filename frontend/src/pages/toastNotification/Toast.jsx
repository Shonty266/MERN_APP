import { useState, useEffect } from 'react';

const Toast = ({ message, visible }) => {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    let timeout;
    if (visible) {
      setIsVisible(true);
      timeout = setTimeout(() => setIsVisible(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      setIsVisible(false);
    }
  }, [visible]);

  if (!message) return null;

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 w-fit bg-[#1a1a1a] text-white px-6 py-3 rounded-md shadow-lg transition-all duration-500 ease-in-out ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-[200%] opacity-0'
      }`}
      style={{ 
        border: '2px solid #666',
        animation: isVisible ? 'slideUp 0.5s ease-out' : 'slideDown 0.5s ease-in'
      }}
    >
      <style>
        {`
          @keyframes slideUp {
            from {
              transform: translate(-50%, 200%);
              opacity: 0;
            }
            to {
              transform: translate(-50%, 0);
              opacity: 1;
            }
          }
          @keyframes slideDown {
            from {
              transform: translate(-50%, 0);
              opacity: 1;
            }
            to {
              transform: translate(-50%, 200%);
              opacity: 0;
            }
          }
        `}
      </style>
      {message}
    </div>
  );
};

export default Toast;
