import React from 'react';
import './BottomSheetBar.css';

interface BottomSheetBarProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const BottomSheetBar: React.FC<BottomSheetBarProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <>
      <div
        className={`bottom-sheet-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <div className={`bottom-sheet-container ${isOpen ? 'open' : ''}`}>
        <div className="bottom-sheet-header">
          <h2 className="bottom-sheet-title">{title}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="bottom-sheet-content">
          {children}
        </div>
      </div>
    </>
  );
};

export default BottomSheetBar;
