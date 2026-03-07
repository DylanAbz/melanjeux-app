import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Room } from '../../types';
import './RoomDetailsPage.css';
import BookingModal from '../../components/BookingModal/BookingModal';

const RoomDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/rooms/${id}`);
                if (!response.ok) throw new Error('Failed to fetch room');
                const data = await response.json();
                setRoom(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRoom();
        }
    }, [id]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const renderStatIcons = (level: number, filledIcon: string, emptyIcon: string) => {
        const maxLevel = 5;
        const icons = [];
        for (let i = 0; i < maxLevel; i++) {
            icons.push(
                <img
                    key={i}
                    src={i < level ? filledIcon : emptyIcon}
                    alt={i < level ? 'filled icon' : 'empty icon'}
                    className="room-details-stat-icon"
                />
            );
        }
        return icons;
    };

    const getPriceRange = (priceObj: { [key: number]: number }) => {
        const prices = Object.values(priceObj);
        if (prices.length === 0) return 'Prix N/A';
        if (prices.length === 1) return `${prices[0]}€ par joueur`;
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        return `Entre ${minPrice}€ et ${maxPrice}€ par joueur`;
    };

    if (loading) {
        return <div className="room-details-loading">Chargement...</div>;
    }

    if (!room) {
        return <div className="room-details-error">Chambre non trouvée.</div>;
    }

    return (
        <div className="room-details-page">
            <button className="room-details-back-button" onClick={handleGoBack}>
                <img src="/chevronLeft.svg" alt="Back" />
            </button>
            
            <div className="room-details-desktop-layout">
                {/* Main Encapsulated Content */}
                <div className="room-details-main-card">
                    {/* Hero Section */}
                    <div className="room-details-hero" style={{ backgroundImage: `url(${room.image})` }}>
                    </div>

                    {/* Content Container */}
                    <div className="room-details-content-container">
                        <header className="room-details-header">
                            <div className="room-details-title-and-category-container">
                                <h1 className="room-details-title">{room.title}</h1>
                                <span className="room-details-category-tag">{room.category}</span>
                            </div>
                            <p className="room-details-description">{room.description}</p>
                        </header>

                        <div className="room-details-separator" />

                        {/* Stats Grid */}
                        <section className="room-details-stats-grid">
                            <div className="room-details-stat-item">
                                <div className="room-details-stat-item-text">
                                    <span className="room-details-stat-label">Fouille</span>
                                    <span className="room-details-stat-note">{room.searchLevel}/5</span>
                                </div>
                                <div className="room-details-stat-icons">
                                    {renderStatIcons(room.searchLevel, '/filledKey.svg', '/emptyKey.svg')}
                                </div>
                            </div>
                            <div className="room-details-stat-item">
                                <div className="room-details-stat-item-text">
                                    <span className="room-details-stat-label">Réflexion</span>
                                    <span className="room-details-stat-note">{room.thinkingLevel}/5</span>
                                </div>
                                <div className="room-details-stat-icons">
                                    {renderStatIcons(room.thinkingLevel, '/filledBrain.svg', '/emptyBrain.svg')}
                                </div>
                            </div>
                            <div className="room-details-stat-item">
                                <div className="room-details-stat-item-text">
                                    <span className="room-details-stat-label">Manipulation</span>
                                    <span className="room-details-stat-note">{room.manipulationLevel}/5</span>
                                </div>
                                <div className="room-details-stat-icons">
                                    {renderStatIcons(room.manipulationLevel, '/filledWrench.svg', '/emptyWrench.svg')}
                                </div>
                            </div>
                            <div className="room-details-stat-item">
                                <div className="room-details-stat-item-text">
                                    <span className="room-details-stat-label">Difficulté</span>
                                    <span className="room-details-stat-note">{room.difficultyLevel}/5</span>
                                </div>
                                <div className="room-details-stat-icons">
                                    {renderStatIcons(room.difficultyLevel, '/filledLock.svg', '/emptyLock.svg')}
                                </div>
                            </div>
                        </section>

                        <div className="room-details-separator" />

                        {/* Practical Info Bar */}
                        <section className="room-details-info-bar">
                            <div className="room-details-info-item">
                                <img src="/time.svg" alt="Durée" />
                                <div className="room-details-info-item-text-container">
                                    <span className="room-details-info-label">Durée</span>
                                    <span className="room-details-info-value">{room.duration} min.</span>
                                </div>
                            </div>
                            <div className="room-details-info-item">
                                <img src="/users.svg" alt="Joueurs" />
                                <div className="room-details-info-item-text-container">
                                    <span className="room-details-info-label">Joueurs</span>
                                    <span className="room-details-info-value">{room.minPlayers} à {room.maxPlayers}</span>
                                </div>
                            </div>
                            <div className="room-details-info-item">
                                <img src="/price.svg" alt="Prix" />
                                <div className="room-details-info-item-text-container">
                                    <span className="room-details-info-label">Prix</span>
                                    <span className="room-details-info-value">{getPriceRange(room.price)}</span>
                                </div>
                            </div>
                            <div className="room-details-info-item">
                                <img src="/handicapped.svg" alt="Accès PMR" />
                                <div className="room-details-info-item-text-container">
                                    <span className="room-details-info-label">Accès PMR</span>
                                    <span className="room-details-info-value">{room.isPmrAccessible ? 'Oui' : 'Non'}</span>
                                </div>
                            </div>
                        </section>

                        {/* Location Section - Hidden on Desktop (moved to sidebar) */}
                        <section className="room-details-location mobile-only">
                            <div className="room-details-separator" />
                            <div className="room-details-location-text-container">
                                <h2 className="room-details-location-name">{room.escapeGame.nom}</h2>
                                <p className="room-details-address">
                                    {room.escapeGame.adresse}<br/>
                                    {room.escapeGame.codePostal} {room.escapeGame.ville}
                                </p>
                            </div>
                            <div className="room-details-map-placeholder">
                                <img
                                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(room.escapeGame.adresse + ' ' + room.escapeGame.codePostal + ' ' + room.escapeGame.ville)}&zoom=15&size=600x300&markers=color:red%7C${encodeURIComponent(room.escapeGame.adresse + ' ' + room.escapeGame.codePostal + ' ' + room.escapeGame.ville)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}`}
                                    alt={`Map of ${room.escapeGame.nom}`}
                                />
                            </div>
                        </section>
                    </div>
                </div>

                {/* Desktop Sidebar Info */}
                <aside className="room-details-sidebar-desktop">
                    <div className="room-details-escape-card">
                        <h2 className="escape-card-name">{room.escapeGame.nom}</h2>
                        <p className="escape-card-address">
                            {room.escapeGame.adresse}<br/>
                            {room.escapeGame.codePostal} {room.escapeGame.ville}
                        </p>
                        <button className="room-details-cta-button desktop-cta" onClick={() => setIsBookingModalOpen(true)}>
                            Réserver un créneau
                        </button>
                    </div>
                </aside>
            </div>

            {/* Mobile Footer */}
            <footer className="room-details-footer mobile-only">
                <button className="room-details-cta-button" onClick={() => setIsBookingModalOpen(true)}>Réserver un créneau</button>
            </footer>

            {room && (
                <BookingModal
                    isOpen={isBookingModalOpen}
                    onClose={() => setIsBookingModalOpen(false)}
                    selectedRoomName={room.title}
                    roomId={room.id}
                />
            )}
        </div>
    );
};

export default RoomDetailsPage;
