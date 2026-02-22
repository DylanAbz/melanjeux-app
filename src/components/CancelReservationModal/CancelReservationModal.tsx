import React from 'react';
import './CancelReservationModal.css';

interface CancelReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

const CancelReservationModal: React.FC<CancelReservationModalProps> = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    isLoading 
}) => {
    if (!isOpen) return null;

    return (
        <div className="cancel-modal-overlay" onClick={onClose}>
            <div className="cancel-modal-card" onClick={(e) => e.stopPropagation()}>
                <h2 className="cancel-modal-title">Désinscription</h2>
                <p className="cancel-modal-message">
                    Es-tu sûr de vouloir te désinscrire de la session ?
                </p>
                <div className="cancel-modal-actions">
                    <button className="cancel-btn-cancel" onClick={onClose} disabled={isLoading}>
                        Annuler
                    </button>
                    <button className="cancel-btn-confirm" onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? '...' : 'Me désinscrire'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelReservationModal;
