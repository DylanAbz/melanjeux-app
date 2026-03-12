import React, { useState, useEffect } from 'react';
import './BookingsPage.css';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import ReservationCard from '../../components/ReservationCard/ReservationCard';
import { useNavigate } from 'react-router-dom';
import type {StatusType} from '../../components/StatusBadge/StatusBadge';
import { ensureChatRoomExists } from '../../chatUtils';

interface BookingFromAPI {
    slot_id: string;
    start_time: string;
    slot_status: string;
    current_players_count: number;
    paid_players_count: number;
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
    const { isAuthenticated, token, user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth > 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/time-slot-players/my-bookings`, {
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

                switch (b.slot_status) {
                    case 'empty':
                    case 'filling':
                        statusType = 'WAITING_PLAYERS';
                        statusText = 'En recherche de joueurs';
                        break;
                    case 'payment_pending':
                        statusType = 'WAITING_PAYMENT';
                        statusText = 'En attente de paiement';
                        break;
                    case 'waiting_validation':
                        statusType = 'WAITING_VALIDATION';
                        statusText = 'En attente de validation';
                        break;
                    case 'confirmed':
                    case 'confirmed_by_escape':
                        statusType = 'CONFIRMED';
                        statusText = 'Inscription validée';
                        break;
                    case 'finished':
                        statusType = 'FINISHED';
                        statusText = 'Terminé';
                        break;
                    case 'cancelled':
                        statusType = 'CANCELLED';
                        statusText = 'Annulé';
                        break;
                    default:
                        // Fallback safety
                        if (isPast) {
                            statusType = 'FINISHED';
                            statusText = 'Terminé';
                        }
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
                    paidCount: b.paid_players_count,
                    totalCount: b.current_players_count,
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

    const handleChatClick = async (booking: BookingData) => {
        if (!user) return;
        const success = await ensureChatRoomExists(booking.id, booking.title, user.id);
        if (success) {
            navigate(`/messages/${booking.id}`);
        }
    };

    const handleCardClick = (slotId: string) => {
        navigate('/recap', { state: { slotId } });
    };

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
        <div className={`bookings-page ${isDesktop ? 'desktop' : ''}`}>
            {!isDesktop && <PageHeader title="Réservations" />}
            
            <main className="bookings-content">
                {loading ? (
                    <div className="bookings-loading">Chargement de vos réservations...</div>
                ) : (
                    <>
                        <section className="bookings-section">
                            <h2 className="section-title">À venir</h2>
                            <div className="bookings-grid">
                                {upcomingBookings.length > 0 ? (
                                    upcomingBookings.map(booking => (
                                        <div key={booking.id} onClick={() => handleCardClick(booking.id)} style={{ cursor: 'pointer' }}>
                                            <ReservationCard 
                                                {...booking} 
                                                onChatClick={() => handleChatClick(booking)}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-bookings">Aucune réservation à venir.</p>
                                )}
                            </div>
                        </section>

                        <section className="bookings-section">
                            <h2 className="section-title">Passées</h2>
                            <div className="bookings-grid">
                                {pastBookings.length > 0 ? (
                                    pastBookings.map(booking => (
                                        <div key={booking.id} onClick={() => handleCardClick(booking.id)} style={{ cursor: 'pointer' }}>
                                            <ReservationCard 
                                                {...booking} 
                                                onChatClick={() => handleChatClick(booking)}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-bookings">Aucune réservation passée.</p>
                                )}
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
};

export default BookingsPage;

