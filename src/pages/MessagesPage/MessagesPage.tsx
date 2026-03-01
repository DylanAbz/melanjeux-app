import React from 'react';
import './MessagesPage.css';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import { useNavigate } from 'react-router-dom';

const MessagesPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) {
        return (
            <div className="messages-page">
                <PageHeader title="Messages" />
                <div className="auth-restricted-container">
                    <p className="restricted-text">Vous devez vous connecter pour accéder à vos messages.</p>
                    <div className="restricted-actions">
                        <button className="btn-pill btn-primary" onClick={() => navigate('/profile')}>Connexion</button>
                        <button className="btn-pill btn-secondary" onClick={() => navigate('/profile', { state: { view: 'register' } })}>Inscription</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="messages-page">
            <PageHeader title="Messages" />
            <div className="page-content">
                <h2>Mes Messages</h2>
                <p>Vos messages apparaîtront ici.</p>
            </div>
        </div>
    );
};

export default MessagesPage;
