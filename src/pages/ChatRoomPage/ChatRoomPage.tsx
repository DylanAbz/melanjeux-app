import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    collection, 
    query, 
    orderBy, 
    onSnapshot, 
    addDoc, 
    serverTimestamp, 
    doc, 
    getDoc,
    updateDoc,
} from 'firebase/firestore';
import type {
    QuerySnapshot,
    DocumentData,
    QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import './ChatRoomPage.css';

interface Message {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    createdAt: any;
}

const ChatRoomPage: React.FC = () => {
    const { chatId } = useParams<{ chatId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [roomName, setRoomName] = useState('Chargement...');
    const [isChatActive, setIsChatActive] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Récupérer les infos de la salle depuis le backend
    useEffect(() => {
        if (!chatId) return;
        const fetchSlotInfo = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/time-slots/${chatId}`);
                if (res.ok) {
                    const data = await res.json();
                    setRoomName(data.room_name);
                    setIsChatActive(data.is_chat_active);
                } else {
                    // Fallback sur Firestore si le backend échoue
                    const chatRef = doc(db, 'chats', chatId);
                    const chatSnap = await getDoc(chatRef);
                    if (chatSnap.exists()) {
                        setRoomName(chatSnap.data().roomName);
                    }
                }
            } catch (error) {
                console.error("Erreur fetching slot info:", error);
            }
        };
        fetchSlotInfo();
    }, [chatId]);

    // Écouter les messages en temps réel
    useEffect(() => {
        if (!chatId) return;

        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
            const msgs = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
                id: doc.id,
                ...doc.data()
            })) as Message[];
            setMessages(msgs);
            scrollToBottom();
        });

        return () => unsubscribe();
    }, [chatId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !chatId || !isChatActive) return;

        const messageText = newMessage;
        setNewMessage('');

        try {
            // Utiliser le pseudo ou le prénom de l'utilisateur
            const senderDisplayName = user.pseudo || user.firstName || 'Anonyme';

            // Ajouter le message à la sous-collection
            await addDoc(collection(db, 'chats', chatId, 'messages'), {
                text: messageText,
                senderId: String(user.id),
                senderName: senderDisplayName,
                createdAt: serverTimestamp()
            });

            // Mettre à jour le dernier message du chat pour la liste globale
            await updateDoc(doc(db, 'chats', chatId), {
                lastMessage: messageText,
                lastMessageTimestamp: serverTimestamp()
            });
            
        } catch (error) {
            console.error("Erreur d'envoi du message:", error);
        }
    };

    return (
        <div className="chat-room-page">
            {/* Header Fixe */}
            <header className="chat-header">
                <button className="back-button-circle" onClick={() => navigate(-1)}>
                    <img src="/chevronLeft.svg" alt="Retour" />
                </button>
                <h1 className="chat-title">{roomName}</h1>
                <button className="group-button-circle">
                    <img src="/users.svg" alt="Participants" />
                </button>
            </header>

            {/* Zone de messages */}
            <div className="messages-area">
                {messages.map((msg) => {
                    const isMine = String(msg.senderId) === String(user?.id);
                    const time = msg.createdAt ? new Date(msg.createdAt.toDate()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '';

                    return (
                        <div key={msg.id} className={`message-item-container ${isMine ? 'mine' : 'others'}`}>
                            {/* Meta: Nom + Heure */}
                            <div className="message-meta">
                                {!isMine && <span className="sender-name">{msg.senderName}</span>}
                                <span className="message-time">{time}</span>
                            </div>
                            
                            {/* Content: Avatar + Bulle */}
                            <div className="message-content-row">
                                {!isMine && (
                                    <div className="bubble-avatar">
                                        <div className="avatar-circle">
                                            <img src="/user.svg" alt="" />
                                        </div>
                                    </div>
                                )}
                                <div className="message-bubble">
                                    <div className="bubble-text">{msg.text}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
                
                {!isChatActive && (
                    <div className="chat-info-message">
                        Cette conversation est maintenant close.
                    </div>
                )}
            </div>

            {/* Footer de saisie */}
            <footer className="chat-input-area">
                {isChatActive ? (
                    <form className="input-container" onSubmit={handleSendMessage}>
                        <input 
                            type="text" 
                            className="pill-input" 
                            placeholder="Écrire un message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button type="submit" className="send-button">
                            <img src="/send.svg" alt="Envoyer" className="send-icon" />
                        </button>
                    </form>
                ) : (
                    <div className="input-container disabled">
                        <div className="pill-input disabled">Discussion terminée</div>
                    </div>
                )}
            </footer>
        </div>
    );
};

export default ChatRoomPage;
