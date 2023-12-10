import React from 'react';
import './SimplePopup.css';

interface SimplePopupProps {
  message: string;
  onClose: () => void;
}

const SimplePopup: React.FC<SimplePopupProps> = ({ message, onClose }) => {
  console.log('SimplePopup called with message: ' + message);
  if (!message) return null;

  return (
    <div className="popup-backdrop">
      <div className="popup">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SimplePopup;
