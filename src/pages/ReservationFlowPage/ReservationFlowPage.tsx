import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ReservationFlowPage.css';
import MobileStepper, { type Step } from '../../components/MobileStepper/MobileStepper';
import { useAuth } from '../../context/AuthContext';

export type ReservationState = 'DRAFT' | 'PRE_REGISTERED';

interface TimeSlotDetails {
    id: string;
    room_id: string;
    start_time: string;
    status: string;
    current_players_count: number;
    room_name: string;
    price_json: any;
    duration_minutes: number;
    escape_game_nom: string;
    escape_game_adresse: string;
}

const ReservationFlowPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const slotId = (location.state as any)?.slotId;

    const [status, setStatus] = useState<ReservationState>('DRAFT');
    const [slot, setSlot] = useState<TimeSlotDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slotId) {
            navigate('/');
            return;
        }

        const fetchSlotDetails = async () => {
            try {
                const response = await fetch(`http://localhost:4000/time-slots/${slotId}`);
                if (!response.ok) throw new Error('Failed to fetch slot');
                const data = await response.json();
                setSlot(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSlotDetails();
    }, [slotId, navigate]);

    const isDraft = status === 'DRAFT';
    const isPreRegistered = status === 'PRE_REGISTERED';

    const getPriceRange = (priceObj: any) => {
        if (!priceObj) return 'Prix N/A';
        const prices: number[] = Object.values(priceObj);
        if (prices.length === 0) return 'Prix N/A';
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        return `Entre ${minPrice}€ et ${maxPrice}€ par joueur`;
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' });
    };

    const formatTime = (dateStr: string, duration: number) => {
        const start = new Date(dateStr);
        const end = new Date(start.getTime() + duration * 60000);
        const startStr = start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        const endStr = end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        return `${startStr} - ${endStr}`;
    };

    const steps: Step[] = [
        { title: "Choix de la session" },
        { 
            title: "Préinscription", 
            description: isDraft 
                ? "Tu pourras rejoindre les autres joueurs préinscrits afin de discuter avec eux avant de valider ton inscription."
                : undefined,
            completed: isPreRegistered
        },
        { 
            title: "Paiement",
            description: isPreRegistered 
                ? "Tu pourras payer une fois le nombre minimal de participants préinscrits atteint."
                : undefined
        },
        { title: "Traitement par l'escape game" },
        { title: "Inscription finalisée" }
    ];

    const handleBack = () => navigate(-1);
    
    const handlePreRegister = () => {
        if (!isAuthenticated) {
            navigate('/profile', { state: { from: location.pathname, slotId: slotId } });
            return;
        }
        setStatus('PRE_REGISTERED');
    };

    const handleCancelPreRegistration = () => setStatus('DRAFT');

    if (loading) return <div className="recap-loading">Chargement du récapitulatif...</div>;
    if (!slot) return <div className="recap-error">Erreur lors de la récupération du créneau.</div>;

    return (
        <div className="reservation-flow-page">
            <header className="recap-header">
                <button className="recap-back-button" onClick={handleBack}>
                    <img src="/chevronLeft.svg" alt="Back" />
                </button>
                <h1 className="recap-room-title">{slot.room_name}</h1>
                <h2 className="recap-subtitle">Préinscription</h2>
            </header>

            <main className="recap-content">
                {isPreRegistered && (
                    <>
                        <div className="recap-card validation-card">
                            <span className="validation-text">Préinscription validée</span>
                        </div>

                        <div className="recap-card participants-card">
                            <div className="participants-count-container">
                                <span className="participants-count">{slot.current_players_count}/4</span>
                                <span className="participants-label">participants préinscrits</span>
                            </div>
                            <div className="participants-indicator">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className={`indicator-dot ${i < slot.current_players_count ? 'filled' : 'empty'}`}></div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                <section className="recap-card">
                    <h3 className="card-title">Récap</h3>
                    <div className="recap-details">
                        <div className="recap-row">
                            <img src="/ticket.svg" alt="" className="recap-icon" />
                            <div className="recap-text">
                                <span className="recap-label">Salle</span>
                                <span className="recap-value">{slot.room_name}, {slot.escape_game_nom}</span>
                            </div>
                        </div>
                        <div className="recap-row">
                            <img src="/calendar.svg" alt="" className="recap-icon" />
                            <div className="recap-text">
                                <span className="recap-label">Date</span>
                                <span className="recap-value" style={{ textTransform: 'capitalize' }}>{formatDate(slot.start_time)}</span>
                            </div>
                        </div>
                        <div className="recap-row">
                            <img src="/time.svg" alt="" className="recap-icon"  />
                            <div className="recap-text">
                                <span className="recap-label">Créneau</span>
                                <span className="recap-value">{formatTime(slot.start_time, slot.duration_minutes)}</span>
                            </div>
                        </div>
                        <div className="recap-row">
                            <img src="/price.svg" alt="" className="recap-icon" />
                            <div className="recap-text">
                                <span className="recap-label">Prix</span>
                                <span className="recap-value">{getPriceRange(slot.price_json)}</span>
                            </div>
                        </div>
                        <div className="recap-row">
                            <img src="/users.svg" alt="" className="recap-icon" />
                            <div className="recap-text">
                                <span className="recap-label">Joueurs actuellement préinscrits</span>
                                <span className="recap-value">{slot.current_players_count}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="recap-card process-card">
                    <h3 className="card-title">Processus de réservation</h3>
                    <div className="stepper-container">
                        <MobileStepper steps={steps} currentStep={isDraft ? 1 : 2} />
                    </div>
                </section>

                {isPreRegistered && (
                    <button className="cancel-pre-reg-btn" onClick={handleCancelPreRegistration}>
                        Annuler ma préinscription
                    </button>
                )}
            </main>

            <footer className="recap-footer">
                {isDraft ? (
                    <>
                        <button className="btn-secondary" onClick={handleBack}>Annuler</button>
                        <button className="btn-primary" onClick={handlePreRegister}>Me préinscrire</button>
                    </>
                ) : (
                    <>
                        <button className="btn-copy">
                            <img src="/copy.svg" alt="" className="btn-icon" />
                            Copier le lien
                        </button>
                        <button className="btn-chat">
                            <img src="/chat.svg" alt="" className="btn-icon" />
                            Accéder au chat
                        </button>
                    </>
                )}
            </footer>
        </div>
    );
};

export default ReservationFlowPage;
