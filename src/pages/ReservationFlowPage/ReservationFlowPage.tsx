import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReservationFlowPage.css';
import MobileStepper, { type Step } from '../../components/MobileStepper/MobileStepper';

export type ReservationState = 'DRAFT' | 'PRE_REGISTERED';

interface ReservationFlowPageProps {
    reservationState?: ReservationState;
}

interface RecapData {
    roomName: string;
    centerName: string;
    date: string;
    timeSlot: string;
    price: string;
    registeredPlayers: number;
}

const ReservationFlowPage: React.FC<ReservationFlowPageProps> = ({ reservationState: initialStatus = 'DRAFT' }) => {
    const navigate = useNavigate();
    const [status, setStatus] = useState<ReservationState>(initialStatus);

    const isDraft = status === 'DRAFT';
    const isPreRegistered = status === 'PRE_REGISTERED';

    // Dummy data for display
    const recapData: RecapData = {
        roomName: "Jurassik Room",
        centerName: "Team Break",
        date: "Jeu. 4 décembre",
        timeSlot: "15:30 - 17:00",
        price: "Entre 20€ et 30€ par joueur",
        registeredPlayers: isDraft ? 2 : 3
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
    const handlePreRegister = () => setStatus('PRE_REGISTERED');
    const handleCancelPreRegistration = () => setStatus('DRAFT');

    return (
        <div className="reservation-flow-page">
            {/* Header */}
            <header className="recap-header">
                <button className="recap-back-button" onClick={handleBack}>
                    <img src="/chevronLeft.svg" alt="Back" />
                </button>
                <h1 className="recap-room-title">{recapData.roomName}</h1>
                <h2 className="recap-subtitle">Préinscription</h2>
            </header>

            <main className="recap-content">
                {isPreRegistered && (
                    <>
                        {/* New Card: Validation */}
                        <div className="recap-card validation-card">
                            <span className="validation-text">Préinscription validée</span>
                        </div>

                        {/* New Card: Participants */}
                        <div className="recap-card participants-card">
                            <div className="participants-count-container">
                                <span className="participants-count">3/4</span>
                                <span className="participants-label">participants préinscrits</span>
                            </div>
                            <div className="participants-indicator">
                                <div className="indicator-dot filled"></div>
                                <div className="indicator-dot filled"></div>
                                <div className="indicator-dot filled"></div>
                                <div className="indicator-dot empty"></div>
                            </div>
                        </div>
                    </>
                )}

                {/* Card 1: Récap */}
                <section className="recap-card">
                    <h3 className="card-title">Récap</h3>
                    <div className="recap-details">
                        <div className="recap-row">
                            <img src="/ticket.svg" alt="" className="recap-icon" />
                            <div className="recap-text">
                                <span className="recap-label">Salle</span>
                                <span className="recap-value">{recapData.roomName}, {recapData.centerName}</span>
                            </div>
                        </div>
                        <div className="recap-row">
                            <img src="/calendar.svg" alt="" className="recap-icon" />
                            <div className="recap-text">
                                <span className="recap-label">Date</span>
                                <span className="recap-value">{recapData.date}</span>
                            </div>
                        </div>
                        <div className="recap-row">
                            <img src="/time.svg" alt="" className="recap-icon"  />
                            <div className="recap-text">
                                <span className="recap-label">Créneau</span>
                                <span className="recap-value">{recapData.timeSlot}</span>
                            </div>
                        </div>
                        <div className="recap-row">
                            <img src="/price.svg" alt="" className="recap-icon" />
                            <div className="recap-text">
                                <span className="recap-label">Prix</span>
                                <span className="recap-value">{recapData.price}</span>
                            </div>
                        </div>
                        <div className="recap-row">
                            <img src="/users.svg" alt="" className="recap-icon" />
                            <div className="recap-text">
                                <span className="recap-label">Joueurs actuellement préinscrits</span>
                                <span className="recap-value">{recapData.registeredPlayers}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Card 2: Processus */}
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

            {/* Footer */}
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
