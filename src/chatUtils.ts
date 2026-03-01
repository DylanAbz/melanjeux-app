import { doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface ChatRoomInfo {
    id: string;
    roomName: string;
}

export const ensureChatRoomExists = async (slotId: string, roomName: string, userId: string) => {
    try {
        const chatRef = doc(db, 'chats', slotId);
        const chatSnap = await getDoc(chatRef);
        
        if (!chatSnap.exists()) {
            await setDoc(chatRef, {
                roomName: roomName,
                participantIds: [userId],
                lastMessage: "Bienvenue dans le chat de préinscription !",
                lastMessageTimestamp: serverTimestamp(),
                createdAt: serverTimestamp()
            });
        } else {
            const data = chatSnap.data();
            if (!data.participantIds || !data.participantIds.includes(userId)) {
                await updateDoc(chatRef, {
                    participantIds: arrayUnion(userId)
                });
            }
        }
        return true;
    } catch (error) {
        console.error("Erreur lors de la gestion du salon de chat Firestore:", error);
        return false;
    }
};
