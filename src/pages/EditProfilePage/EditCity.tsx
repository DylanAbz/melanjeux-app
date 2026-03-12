import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './EditProfilePage.css';

const EditCity: React.FC = () => {
    const { user, login, token } = useAuth();
    const navigate = useNavigate();

    const [city, setCity] = useState(user?.city || '');
    const [cityInput, setCityInput] = useState(user?.city || '');
    const [citySuggestions, setCitySuggestions] = useState<any[]>([]);

    const hasChanged = city !== (user?.city || '');

    useEffect(() => {
        if (cityInput.length > 2 && cityInput !== city) {
            fetch(`https://geo.api.gouv.fr/communes?nom=${cityInput}&limit=5&fields=nom,codesPostaux`)
                .then(res => res.json())
                .then(data => setCitySuggestions(data))
                .catch(err => console.error(err));
        } else {
            setCitySuggestions([]);
        }
    }, [cityInput, city]);

    const handleCitySelect = (c: any) => {
        setCity(c.nom);
        setCityInput(c.nom);
        setCitySuggestions([]);
    };

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
                    city
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
                <h1>Ville</h1>
            </header>

            <div className="edit-profile-content">
                <div className="edit-form-group city-autocomplete">
                    <label>Ville</label>
                    <div className="input-with-icon">
                        <input 
                            type="text" 
                            placeholder="Rechercher une ville" 
                            value={cityInput} 
                            onChange={(e) => setCityInput(e.target.value)} 
                        />
                        <div className="clear-btn" style={{ pointerEvents: 'none' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                        {citySuggestions.length > 0 && (
                            <ul className="suggestions-list">
                                {citySuggestions.map((c, i) => (
                                    <li key={i} onClick={() => handleCitySelect(c)}>
                                        {c.nom} ({c.codesPostaux?.[0]?.substring(0, 2)})
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
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

export default EditCity;
