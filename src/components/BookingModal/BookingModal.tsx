import React, { useState } from 'react';
import './BookingModal.css';
import { dummySessions } from '../../data/dummyRoomData';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedRoomName: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, selectedRoomName }) => {
    const [step, setStep] = useState(1);
    const [viewDate, setViewDate] = useState(new Date()); // The month we're viewing
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        } else {
            onClose();
        }
    };

    const handleMonthChange = (offset: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
        setViewDate(newDate);
    };

    const handleDateSelect = (dateStr: string) => {
        const dateSessions = dummySessions.filter(s => s.date === dateStr);
        if (dateSessions.length > 0) {
            setSelectedDate(dateStr);
            setStep(2);
        }
    };

    const renderCalendar = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const monthName = viewDate.toLocaleDateString('fr-FR', { month: 'long' });
        
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const adjustedFirstDay = (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const days = [];
        for (let i = 0; i < adjustedFirstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day-wrapper"><div className="calendar-day outside"></div></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const currentCellDate = new Date(year, month, i);
            // Format YYYY-MM-DD manually to avoid timezone issues
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const isPast = currentCellDate < today;
            
            const daySessions = dummySessions.filter(s => s.date === dateStr);
            const isAvailable = !isPast && daySessions.some(s => s.bookedCount < s.capacity);

            days.push(
                <div key={i} className="calendar-day-wrapper">
                    <button
                        className={`calendar-day ${isAvailable ? 'available' : 'unavailable'} ${selectedDate === dateStr ? 'selected' : ''}`}
                        onClick={() => handleDateSelect(dateStr)}
                        disabled={!isAvailable}
                    >
                        {i}
                    </button>
                </div>
            );
        }

        return (
            <div className="calendar-container">
                <div className="calendar-month-nav">
                    <button 
                        className="calendar-month-btn" 
                        onClick={() => handleMonthChange(-1)}
                        disabled={viewDate.getMonth() === today.getMonth() && viewDate.getFullYear() === today.getFullYear()}
                    >
                        {"<"}
                    </button>
                    <span style={{ textTransform: 'capitalize' }}>{monthName} {year}</span>
                    <button 
                        className="calendar-month-btn" 
                        onClick={() => handleMonthChange(1)}
                    >
                        {">"}
                    </button>
                </div>
                <div className="calendar-weekdays">
                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, idx) => (
                        <span key={idx} className="calendar-weekday">{d}</span>
                    ))}
                </div>
                <div className="calendar-grid">
                    {days}
                </div>
                <div className="calendar-legend">
                    <div className="legend-item">
                        <div className="legend-dot peach"></div>
                        <span>Créneau(x) disponible(s) sur ce jour</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-dot grey"></div>
                        <span>Aucun créneau disponible sur ce jour</span>
                    </div>
                </div>
            </div>
        );
    };

    const renderTimeSlots = () => {
        if (!selectedDate) return null;
        
        const [year, month, day] = selectedDate.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        const formattedDate = dateObj.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' });
        const dateSessions = dummySessions.filter(s => s.date === selectedDate);

        // Calculate recommended slot: most booked but not full
        const availableSlots = dateSessions.filter(s => s.bookedCount < s.capacity);
        const maxBooked = Math.max(...availableSlots.map(s => s.bookedCount), -1);
        const recommendedTime = maxBooked > 0 
            ? availableSlots.find(s => s.bookedCount === maxBooked)?.time 
            : null;

        return (
            <div className="timeslots-view-container">
                <div className="date-badge-container">
                    <div className="date-badge" style={{ textTransform: 'capitalize' }}>{formattedDate}</div>
                </div>
                <div className="timeslots-scroll-area">
                    <div className="timeslots-list">
                        {dateSessions.map((slot, index) => {
                            const isFull = slot.bookedCount === slot.capacity;
                            const isRecommended = slot.time === recommendedTime;

                            return (
                                <div key={index} className={`timeslot-card ${isFull ? 'full' : 'available'}`}>
                                    {isRecommended && !isFull && (
                                        <div className="timeslot-recommended-banner">Créneau recommandé</div>
                                    )}
                                    <div className="timeslot-card-body">
                                        <span className="timeslot-time">{slot.time}</span>
                                        <div className="timeslot-info">
                                            <span className="timeslot-booked">Inscrit·e·s : {slot.bookedCount}</span>
                                            <span className="timeslot-remaining">Restant : {slot.capacity - slot.bookedCount}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="booking-modal-overlay">
            <header className="booking-modal-header">
                <button className="booking-modal-back-button" onClick={handleBack}>
                    <img src="/chevronLeft.svg" alt="Back" />
                </button>
                <h2 className="booking-modal-title">{selectedRoomName}</h2>
                <span className="booking-modal-subtitle">
                    {step === 1 ? "Choisissez votre date" : "Choisissez votre créneau"}
                </span>
            </header>

            <main className="booking-modal-content">
                {step === 1 ? renderCalendar() : renderTimeSlots()}
            </main>

            <footer className="booking-modal-footer">
                <button className="btn-cancel" onClick={onClose}>Annuler</button>
            </footer>
        </div>
    );
};

export default BookingModal;
