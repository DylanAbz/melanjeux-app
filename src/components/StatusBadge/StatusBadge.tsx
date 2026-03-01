import React from 'react';
import './StatusBadge.css';

export type StatusType = 'WAITING_PLAYERS' | 'WAITING_VALIDATION' | 'WAITING_PAYMENT' | 'CONFIRMED' | 'FINISHED' | 'CANCELLED';

interface StatusBadgeProps {
    statusType: StatusType;
    text: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ statusType, text }) => {
    return (
        <div className={`status-badge ${statusType.toLowerCase().replace('_', '-')}`}>
            <span className="status-dot"></span>
            <span className="status-text">{text}</span>
        </div>
    );
};

export default StatusBadge;
