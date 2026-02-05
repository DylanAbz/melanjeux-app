import React from 'react';
import './RoomCard.css';

interface RoomCardProps {
    imageUrl?: string;
    title: string;
    subtitle: string;
    location: string;
}

const DEFAULT_IMAGE = '/public/booking.svg'; // Using an existing image as default for demonstration

const RoomCard: React.FC<RoomCardProps> = ({ imageUrl, title, subtitle, location }) => {
    const backgroundStyle = {
        backgroundImage: `url(${imageUrl || DEFAULT_IMAGE})`,
    };

    return (
        <div className="room-card" style={backgroundStyle}>
            <div className="room-card-content">
                <div className="room-card-text-group">
                    <h3 className="room-card-title">{title}</h3>
                    <p className="room-card-subtitle">{subtitle}</p>
                </div>
                <div className="room-card-location">
                    <span>{location}</span>
                </div>
            </div>
        </div>
    );
};

export default RoomCard;
