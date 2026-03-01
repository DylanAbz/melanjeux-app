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
}

const MessagesListPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [chats, setChats] = useState<ChatRoom[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        // Requête pour écouter les changements en temps réel sur la collection "chats"
        // où l'utilisateur actuel est un participant.
        const chatsRef = collection(db, 'chats');
        const q = query(
            chatsRef,
            where('participantIds', 'array-contains', user.id),
            orderBy('lastMessageTimestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ChatRoom[];
            setChats(chatList);
            setLoading(false);
        }, (error) => {
            console.error("Erreur lors de la récupération des chats:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

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
                        <div className="message-info">
                            <span className="room-name">{chat.roomName}</span>
                            <span className="last-message">
                                {chat.lastMessage.length > 35 
                                    ? chat.lastMessage.substring(0, 35) + '...' 
                                    : chat.lastMessage}
                            </span>
                        </div>
                        <div className="message-date">
                            {formatDate(chat.lastMessageTimestamp)}
                        </div>
                    </div>
                ))}
            </div>
            {/* La BottomBar est gérée par App.tsx */}
        </div>
    );
};

export default MessagesListPage;
