import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    noCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, noCloseButton = false }) => {
    if (!isOpen) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={noCloseButton ? undefined : onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {!noCloseButton && (
                    <button className="modal-close-button" onClick={onClose}>&times;</button>
                )}
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;

