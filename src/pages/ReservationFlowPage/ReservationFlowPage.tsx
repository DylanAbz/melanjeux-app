import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ReservationFlowPage.css';
import MobileStepper, { type Step } from '../../components/MobileStepper/MobileStepper';
import { useAuth } from '../../context/AuthContext';
import ParticipantDots from '../../components/ParticipantDots/ParticipantDots';
import CancelReservationModal from '../../components/CancelReservationModal/CancelReservationModal';
import Modal from '../../components/Modal/Modal';
import { ensureChatRoomExists } from '../../chatUtils';

export type ReservationState = 'DRAFT' | 'PRE_REGISTERED' | 'PAYMENT_PENDING' | 'PAID' | 'WAITING_VALIDATION' | 'CONFIRMED';

interface TimeSlotDetails {
    id: string;
    room_id: string;
    start_time: string;
    status: string;
    current_players_count: number;
    paid_players_count: number;
    room_name: string;
    price_json: any;
    duration_minutes: number;
    min_players: number;
    max_players: number;
    escape_game_nom: string;
    escape_game_adresse: string;
}

const ReservationFlowPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, token, user } = useAuth();
    const slotId = (location.state as any)?.slotId;

    const [status, setStatus] = useState<ReservationState>('DRAFT');
    const [slot, setSlot] = useState<TimeSlotDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    // Modals states
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showPaymentUI, setShowPaymentUI] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);

    // Mock Card state
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth > 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchSlotDetails = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/time-slots/${slotId}`);
            if (!response.ok) throw new Error('Failed to fetch slot');
            const data = await response.json();
            setSlot(data);

            if (isAuthenticated && token && user) {
                const playersRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/time-slot-players/by-slot/${slotId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (playersRes.ok) {
                    const players = await playersRes.json();
                    const me = players.find((p: any) => p.user_id === user?.id && p.status !== 'cancelled');
                    
                    if (me) {
                        if (data.status === 'confirmed' || data.status === 'confirmed_by_escape') {
                            setStatus('CONFIRMED');
                        } else if (data.status === 'waiting_validation') {
                            setStatus('WAITING_VALIDATION');
                        } else if (me.status === 'paid') {
                            setStatus('PAID');
                        } else if (data.status === 'payment_pending') {
                            setStatus('PAYMENT_PENDING');
                        } else {
                            setStatus('PRE_REGISTERED');
                        }
                        
                        // On s'assure que le chat existe s'il est déjà inscrit
                        await ensureChatRoomExists(data.id, data.room_name, user.id);
                    } else {
                        setStatus('DRAFT');
                    }
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!slotId) {
            navigate('/');
            return;
        }
        fetchSlotDetails();
    }, [slotId, navigate, isAuthenticated, token, user?.id]);

    const isDraft = status === 'DRAFT';
    const isPreRegistered = status === 'PRE_REGISTERED';
    const isPaymentPending = status === 'PAYMENT_PENDING';
    const isPaid = status === 'PAID';
    const isWaitingValidation = status === 'WAITING_VALIDATION';
    const isConfirmed = status === 'CONFIRMED';

    const getPriceRange = (priceObj: any) => {
        if (!priceObj) return { min: 0, max: 0, text: 'Prix N/A' };
        const prices: number[] = Object.values(priceObj);
        if (prices.length === 0) return { min: 0, max: 0, text: 'Prix N/A' };
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        return { 
            min: minPrice, 
            max: maxPrice, 
            text: `Entre ${minPrice}€ et ${maxPrice}€ par joueur` 
        };
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
        { title: "Choix de la session", isDone: true },
        { 
            title: "Préinscription", 
            isDone: !isDraft,
            description: isDraft 
                ? "Tu pourras rejoindre les autres joueurs préinscrits afin de discuter avec eux avant de valider ton inscription."
                : undefined
        },
        { 
            title: "Paiement",
            isDone: isPaid || isWaitingValidation || isConfirmed,
            showDescriptionIfDone: isPaid || isWaitingValidation,
            description: isPreRegistered 
                ? "Tu pourras payer une fois le nombre minimal de participants préinscrits atteint."
                : isPaymentPending
                    ? "Le nombre minimal de participants est atteint, tu peux procéder au paiement."
                    : (isPaid || isWaitingValidation || isConfirmed)
                        ? "Ton paiement est validé. Une fois que tous les participants auront réglé, le centre d'escape game pourra valider la session."
                        : undefined
        },
        { 
            title: "Traitement par l'escape game",
            isDone: isConfirmed,
            description: isWaitingValidation 
                ? "Tu as terminé le processus d'inscription. \nLe centre d’escape games doit maintenant valider la session."
                : undefined
        },
        { 
            title: "Inscription finalisée",
            isDone: isConfirmed,
            description: isConfirmed 
                ? "Le centre d'escape game a validé la session. Tu peux partir à l'aventure avec ton équipe !"
                : undefined
        }
    ];

    const handleBack = () => {
        if (showPaymentUI) {
            setShowPaymentUI(false);
        } else {
            navigate(-1);
        }
    };

    const handlePreRegister = async () => {
        if (!isAuthenticated || !user) {
            navigate('/profile', { state: { from: location.pathname, slotId: slotId } });
            return;
        }

        setActionLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/time-slot-players/join`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ time_slot_id: slotId })
            });

            if (response.ok) {
                if (slot) {
                    await ensureChatRoomExists(slot.id, slot.room_name, user.id);
                }
                await fetchSlotDetails();
            } else {
                const data = await response.json();
                alert(data.error || "Erreur lors de la préinscription");
            }
        } catch (err) {
            alert("Erreur de connexion au serveur");
        } finally {
            setActionLoading(false);
        }
    };

    const handleOpenChat = async () => {
        if (!slot || !user) return;
        setActionLoading(true);
        try {
            await ensureChatRoomExists(slot.id, slot.room_name, user.id);
            navigate(`/messages/${slot.id}`);
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancelPreRegistration = () => {
        setIsCancelModalOpen(true);
    };

    const handleConfirmCancel = async () => {
        setActionLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/time-slot-players/leave`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ time_slot_id: slotId })
            });

            if (response.ok) {
                setIsCancelModalOpen(false);
                navigate('/', { state: { showCancelSuccess: true } });
            } else {
                const data = await response.ok ? null : await response.json();
                alert(data?.error || "Erreur lors de l'annulation");
            }
        } catch (err) {
            alert("Erreur de connexion au serveur");
        } finally {
            setActionLoading(false);
        }
    };

    const handleStartPayment = () => {
        setShowInfoModal(true);
    };

    const handleContinueToPayment = () => {
        setShowInfoModal(false);
        setShowPaymentUI(true);
    };

    const handleMockPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessingPayment(true);
        
        // Simuler un délai de traitement
        setTimeout(async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/time-slot-players/pay`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ time_slot_id: slotId })
                });

                if (response.ok) {
                    setIsProcessingPayment(false);
                    setShowPaymentSuccessModal(true);
                } else {
                    alert("Erreur lors du paiement simulé");
                    setIsProcessingPayment(false);
                }
            } catch (err) {
                alert("Erreur de connexion");
                setIsProcessingPayment(false);
            }
        }, 2000);
    };

    if (loading) return <div className="recap-loading">Chargement du récapitulatif...</div>;
    if (!slot) return <div className="recap-error">Erreur lors de la récupération du créneau.</div>;

    const priceRange = getPriceRange(slot.price_json);

    if (showPaymentUI) {
        return (
            <div className="reservation-flow-page payment-ui">
                <header className="recap-header">
                    <button className="recap-back-button" onClick={handleBack}>
                        <img src="/chevronLeft.svg" alt="Back" />
                    </button>
                    <h1 className="recap-room-title">Paiement</h1>
                </header>
                <main className="recap-content">
                    <form className="stripe-mock-form" onSubmit={handleMockPayment}>
                        <div className="form-group">
                            <label>Numéro de carte</label>
                            <input 
                                type="text" 
                                placeholder="ex. : 1234 4567 8901 2345" 
                                value={cardNumber}
                                onChange={e => setCardNumber(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Expiration (MM/AA)</label>
                                <input 
                                    type="text" 
                                    placeholder="ex. : 04/30" 
                                    value={expiry}
                                    onChange={e => setExpiry(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>CVC</label>
                                <input 
                                    type="text" 
                                    placeholder="ex. : 1234" 
                                    value={cvc}
                                    onChange={e => setCvc(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Nom du titulaire de la carte</label>
                            <input 
                                type="text" 
                                placeholder="ex. : Marie Dupont" 
                                value={cardName}
                                onChange={e => setCardName(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="payment-footer-fixed">
                            <button type="submit" className="btn-primary" disabled={isProcessingPayment}>
                                {isProcessingPayment ? "Traitement..." : "Valider"}
                            </button>
                        </div>
                    </form>
                </main>

                <Modal isOpen={isProcessingPayment} onClose={() => {}} noCloseButton>
                    <div className="payment-processing-modal">
                        <h3>Paiement en cours</h3>
                        <div className="spinner"></div>
                    </div>
                </Modal>

                <Modal isOpen={showPaymentSuccessModal} onClose={() => {}} noCloseButton>
                    <div className="payment-success-modal">
                        <div className="success-icon-circle">
                            <img src="/check.svg" alt="Success" />
                        </div>
                        <h3>Paiement validé</h3>
                        <p>Ton moyen de paiement est validé. Tu seras prélevé uniquement lorsque toute l'équipe sera inscrite et que l'escape game aura confirmé ta participation.</p>
                        <button className="btn-secondary" onClick={() => {
                            setShowPaymentSuccessModal(false);
                            setShowPaymentUI(false);
                            fetchSlotDetails();
                        }}>J'ai compris</button>
                    </div>
                </Modal>
            </div>
        );
    }

    // Determine current step index for the stepper
    let currentStepIndex = 2; // Default for PRE_REGISTERED, PAYMENT_PENDING, PAID
    if (isDraft) currentStepIndex = 1;
    else if (isConfirmed) currentStepIndex = 4;
    else if (isWaitingValidation) currentStepIndex = 3;

    return (
        <div className={`reservation-flow-page ${isDesktop ? 'desktop' : ''}`}>
            <div className="reservation-flow-container">
                <header className="recap-header">
                    <button className="recap-back-button" onClick={handleBack}>
                        <img src="/chevronLeft.svg" alt="Back" />
                    </button>
                    <div className="recap-title-container">
                        <h1 className="recap-room-title">{slot.room_name}</h1>
                        <h2 className="recap-subtitle">{isPaymentPending ? "Paiement" : isConfirmed ? "Inscription validée" : (isPaid || isWaitingValidation) ? "Attente validation" : "Préinscription"}</h2>
                    </div>
                </header>

                <main className="recap-content">
                    {(isPreRegistered || isPaymentPending || isPaid || isWaitingValidation || isConfirmed) && (
                        <>
                            <div className={`recap-card validation-card ${(isPaid || isWaitingValidation || isConfirmed) ? 'paid' : ''}`}>
                                <span className="validation-text">
                                    {isConfirmed ? "Inscription validée" : (isPaid || isWaitingValidation) ? "Paiement validé" : "Préinscription validée"}
                                </span>
                            </div>

                            <div className="recap-card participants-card">
                                <div className="participants-count-container">
                                    {(isPaid || isWaitingValidation || isConfirmed) ? (
                                        <>
                                            <span className={`participants-count ${(isConfirmed || slot.paid_players_count === slot.current_players_count) ? 'success' : ''}`}>
                                                {isConfirmed ? slot.current_players_count : slot.paid_players_count}/{slot.current_players_count}
                                            </span>
                                            <span className="participants-label">participants ayant réglé</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="participants-count">{slot.current_players_count}/{slot.min_players}</span>
                                            <span className="participants-label">participants préinscrits</span>
                                        </>
                                    )}
                                </div>
                                <div className="participants-indicator">
                                    <ParticipantDots 
                                        filledCount={(isPaid || isWaitingValidation || isConfirmed) ? (isConfirmed ? slot.current_players_count : slot.paid_players_count) : slot.current_players_count} 
                                        totalTarget={(isPaid || isWaitingValidation || isConfirmed) ? slot.current_players_count : slot.min_players} 
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <section className="recap-card">
                        <h3 className="card-title">Récap</h3>
                        <div className="recap-details">
                            <div className="recap-grid-desktop">
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
                                        <span className="recap-value">{priceRange.text}</span>
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
                        </div>
                    </section>

                    <section className="recap-card process-card">
                        <h3 className="card-title">Processus de réservation</h3>
                        <div className="stepper-container">
                            <MobileStepper 
                                steps={steps} 
                                currentStep={currentStepIndex} 
                                direction={isDesktop ? 'horizontal' : 'vertical'} 
                            />
                        </div>
                    </section>

                    {(isPreRegistered || isPaymentPending) && (
                        <button 
                            className="cancel-pre-reg-btn" 
                            onClick={handleCancelPreRegistration}
                            disabled={actionLoading}
                        >
                            {actionLoading ? "Chargement..." : "Annuler ma préinscription"}
                        </button>
                    )}

                    {(isPaid || isWaitingValidation || isConfirmed) && (
                        <button className="cancel-pre-reg-btn" style={{ background: '#6D6D6D' }} onClick={() => navigate('/')}>
                            Quitter
                        </button>
                    )}
                </main>

                <footer className="recap-footer">
                    {isDraft ? (
                        <>
                            <button className="btn-secondary" onClick={handleBack}>Annuler</button>
                            <button 
                                className="btn-primary" 
                                onClick={handlePreRegister}
                                disabled={actionLoading}
                            >
                                {actionLoading ? "Chargement..." : "Me préinscrire"}
                            </button>
                        </>
                    ) : isPaymentPending ? (
                        <div className="payment-actions">
                            <div className="action-buttons-row">
                                <button 
                                    className="btn-icon-circle" 
                                    onClick={handleOpenChat}
                                    disabled={actionLoading || (slot?.current_players_count || 0) < 2}
                                    style={{ opacity: (slot?.current_players_count || 0) < 2 ? 0.5 : 1 }}
                                >
                                    <img src="/chat_black.svg" alt="Chat" />
                                </button>
                                <button className="btn-icon-circle">
                                    <img src="/share.svg" alt="Share"  />
                                </button>
                                <button className="btn-primary flex-1" onClick={handleStartPayment}>
                                    Payer
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <button className="btn-copy">
                                <img src="/copy.svg" alt="" className="btn-icon" />
                                Copier le lien
                            </button>
                            <button 
                                className="btn-chat" 
                                onClick={handleOpenChat} 
                                disabled={actionLoading || (slot?.current_players_count || 0) < 2}
                                title={(slot?.current_players_count || 0) < 2 ? "Le chat s'activera dès qu'un autre joueur rejoindra le créneau" : ""}
                            >
                                <img src="/chat.svg" alt="" className="btn-icon" />
                                {(slot?.current_players_count || 0) < 2 ? "Chat (attente joueurs)" : "Accéder au chat"}
                            </button>
                        </>
                    )}
                </footer>
            </div>

            <CancelReservationModal 
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleConfirmCancel}
                isLoading={actionLoading}
            />

            <Modal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)}>
                <div className="payment-info-modal">
                    <h2>Avant de continuer</h2>
                    <p>Le prix par personne est variable et sera compris entre {priceRange.min}€ et {priceRange.max}€, selon le nombre final de participants.</p>
                    <p>Aucun montant ne sera débité immédiatement.</p>
                    <p>Ta carte sera utilisée uniquement pour une autorisation de paiement.</p>
                    <p>Le débit interviendra uniquement si le nombre minimum de joueurs est atteint et que la session est confirmée par l'escape game.</p>
                    <p>Si la session n'est pas validée, aucun montant ne sera prélevé.</p>
                    <p>En poursuivant, tu acceptes ces conditions.</p>
                    
                    <div className="modal-actions-row">
                        <button className="btn-secondary" onClick={() => setShowInfoModal(false)}>Annuler</button>
                        <button className="btn-primary" onClick={handleContinueToPayment}>Continuer</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ReservationFlowPage;


