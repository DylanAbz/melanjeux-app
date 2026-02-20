import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookingModal.css';

interface TimeSlot {
    id: string;
    room_id: string;
    start_time: string;
    status: string;
    min_players_override: number | null;
    max_players_override: number | null;
    current_players_count: number;
}

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedRoomName: string;
    roomId: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, selectedRoomName, roomId }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch available dates when modal opens or roomId changes
    useEffect(() => {
        if (isOpen && roomId) {
            const fetchDates = async () => {
                try {
                    const response = await fetch(`http://localhost:4000/time-slots/available-dates?room_id=${roomId}`);
                    if (!response.ok) throw new Error('Failed to fetch dates');
                    const data = await response.json();
                    // Format dates to YYYY-MM-DD to match our calendar logic
                    const formattedDates = data.map((d: string) => d.split('T')[0]);
                    setAvailableDates(formattedDates);
                } catch (err) {
                    console.error('Error fetching available dates:', err);
                }
            };
            fetchDates();
        }
    }, [isOpen, roomId]);

    // Fetch time slots when a date is selected
    useEffect(() => {
        if (selectedDate && roomId) {
            const fetchSlots = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`http://localhost:4000/time-slots?room_id=${roomId}&date=${selectedDate}`);
                    if (!response.ok) throw new Error('Failed to fetch slots');
                    const data = await response.json();
                    setTimeSlots(data);
                } catch (err) {
                    console.error('Error fetching time slots:', err);
                } finally {
                    setLoading(false);
                }
            };
            fetchSlots();
        }
    }, [selectedDate, roomId]);

    if (!isOpen) return null;

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
            setSelectedDate(null);
            setTimeSlots([]);
        } else {
            onClose();
        }
    };

    const handleTimeSlotSelect = (slot: TimeSlot) => {
        // Here we'd typically go to the reservation flow with the slot ID
        console.log('Selected slot:', slot);
        onClose();
        navigate('/recap', { state: { slotId: slot.id } });
    };

    const handleMonthChange = (offset: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
        setViewDate(newDate);
    };

    const handleDateSelect = (dateStr: string) => {
        if (availableDates.includes(dateStr)) {
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
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const isPast = currentCellDate < today;
            const isAvailable = availableDates.includes(dateStr);

            days.push(
                <div key={i} className="calendar-day-wrapper">
                    <button
                        className={`calendar-day ${isAvailable ? 'available' : 'unavailable'} ${selectedDate === dateStr ? 'selected' : ''}`}
                        onClick={() => handleDateSelect(dateStr)}
                        disabled={!isAvailable || isPast}
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
        if (loading) return <div className="loading-slots">Chargement des créneaux...</div>;
        if (!selectedDate) return null;
        
        const [year, month, day] = selectedDate.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        const formattedDate = dateObj.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' });

        return (
            <div className="timeslots-view-container">
                <div className="date-badge-container">
                    <div className="date-badge" style={{ textTransform: 'capitalize' }}>{formattedDate}</div>
                </div>
                <div className="timeslots-scroll-area">
                    <div className="timeslots-list">
                        {timeSlots.map((slot) => {
                            const startTime = new Date(slot.start_time);
                            const timeStr = startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                            const isFull = slot.status === 'full';
                            
                            // Simple recommendation logic: slots with some players but not full
                            const isRecommended = slot.status === 'partially_filled';

                            return (
                                <div 
                                    key={slot.id} 
                                    className={`timeslot-card ${isFull ? 'full' : 'available'}`}
                                    onClick={() => !isFull && handleTimeSlotSelect(slot)}
                                >
                                    {isRecommended && !isFull && (
                                        <div className="timeslot-recommended-banner">Créneau recommandé</div>
                                    )}
                                    <div className="timeslot-card-body">
                                        <span className="timeslot-time">{timeStr}</span>
                                        <div className="timeslot-info">
                                            <span className="timeslot-booked">Inscrit·e·s : {slot.current_players_count}</span>
                                            {/* We don't have max_players directly in slot here, but we could use a default or fetch it */}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {timeSlots.length === 0 && <p>Aucun créneau pour cette date.</p>}
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
