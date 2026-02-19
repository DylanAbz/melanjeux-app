import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Room } from '../../types';
import './RoomDetailsPage.css';
import { dummyRoom, dummyRoomPMR } from '../../data/dummyRoomData'; // Import dummy data

// Remove RoomDetailsPageProps as room will be fetched internally
const RoomDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // Get ID from URL
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Simulate data fetching based on ID
        // In a real app, you would make an API call here.
        // For now, we'll just use dummy data.
        let fetchedRoom: Room | null = null;
        if (id === '1') { // Example: use ID to pick dummy room
            fetchedRoom = dummyRoom;
        } else if (id === '2') {
            fetchedRoom = dummyRoomPMR;
        } else {
            fetchedRoom = dummyRoom; // Default to dummyRoom if ID is not 1 or 2
        }

        setTimeout(() => { // Simulate network delay
            setRoom(fetchedRoom);
            setLoading(false);
        }, 500);
    }, [id]); // Re-run when ID changes

    const handleGoBack = () => {
        navigate(-1); // Go back to the previous page
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

    if (loading) {
        return <div className="room-details-loading">Chargement...</div>; // Simple loading indicator
    }

    if (!room) {
        return <div className="room-details-error">Chambre non trouvée.</div>; // Handle room not found
    }

    return (
        <div className="room-details-page">
            {/* Hero Section */}
            <div className="room-details-hero" style={{ backgroundImage: `url(${room.image})` }}>
                <button className="room-details-back-button" onClick={handleGoBack}>
                    <img src="/arrow-left.svg" alt="Back" />
                </button>
            </div>

            {/* Main Content Container */}
            <div className="room-details-content-container">
                {/* Header */}
                <header className="room-details-header">
                    <h1 className="room-details-title">{room.title}</h1>
                    <span className="room-details-category-tag">{room.category}</span>
                    <p className="room-details-description">{room.description}</p>
                </header>

                {/* Stats Grid */}
                <section className="room-details-stats-grid">
                    <div className="room-details-stat-item">
                        <span className="room-details-stat-label">Fouille</span>
                        <span className="room-details-stat-note">{room.stats.searchLevel}/5</span>
                        <div className="room-details-stat-icons">
                            {renderStatIcons(room.stats.searchLevel, '/filledKey.svg', '/emptyKey.svg')}
                        </div>
                    </div>
                    <div className="room-details-stat-item">
                        <span className="room-details-stat-label">Réflexion</span>
                        <span className="room-details-stat-note">{room.stats.thinkingLevel}/5</span>
                        <div className="room-details-stat-icons">
                            {renderStatIcons(room.stats.thinkingLevel, '/filledBrain.svg', '/emptyBrain.svg')}
                        </div>
                    </div>
                    <div className="room-details-stat-item">
                        <span className="room-details-stat-label">Manipulation</span>
                        <span className="room-details-stat-note">{room.stats.manipulationLevel}/5</span>
                        <div className="room-details-stat-icons">
                            {renderStatIcons(room.stats.manipulationLevel, '/filledWrench.svg', '/emptyWrench.svg')}
                        </div>
                    </div>
                    <div className="room-details-stat-item">
                        <span className="room-details-stat-label">Difficulté</span>
                        <span className="room-details-stat-note">{room.stats.difficultyLevel}/5</span>
                        <div className="room-details-stat-icons">
                            {renderStatIcons(room.stats.difficultyLevel, '/filledLock.svg', '/emptyLock.svg')}
                        </div>
                    </div>
                </section>

                {/* Practical Info Bar */}
                <section className="room-details-info-bar">
                    <div className="room-details-info-item">
                        <img src="/time.svg" alt="Durée" />
                        <span>{room.duration} min.</span>
                    </div>
                    <div className="room-details-info-item">
                        <img src="/users.svg" alt="Joueurs" />
                        <span>{room.minPlayers} à {room.maxPlayers}</span>
                    </div>
                    <div className="room-details-info-item">
                        <img src="/price.svg" alt="Prix" />
                        <span>{room.priceRange}</span>
                    </div>
                    <div className="room-details-info-item">
                        <img src="/handicapped.svg" alt="Accès PMR" />
                        <span>{room.isPmrAccessible ? 'Oui' : 'Non'}</span>
                    </div>
                </section>

                {/* Location Section */}
                <section className="room-details-location">
                    <h2 className="room-details-location-name">{room.locationName}</h2>
                    <p className="room-details-address">{room.address}</p>
                    <div className="room-details-map-placeholder">
                        {room.coordinates && (
                            <img
                                src={`https://maps.googleapis.com/maps/api/staticmap?center=${room.coordinates.lat},${room.coordinates.lng}&zoom=14&size=600x300&markers=color:red%7C${room.coordinates.lat},${room.coordinates.lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
                                alt={`Map of ${room.locationName}`}
                            />
                        )}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="room-details-footer">
                <button className="room-details-cta-button">Réserver un créneau</button>
            </footer>
        </div>
    );
};

export default RoomDetailsPage;