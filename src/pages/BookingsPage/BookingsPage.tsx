import React, { useState, useEffect } from 'react';
import './BookingsPage.css';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import ReservationCard from '../../components/ReservationCard/ReservationCard';
import { useNavigate } from 'react-router-dom';
import type {StatusType} from '../../components/StatusBadge/StatusBadge';

interface BookingFromAPI {
    slot_id: string;
    start_time: string;
    slot_status: string;
    current_players_count: number;
    room_title: string;
    room_image: string;
    min_players: number;
    max_players: number;
    player_status: string;
}

interface BookingData {
    id: string;
    title: string;
    datetime: string;
    imageUrl: string;
    statusType: StatusType;
    statusText: string;
    paidCount?: number;
    totalCount?: number;
    currentPlayers?: number;
    minPlayers?: number;
    isPast: boolean;
}

const BookingsPage: React.FC = () => {
    const { isAuthenticated, token } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const response = await fetch('http://localhost:4000/time-slot-players/my-bookings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch bookings');
            const data: BookingFromAPI[] = await response.json();

            const mappedData: BookingData[] = data.map(b => {
                const startTime = new Date(b.start_time);
                const isPast = startTime < new Date();
                
                // Map status from backend to frontend UI
                let statusType: StatusType = 'WAITING_PLAYERS';
                let statusText = 'Recherche de joueurs';

                if (b.slot_status === 'filling' || b.slot_status === 'empty') {
                    if (b.current_players_count >= b.min_players) {
                        statusType = 'WAITING_PAYMENT';
                        statusText = 'En attente de paiement';
                    } else {
                        statusType = 'WAITING_PLAYERS';
                        statusText = 'En recherche de joueurs';
                    }
                } else if (b.slot_status === 'confirmed') {
                    statusType = 'CONFIRMED';
                    statusText = 'Réservation validée';
                } else if (isPast) {
                    statusType = 'FINISHED';
                    statusText = 'Terminé';
                }

                return {
                    id: b.slot_id,
                    title: b.room_title,
                    datetime: startTime.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }),
                    imageUrl: b.room_image,
                    statusType,
                    statusText,
                    currentPlayers: b.current_players_count,
                    minPlayers: b.min_players,
                    isPast
                };
            });

            setBookings(mappedData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && token) {
            fetchBookings();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, token]);

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

    const upcomingBookings = bookings.filter(b => !b.isPast);
    const pastBookings = bookings.filter(b => b.isPast);

    return (
        <div className="bookings-page">
            <PageHeader title="Réservations" />
            
            <main className="bookings-content">
                {loading ? (
                    <div className="bookings-loading">Chargement de vos réservations...</div>
                ) : (
                    <>
                        <section className="bookings-section">
                            <h2 className="section-title">À venir</h2>
                            {upcomingBookings.length > 0 ? (
                                upcomingBookings.map(booking => (
                                    <ReservationCard key={booking.id} {...booking} />
                                ))
                            ) : (
                                <p className="no-bookings">Aucune réservation à venir.</p>
                            )}
                        </section>

                        <section className="bookings-section">
                            <h2 className="section-title">Passées</h2>
                            {pastBookings.length > 0 ? (
                                pastBookings.map(booking => (
                                    <ReservationCard key={booking.id} {...booking} />
                                ))
                            ) : (
                                <p className="no-bookings">Aucune réservation passée.</p>
                            )}
                        </section>
                    </>
                )}
            </main>
        </div>
    );
};

export default BookingsPage;
