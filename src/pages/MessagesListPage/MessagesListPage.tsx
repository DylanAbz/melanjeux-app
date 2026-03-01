import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import './MessagesListPage.css';

interface ChatRoom {
    id: string;
    roomName: string;
    lastMessage: string;
    lastMessageTimestamp: any;
    roomImage?: string;
    participantIds: string[];
    sessionDate?: string;
}

const MessagesListPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [chats, setChats] = useState<ChatRoom[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !token) {
            setLoading(false);
            return;
        }

        const fetchAndFilterChats = async () => {
            try {
                // 1. Récupérer les réservations SQL
                const bookingsRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/time-slot-players/my-bookings`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (!bookingsRes.ok) throw new Error('Erreur SQL');
                const bookings = await bookingsRes.json();
                // Map des bookings actifs (is_chat_active = true ET date < 24h passée)
                const activeBookingsMap = new Map();
                const now = new Date().getTime();

                bookings.forEach((b: any) => {
                    const startTime = new Date(b.start_time).getTime();
                    const isTooOld = (now - startTime) > (24 * 60 * 60 * 1000);
                    
                    if (b.is_chat_active && !isTooOld) {
                        activeBookingsMap.set(b.slot_id, b);
                    }
                });

                // 2. Écouter Firestore
                const chatsRef = collection(db, 'chats');
                const q = query(
                    chatsRef,
                    where('participantIds', 'array-contains', user.id),
                    orderBy('lastMessageTimestamp', 'desc')
                );

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const chatList = snapshot.docs
                        .map(doc => {
                            const data = doc.data();
                            const bookingInfo = activeBookingsMap.get(doc.id);
                            
                            // SI PAS DANS SQL ACTIF -> ON SUPPRIME
                            if (!bookingInfo) return null;

                            return {
                                id: doc.id,
                                ...data,
                                roomName: bookingInfo.room_title,
                                roomImage: bookingInfo.room_image,
                                sessionDate: bookingInfo.start_time
                            };
                        })
                        .filter(chat => chat !== null) as ChatRoom[];
                    
                    setChats(chatList);
                    setLoading(false);
                });

                return unsubscribe;
            } catch (error) {
                console.error("Erreur:", error);
                setLoading(false);
            }
        };

        let unsub: any;
        fetchAndFilterChats().then(u => unsub = u);
        return () => { if (unsub) unsub(); };
    }, [user, token]);

    const handleChatClick = (chatId: string) => {
        navigate(`/messages/${chatId}`);
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className="messages-list-page">
            <PageHeader title="Messages" />
            
            <div className="messages-list-content">
                {loading && <div className="loading-message">Chargement...</div>}
                
                {!loading && chats.length === 0 && (
                    <div className="empty-message">Aucune conversation pour le moment.</div>
                )}

                {chats.map((chat) => (
                    <div key={chat.id} className="message-item" onClick={() => handleChatClick(chat.id)}>
                        <div className="message-avatar">
                            {chat.roomImage ? (
                                <img src={chat.roomImage} alt={chat.roomName} />
                            ) : (
                                <div className="avatar-placeholder">{chat.roomName.charAt(0)}</div>
                            )}
                        </div>
                        <div className="message-main-info">
                            <div className="message-header-row">
                                <span className="room-name">{chat.roomName}</span>
                                <span className="message-date">{formatDate(chat.lastMessageTimestamp)}</span>
                            </div>
                            <span className="last-message">
                                {chat.lastMessage.length > 40 
                                    ? chat.lastMessage.substring(0, 40) + '...' 
                                    : chat.lastMessage}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MessagesListPage;

