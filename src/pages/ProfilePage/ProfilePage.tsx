import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader/PageHeader';

const ProfilePage: React.FC = () => {
    const { isAuthenticated, user, login, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [view, setView] = useState<'login' | 'register'>(
        (location.state as any)?.view === 'register' ? 'register' : 'login'
    );
    const [error, setError] = useState<string | null>(null);

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
            const response = await fetch('http://localhost:4000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password })
            });
            const data = await response.json();
            if (response.ok) {
                login(data.token, data.user);
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
            const response = await fetch('http://localhost:4000/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                login(data.token, data.user);
            } else {
                setError(data.error || 'Erreur lors de l\'inscription');
            }
        } catch (err) {
            setError('Erreur de serveur');
        }
    };

    if (isAuthenticated && user) {
        return (
            <div className="profile-page">
                <PageHeader title="Mon compte" />
                <div className="profile-logged-content">
                    <div className="profile-card">
                        <h2>Bienvenue, {user.pseudo} !</h2>
                        <div className="user-details">
                            <p><strong>E-mail :</strong> {user.email}</p>
                            <p><strong>Prénom :</strong> {user.firstName}</p>
                            <p><strong>Nom :</strong> {user.lastName}</p>
                        </div>
                        <button className="btn-pill btn-primary" onClick={logout}>Se déconnecter</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <PageHeader title="Mon compte" />
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
