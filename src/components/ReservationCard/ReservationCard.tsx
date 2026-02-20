import React from 'react';
import './ReservationCard.css';
import StatusBadge, {type StatusType } from '../StatusBadge/StatusBadge';
import ParticipantDots from '../ParticipantDots/ParticipantDots';

interface ReservationCardProps {
    title: string;
    datetime: string;
    imageUrl: string;
    statusType: StatusType;
    statusText: string;
    paidCount?: number;
    totalCount?: number;
    currentPlayers?: number;
    minPlayers?: number;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
    title,
    datetime,
    imageUrl,
    statusType,
    statusText,
    paidCount,
    totalCount,
    currentPlayers,
    minPlayers
}) => {
    // Logic to determine what to show in the bottom area
    let showDots = false;
    let dotsFilled = 0;
    let dotsTarget = 0;
    let label = "";
    let fractionText = "";

    if (statusType === 'WAITING_PLAYERS') {
        showDots = true;
        dotsFilled = currentPlayers || 0;
        dotsTarget = minPlayers || 0;
        label = "Participants inscrits";
        fractionText = `${dotsFilled}/${dotsTarget}`;
    } else if (statusType === 'WAITING_PAYMENT') {
        showDots = true;
        dotsFilled = paidCount || 0;
        dotsTarget = totalCount || 0;
        label = "Participants ayant payé";
        fractionText = `${dotsFilled}/${dotsTarget}`;
    } else if (statusType === 'WAITING_VALIDATION') {
        showDots = true;
        dotsFilled = paidCount || 0;
        dotsTarget = paidCount || 0; // All paid
        label = "Paiements validés";
        fractionText = `${dotsFilled}/${dotsTarget}`;
    }

    return (
        <div className="reservation-card" style={{ backgroundImage: `url(${imageUrl})` }}>
            <div className="reservation-card-overlay"></div>
            
            <div className="reservation-card-content">
                <div className="reservation-card-top">
                    <h3 className="reservation-card-title">{title}</h3>
                    <p className="reservation-card-datetime">{datetime}</p>
                    <StatusBadge statusType={statusType} text={statusText} />
                </div>

                {showDots && (
                    <div className="reservation-card-bottom">
                        <span className="payment-label">{label}</span>
                        <span className="payment-fraction">{fractionText}</span>
                        <ParticipantDots filledCount={dotsFilled} totalTarget={dotsTarget} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReservationCard;
