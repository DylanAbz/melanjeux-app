import React from 'react';
import './BookingsPage.css';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import { useNavigate } from 'react-router-dom';

const BookingsPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) {
        return (
            <div className="bookings-page">
                <PageHeader title="Réservations" />
                <div className="auth-restricted-container">
                    <p className="restricted-text">Vous devez vous connecter pour accéder à vos réservations.</p>
                    <div className="restricted-actions">
                        <button className="btn-pill btn-primary" onClick={() => navigate('/profile')}>Connexion</button>
                        <button className="btn-pill btn-secondary" onClick={() => navigate('/profile', { state: { view: 'register' } })}>Inscription</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bookings-page">
            <PageHeader title="Réservations" />
            <div className="page-content">
                <h2>Mes Réservations</h2>
                <p>Vos réservations apparaîtront ici.</p>
            </div>
        </div>
    );
};

export default BookingsPage;
