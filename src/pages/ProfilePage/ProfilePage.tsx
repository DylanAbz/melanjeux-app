import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader/PageHeader';

// Custom icons as inline SVGs to match the Figma exactly
const ProfileIcon = ({ name, className }: { name: string, className?: string }) => {
    const commonProps = {
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        className: className
    };

    switch (name) {
        case 'globe':
            return (
                <svg {...commonProps} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
            );
        case 'heart':
            return (
                <svg {...commonProps} fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            );
        case 'edit':
            return (
                <svg {...commonProps} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
            );
        case 'logout':
            return (
                <svg {...commonProps} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
            );
        case 'chevron-right':
            return (
                <svg {...commonProps} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            );
        default:
            return null;
    }
};

const ProfilePage: React.FC = () => {
    const { isAuthenticated, user, login, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [view, setView] = useState<'login' | 'register'>(
        (location.state as any)?.view === 'register' ? 'register' : 'login'
    );
    const [activeTab, setActiveTab] = useState<'informations' | 'parametres'>('informations');
    const [error, setError] = useState<string | null>(null);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth > 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // City autocomplete states
    const [cityInput, setCityInput] = useState('');
    const [citySuggestions, setCitySuggestions] = useState<any[]>([]);

    useEffect(() => {
        if ((location.state as any)?.view) {
            setView((location.state as any).view);
        }
    }, [location.state]);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        birthDate: '',
        isAgePublic: false,
        city: '',
        pseudo: '',
        consentCGU: false,
        consentRGPD: false
    });

    // Fetch cities from API Géo when user types
    useEffect(() => {
        if (cityInput.length > 2) {
            fetch(`https://geo.api.gouv.fr/communes?nom=${cityInput}&limit=5&fields=nom,codesPostaux`)
                .then(res => res.json())
                .then(data => setCitySuggestions(data))
                .catch(err => console.error(err));
        } else {
            setCitySuggestions([]);
        }
    }, [cityInput]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleCitySelect = (city: any) => {
        setFormData(prev => ({ ...prev, city: city.nom }));
        setCityInput(city.nom);
        setCitySuggestions([]);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password })
            });
            const data = await response.json();
            if (response.ok) {
                login(data.token, data.user);
                const destination = (location.state as any)?.from || '/profile';
                const slotId = (location.state as any)?.slotId;
                navigate(destination, { state: { slotId }, replace: true });
            } else {
                setError(data.error || 'Erreur lors de la connexion');
            }
        } catch (err) {
            setError('Erreur de serveur');
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }
        if (!formData.consentCGU || !formData.consentRGPD) {
            setError('Vous devez accepter les conditions');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                login(data.token, data.user);
                const destination = (location.state as any)?.from || '/profile';
                const slotId = (location.state as any)?.slotId;
                navigate(destination, { state: { slotId }, replace: true });
            } else {
                setError(data.error || 'Erreur lors de l\'inscription');
            }
        } catch (err) {
            setError('Erreur de serveur');
        }
    };

    if (isAuthenticated && user) {
        return (
            <div className={`profile-page ${isDesktop ? 'desktop' : ''}`}>
                {!isDesktop && (
                    <div className="profile-header-container">
                        <img src="/headerBackground.svg" alt="" className="profile-header-bg" />
                        <h1 className="profile-header-title">Mon Compte</h1>
                    </div>
                )}

                <div className="profile-tabs">
                    <div className="tabs-container">
                        <button 
                            className={`tab-btn ${activeTab === 'informations' ? 'active' : ''}`}
                            onClick={() => setActiveTab('informations')}
                        >
                            Informations
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'parametres' ? 'active' : ''}`}
                            onClick={() => setActiveTab('parametres')}
                        >
                            Paramètres
                        </button>
                    </div>
                </div>

                <div className="profile-scroll-content">
                    {activeTab === 'informations' ? (
                        <div className="informations-tab">
                            <h2 className="section-title">Profil</h2>
                            <div className="profile-info-card">
                                <div className="avatar-circle">
                                    <img src={user.avatarUrl || '/avatars/avatar0.svg'} alt="Avatar" className="profile-avatar-img" />
                                </div>
                                <h3 className="profile-pseudo-display">{user.pseudo}</h3>
                                <div className="profile-stats-list">
                                    <div className="profile-stat-item">
                                        <ProfileIcon name="globe" className="stat-icon" />
                                        <span>Environ {user.roomsExplored || '0-1'} salles explorées</span>
                                    </div>
                                    <div className="profile-stat-item">
                                        <ProfileIcon name="heart" className="stat-icon" />
                                        <span>{user.favoriteHobby || 'Ajoutez un passe-temps'}</span>
                                    </div>
                                </div>
                                <div className="profile-tags-container">
                                    {user.characteristics && user.characteristics.length > 0 ? (
                                        user.characteristics.map(char => (
                                            <span key={char} className="profile-tag">{char}</span>
                                        ))
                                    ) : (
                                        <>
                                            <span className="profile-tag">Créatif</span>
                                            <span className="profile-tag">Observateur</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <button className="modifier-profil-btn" onClick={() => navigate('/profile/edit')}>
                                <ProfileIcon name="edit" className="edit-icon" />
                                Modifier le profil
                            </button>

                            <h2 className="section-title">Informations personnelles</h2>
                            <div className="personal-info-card">
                                <div className="info-row" onClick={() => navigate('/profile/edit/name')}>
                                    <div className="info-text">
                                        <div className="info-label">Nom</div>
                                        <div className="info-value">{user.firstName} {user.lastName}</div>
                                    </div>
                                    <ProfileIcon name="chevron-right" className="chevron-icon" />
                                </div>
                                <div className="info-row">
                                    <div className="info-text">
                                        <div className="info-label">E-mail</div>
                                        <div className="info-value">{user.email}</div>
                                    </div>
                                    <ProfileIcon name="chevron-right" className="chevron-icon" />
                                </div>
                                <div className="info-row" onClick={() => navigate('/profile/edit/birthdate')}>
                                    <div className="info-text">
                                        <div className="info-label">Date de naissance</div>
                                        <div className="info-value">
                                            {user.birthDate 
                                                ? new Date(user.birthDate).toLocaleDateString('fr-FR') 
                                                : '01/01/2000'}
                                        </div>
                                    </div>
                                    <ProfileIcon name="chevron-right" className="chevron-icon" />
                                </div>
                                <div className="info-row" onClick={() => navigate('/profile/edit/city')}>
                                    <div className="info-text">
                                        <div className="info-label">Ville</div>
                                        <div className="info-value">{user.city || 'Non renseignée'}</div>
                                    </div>
                                    <ProfileIcon name="chevron-right" className="chevron-icon" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="parametres-tab">
                            <div className="settings-section">
                                <div className="settings-row">
                                    <div className="settings-info">
                                        <div className="settings-label">Activation du chat</div>
                                        <div className="settings-desc">Vous permet de converser avec les autres membres d’une même session.</div>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" defaultChecked />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                                <div className="settings-row">
                                    <div className="settings-info">
                                        <div className="settings-label">Notifications</div>
                                        <div className="settings-desc">Vous recevrez des notifications lorsque le statut de votre réservation avance ou lorsque vous recevez un message</div>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" defaultChecked />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>

                            <button className="deconnexion-btn" onClick={logout}>
                                Déconnexion
                                <ProfileIcon name="logout" className="logout-icon" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`profile-page ${isDesktop ? 'desktop' : ''}`}>
            {!isDesktop && <PageHeader title="Mon compte" />}
            <div className="auth-scroll-container">
                <div className="auth-content">
                    {view === 'login' ? (
                        <>
                            <h2 className="auth-title">Connexion</h2>
                            <button className="btn-pill btn-social">
                                <img src="/google.svg" alt="Google" className="google-icon-img" />
                                Se connecter avec Google
                            </button>
                            
                            <div className="divider">
                                <span className="divider-line"></span>
                                <span className="divider-text">ou</span>
                                <span className="divider-line"></span>
                            </div>

                            {error && <div className="error-message">{error}</div>}

                            <form className="auth-form" onSubmit={handleLogin}>
                                <div className="form-group">
                                    <label htmlFor="email">E-mail</label>
                                    <input 
                                        type="email" 
                                        id="email"
                                        name="email" 
                                        placeholder="ex : joueur@gmail.com" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Mot de passe</label>
                                    <input 
                                        type="password" 
                                        id="password"
                                        name="password" 
                                        placeholder="••••••••" 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <button type="submit" className="btn-pill btn-primary">Se connecter</button>
                            </form>

                            <div className="auth-footer">
                                <p>Nouveau sur Mélanjeux ?</p>
                                <button className="btn-pill btn-secondary" onClick={() => setView('register')}>Inscription</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="auth-title">Rejoins l'aventure Mélanjeux !</h2>
                            <button className="btn-pill btn-social">
                                <img src="/google.svg" alt="Google" className="google-icon-img" />
                                S'inscrire avec Google
                            </button>

                            <div className="divider">
                                <span className="divider-line"></span>
                                <span className="divider-text">ou</span>
                                <span className="divider-line"></span>
                            </div>

                            {error && <div className="error-message">{error}</div>}

                            <form className="auth-form" onSubmit={handleRegister}>
                                <div className="form-group">
                                    <label htmlFor="firstName">Prénom<span className="required-star">*</span></label>
                                    <input type="text" id="firstName" name="firstName" placeholder="ex : Marie" value={formData.firstName} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Nom<span className="required-star">*</span></label>
                                    <input type="text" id="lastName" name="lastName" placeholder="ex : Dupont" value={formData.lastName} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="reg-email">E-mail<span className="required-star">*</span></label>
                                    <input type="email" id="reg-email" name="email" placeholder="ex : joueur@gmail.com" value={formData.email} onChange={handleChange} required />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="birthDate">Date de naissance<span className="required-star">*</span></label>
                                    <input 
                                        type="date" 
                                        id="birthDate" 
                                        name="birthDate" 
                                        value={formData.birthDate} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                
                                <div className="checkbox-group">
                                    <input type="checkbox" id="isAgePublic" name="isAgePublic" checked={formData.isAgePublic} onChange={handleChange} />
                                    <label htmlFor="isAgePublic">J'accepte que mon âge soit affiché sur mon profil public</label>
                                </div>

                                <div className="form-group city-autocomplete">
                                    <label htmlFor="city">Ville (Optionnel)</label>
                                    <div className="input-with-icon">
                                        <input 
                                            type="text" 
                                            id="city" 
                                            placeholder="Rechercher une ville" 
                                            value={cityInput} 
                                            onChange={(e) => setCityInput(e.target.value)} 
                                        />
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

                                <div className="form-group">
                                    <label htmlFor="pseudo">Pseudo<span className="required-star">*</span></label>
                                    <input type="text" id="pseudo" name="pseudo" placeholder="ex : Pierrot" value={formData.pseudo} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="reg-password">Mot de passe<span className="required-star">*</span></label>
                                    <input type="password" id="reg-password" name="password" value={formData.password} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirmation du mot de passe<span className="required-star">*</span></label>
                                    <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                                </div>

                                <div className="checkbox-group required">
                                    <input type="checkbox" id="consentCGU" name="consentCGU" checked={formData.consentCGU} onChange={handleChange} required />
                                    <label htmlFor="consentCGU">
                                        J’ai lu et j’accepte les <span className="underlined">Conditions Générales d’Utilisation</span>.*
                                    </label>
                                </div>

                                <div className="checkbox-group required">
                                    <input type="checkbox" id="consentRGPD" name="consentRGPD" checked={formData.consentRGPD} onChange={handleChange} required />
                                    <label htmlFor="consentRGPD">
                                        J’accepte que mes données soient collectées et traitées dans le cadre de ce questionnaire, conformément au <span className="underlined">RGPD</span>.*
                                    </label>
                                </div>

                                <button type="submit" className="btn-pill btn-primary">S'inscrire</button>
                            </form>

                            <div className="auth-footer">
                                <p>Déjà sur Mélanjeux ?</p>
                                <button className="btn-pill btn-secondary" onClick={() => setView('login')}>Connexion</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
