import type { Room, EscapeGame } from '../types';

const TeamBreak: EscapeGame = {
    nom: "Team Break",
    adresse: "ZAC Neyrpic, 9 Av. Benoît Frachon, 38400 Saint-Martin-d'Hères",
    telephone: "04 XX XX XX XX",
    mail: "contact@TeamBreak.fr",
    coordinates: {
        lat: 45.187,
        lng: 5.756,
    }
};

export const dummyRoom: Room = {
    title: "Le Mystère de l'Égypte Ancienne",
    image: "https://res.cloudinary.com/forescape/image/upload/f_auto,ar_1:1,w_512,c_fill,g_center/uybhzmrbmg6vq3r944ch",
    category: "Aventure",
    description: "Plongez dans l'univers fascinant de l'Égypte ancienne. Explorez des tombes secrètes, déchiffrez des hiéroglyphes et échappez aux malédictions pour trouver le trésor perdu de Pharaon. Une aventure riche en fouille et réflexion, parfaite pour les explorateurs en herbe.",
    searchLevel: 4,
    thinkingLevel: 5,
    manipulationLevel: 3,
    difficultyLevel: 4,
    duration: 60,
    minPlayers: 3,
    maxPlayers: 6,
    price: {
        3: 35,
        4: 30,
        5: 28,
        6: 25
    },
    isPmrAccessible: false,
    escapeGame: TeamBreak
};

export const dummyRoomPMR: Room = {
    title: "L'Énigme du Vieux Manoir",
    image: "https://via.placeholder.com/1200x800/3366FF/FFFFFF?text=Old+Mansion+Room",
    category: "Enquête",
    description: "Un manoir abandonné, des secrets oubliés... Parviendrez-vous à résoudre l'énigme qui entoure la disparition de Lord Blackwood ? Une expérience immersive alliant fouille et observation. Accès facile pour tous.",
    searchLevel: 3,
    thinkingLevel: 4,
    manipulationLevel: 2,
    difficultyLevel: 3,
    duration: 90,
    minPlayers: 4,
    maxPlayers: 8,
    price: {
        4: 32,
        5: 30,
        6: 28,
        7: 26,
        8: 24
    },
    isPmrAccessible: true,
    escapeGame: TeamBreak
};
