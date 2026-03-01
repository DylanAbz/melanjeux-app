import React, { useEffect } from 'react';
import './Toast.css';

interface ToastProps {
    message: string;
    show: boolean;
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
    message, 
    show, 
    onClose, 
    duration = 3000 
}) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    if (!show) return null;

    return (
        <div className="toast-container">
            <div className="toast-content">
                <div className="toast-icon-wrapper">
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <span className="toast-message">{message}</span>
            </div>
        </div>
    );
};

export default Toast;
