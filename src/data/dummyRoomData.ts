import type {Room} from '../types';

export const dummyRoom: Room = {
    title: "Le Mystère de l'Égypte Ancienne",
    category: "Aventure",
    description: "Plongez dans l'univers fascinant de l'Égypte ancienne. Explorez des tombes secrètes, déchiffrez des hiéroglyphes et échappez aux malédictions pour trouver le trésor perdu de Pharaon. Une aventure riche en fouille et réflexion, parfaite pour les explorateurs en herbe.",
    stats: {
        searchLevel: 4,
        thinkingLevel: 5,
        manipulationLevel: 3,
        difficultyLevel: 4,
    },
    duration: 60,
    minPlayers: 3,
    maxPlayers: 6,
    priceRange: "Entre 25€ et 35€",
    isPmrAccessible: false,
    locationName: "Escape Game Central",
    address: "123 Rue de l'Aventure, 75001 Paris",
    coordinates: {
        lat: 48.8566, // Latitude for Paris
        lng: 2.3522,  // Longitude for Paris
    },
    image: "https://via.placeholder.com/1200x800/FF5733/FFFFFF?text=Ancient+Egypt+Room", // Placeholder image
};

export const dummyRoomPMR: Room = {
    title: "L'Énigme du Vieux Manoir",
    category: "Enquête",
    description: "Un manoir abandonné, des secrets oubliés... Parviendrez-vous à résoudre l'énigme qui entoure la disparition de Lord Blackwood ? Une expérience immersive alliant fouille et observation. Accès facile pour tous.",
    stats: {
        searchLevel: 3,
        thinkingLevel: 4,
        manipulationLevel: 2,
        difficultyLevel: 3,
    },
    duration: 90,
    minPlayers: 4,
    maxPlayers: 8,
    priceRange: "Entre 30€ et 40€",
    isPmrAccessible: true,
    locationName: "Mystères & Cie",
    address: "45 Avenue des Secrets, 69002 Lyon",
    coordinates: {
        lat: 45.7597, // Latitude for Lyon
        lng: 4.8422,  // Longitude for Lyon
    },
    image: "https://via.placeholder.com/1200x800/3366FF/FFFFFF?text=Old+Mansion+Room", // Placeholder image
};
