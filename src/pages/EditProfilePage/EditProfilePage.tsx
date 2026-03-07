import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AvatarModal from '../../components/AvatarModal/AvatarModal';
import './EditProfilePage.css';

const EditProfilePage: React.FC = () => {
    const { user, login, token } = useAuth();
    const navigate = useNavigate();

    const [pseudo, setPseudo] = useState(user?.pseudo || '');
    const [roomsExplored, setRoomsExplored] = useState(user?.roomsExplored || '0-1');
    const [favoriteHobby, setFavoriteHobby] = useState(user?.favoriteHobby || '');
    const [characteristics, setCharacteristics] = useState<string[]>(user?.characteristics || []);
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '/avatars/avatar0.svg');
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

    const roomOptions = ['0-1', '2-4', '5-9', '10-19', '20+'];
    const charOptions = ['Créatif', 'Observateur', 'Logique', 'Curieux', 'Leader', 'Calme', 'Audacieux', 'Réfléchi'];

    const handleCharToggle = (char: string) => {
        if (characteristics.includes(char)) {
            setCharacteristics(characteristics.filter(c => c !== char));
        } else if (characteristics.length < 2) {
            setCharacteristics([...characteristics, char]);
        }
    };

    const handleSave = async () => {
        console.log('Attempting to save profile...', { id: user?.id, pseudo, roomsExplored, favoriteHobby, characteristics, avatarUrl });
        if (!user?.id) {
            console.error('No user ID found');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/profile`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: user.id,
                    pseudo,
                    roomsExplored,
                    favoriteHobby,
                    characteristics, // Le driver postgres gère généralement les tableaux JS pour le JSONB, mais on peut vérifier
                    avatarUrl
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Profile updated successfully:', data);
                if (token) {
                    login(token, data.user);
                }
                navigate('/profile');
            } else {
                console.error('Server error during profile update:', data.error);
                alert('Erreur lors de la sauvegarde : ' + (data.error || 'Erreur inconnue'));
            }
        } catch (err) {
            console.error('Network or client error during profile update:', err);
            alert('Erreur réseau. Vérifiez que le backend est bien lancé.');
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
                <h1>Personnalisation du profil</h1>
            </header>

            <div className="edit-profile-content">
                <div className="edit-avatar-section">
                    <div className="large-avatar-circle">
                        <img src={avatarUrl} alt="Avatar" />
                        <button className="avatar-edit-icon" onClick={() => setIsAvatarModalOpen(true)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="edit-form-group">
                    <label>Pseudo</label>
                    <input 
                        type="text" 
                        value={pseudo} 
                        onChange={(e) => setPseudo(e.target.value)}
                        placeholder="Pierrot"
                    />
                </div>

                <div className="edit-form-group">
                    <label>Nombre de salles explorées</label>
                    <div className="rooms-selector">
                        {roomOptions.map(opt => (
                            <button 
                                key={opt}
                                className={`room-opt ${roomsExplored === opt ? 'active' : ''}`}
                                onClick={() => setRoomsExplored(opt)}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="edit-form-group">
                    <label>Passe-temps favori</label>
                    <input 
                        type="text" 
                        value={favoriteHobby} 
                        onChange={(e) => setFavoriteHobby(e.target.value)}
                        placeholder="ex. : Le cinéma"
                    />
                </div>

                <div className="edit-form-group">
                    <label>Caractéristiques (max. 2)</label>
                    <div className="chars-grid">
                        {charOptions.map(char => (
                            <button 
                                key={char}
                                className={`char-opt ${characteristics.includes(char) ? 'active' : ''}`}
                                onClick={() => handleCharToggle(char)}
                            >
                                {char}
                            </button>
                        ))}
                    </div>
                </div>

                <button className="save-profile-btn" onClick={handleSave}>
                    Sauvegarder les modifications
                </button>
            </div>

            <AvatarModal 
                isOpen={isAvatarModalOpen} 
                onClose={() => setIsAvatarModalOpen(false)} 
                onSelect={setAvatarUrl}
                currentAvatar={avatarUrl}
            />
        </div>
    );
};

export default EditProfilePage;

