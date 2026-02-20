import React from 'react';
import './ParticipantDots.css';

interface ParticipantDotsProps {
    filledCount: number;
    totalTarget: number;
}

const ParticipantDots: React.FC<ParticipantDotsProps> = ({ filledCount, totalTarget }) => {
    // Logic: if current count exceeds target, show all as filled. 
    // Otherwise show target circles with current filled.
    const displayCount = Math.max(filledCount, totalTarget);
    
    return (
        <div className="participant-dots">
            {[...Array(displayCount)].map((_, i) => (
                <div 
                    key={i} 
                    className={`participant-dot ${i < filledCount ? 'filled' : 'empty'}`}
                ></div>
            ))}
        </div>
    );
};

export default ParticipantDots;
