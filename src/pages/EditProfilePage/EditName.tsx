import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './EditProfilePage.css';

const EditName: React.FC = () => {
    const { user, login, token } = useAuth();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');

    const hasChanged = firstName !== user?.firstName || lastName !== user?.lastName;
    const isValid = firstName.trim() !== '' && lastName.trim() !== '';

    const handleSave = async () => {
        if (!user?.id || !hasChanged || !isValid) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/profile`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: user.id,
                    firstName,
                    lastName
                })
            });

            const data = await response.json();

            if (response.ok) {
                if (token) {
                    login(token, data.user);
                }
                navigate('/profile');
            } else {
                alert('Erreur lors de la sauvegarde : ' + (data.error || 'Erreur inconnue'));
            }
        } catch (err) {
            alert('Erreur réseau.');
        }
    };

    return (
        <div className="edit-profile-page">
            <header className="edit-profile-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <h1>Nom</h1>
            </header>

            <div className="edit-profile-content">
                <div className="edit-form-group">
                    <label>Prénom</label>
                    <div className="input-with-icon">
                        <input 
                            type="text" 
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="ex : Pierre"
                        />
                        {firstName && (
                            <button className="clear-btn" onClick={() => setFirstName('')}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                <div className="edit-form-group">
                    <label>Nom</label>
                    <div className="input-with-icon">
                        <input 
                            type="text" 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="ex : Quiroule"
                        />
                        {lastName && (
                            <button className="clear-btn" onClick={() => setLastName('')}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                <div style={{ flex: 1 }}></div>

                <button 
                    className={`save-profile-btn ${!hasChanged || !isValid ? 'disabled' : ''}`} 
                    onClick={handleSave}
                    disabled={!hasChanged || !isValid}
                    style={{
                        backgroundColor: !hasChanged || !isValid ? '#9E9E9E' : 'var(--Colors-Lust-400)',
                        marginBottom: '40px'
                    }}
                >
                    Sauvegarder les modifications
                </button>
            </div>
        </div>
    );
};

export default EditName;
