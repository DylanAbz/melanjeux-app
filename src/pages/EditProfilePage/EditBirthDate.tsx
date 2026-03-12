import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './EditProfilePage.css';

const EditBirthDate: React.FC = () => {
    const { user, login, token } = useAuth();
    const navigate = useNavigate();

    // Format YYYY-MM-DD for input type="date"
    const initialDate = user?.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '2000-01-01';
    const [birthDate, setBirthDate] = useState(initialDate);
    const [isAgePublic, setIsAgePublic] = useState(user?.isAgePublic || false);

    const hasChanged = birthDate !== initialDate || isAgePublic !== (user?.isAgePublic || false);

    const handleSave = async () => {
        if (!user?.id || !hasChanged) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/profile`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: user.id,
                    birthDate,
                    isAgePublic
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
                <h1>Date de naissance</h1>
            </header>

            <div className="edit-profile-content">
                <div className="edit-form-group">
                    <label>Date de naissance</label>
                    <div className="input-with-icon">
                        <input 
                            type="date" 
                            value={birthDate} 
                            onChange={(e) => setBirthDate(e.target.value)}
                        />
                        <div className="clear-btn" style={{ pointerEvents: 'none' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="toggle-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <span style={{ fontSize: '14px', color: '#6D6D6D', flex: 1 }}>Afficher mon âge sur mon profil public</span>
                    <label className="switch">
                        <input 
                            type="checkbox" 
                            checked={isAgePublic} 
                            onChange={(e) => setIsAgePublic(e.target.checked)}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>

                <div style={{ flex: 1 }}></div>

                <button 
                    className={`save-profile-btn ${!hasChanged ? 'disabled' : ''}`} 
                    onClick={handleSave}
                    disabled={!hasChanged}
                    style={{
                        backgroundColor: !hasChanged ? '#9E9E9E' : 'var(--Colors-Lust-400)',
                        marginBottom: '40px'
                    }}
                >
                    Sauvegarder les modifications
                </button>
            </div>
        </div>
    );
};

export default EditBirthDate;
