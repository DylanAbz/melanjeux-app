import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import './AvatarModal.css';

interface AvatarModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (avatarUrl: string) => void;
    currentAvatar: string;
}

const AvatarModal: React.FC<AvatarModalProps> = ({ isOpen, onClose, onSelect, currentAvatar }) => {
    const avatars = [
        '/avatars/avatar0.svg',
        '/avatars/avatar1.svg',
        '/avatars/avatar2.svg',
        '/avatars/avatar3.svg',
        '/avatars/avatar4.svg',
        '/avatars/avatar5.svg',
        '/avatars/avatar6.svg',
        '/avatars/avatar7.svg',
        '/avatars/avatar8.svg',
    ];

    const [selected, setSelected] = useState(currentAvatar || avatars[0]);

    const handleConfirm = () => {
        onSelect(selected);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} noCloseButton>
            <div className="avatar-modal-inner">
                <div className="avatars-grid">
                    {avatars.map((avatar, index) => (
                        <div 
                            key={index} 
                            className={`avatar-item ${selected === avatar ? 'selected' : ''}`}
                            onClick={() => setSelected(avatar)}
                        >
                            <img src={avatar} alt={`Avatar ${index}`} />
                        </div>
                    ))}
                </div>
                <div className="avatar-modal-actions">
                    <button className="btn-annuler" onClick={onClose}>Annuler</button>
                    <button className="btn-valider" onClick={handleConfirm}>Valider</button>
                </div>
            </div>
        </Modal>
    );
};

export default AvatarModal;
