import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ReservationRecapPage.css';
import MobileStepper, {type Step } from '../../components/MobileStepper/MobileStepper';

interface RecapData {
    roomName: string;
    centerName: string;
    date: string;
    timeSlot: string;
    price: string;
    registeredPlayers: number;
}

const ReservationRecapPage: React.FC = () => {
    const navigate = useNavigate();

    // Dummy data for display
    const recapData: RecapData = {
        roomName: "Jurassik Room",
        centerName: "Team Break",
        date: "Jeu. 4 décembre",
        timeSlot: "15:30 - 17:00",
        price: "Entre 20€ et 30€ par joueur",
        registeredPlayers: 2
    };

    const steps: Step[] = [
        { title: "Choix de la session" },
        { 
            title: "Préinscription", 
            description: "Tu pourras rejoindre les autres joueurs préinscrits afin de discuter avec eux avant de valider ton inscription." 
        },
        { title: "Paiement" },
        { title: "Traitement par l'escape game" },
        { title: "Inscription finalisée" }
    ];

    const handleBack = () => navigate(-1);

    return (
        <div className="reservation-recap-page">
            {/* Header */}
            <header className="recap-header">
                <button className="recap-back-button" onClick={handleBack}>
                    <img src="/chevronLeft.svg" alt="Back" />
                </button>
                <h1 className="recap-room-title">{recapData.roomName}</h1>
                <h2 className="recap-subtitle">Préinscription</h2>
            </header>

            <main className="recap-content">
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
                        <MobileStepper steps={steps} currentStep={1} />
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="recap-footer">
                <button className="btn-secondary" onClick={handleBack}>Annuler</button>
                <button className="btn-primary">Me préinscrire</button>
            </footer>
        </div>
    );
};

export default ReservationRecapPage;
