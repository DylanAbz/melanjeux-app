export interface Filters {
    locations: string[];
    themes: string[];
    accessibility: boolean;
    dates: Date[];
    playerCount: number;
}

export interface EscapeGame {
    nom: string;
    adresse: string;
    telephone: string;
    mail: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

export interface RoomSession {
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    bookedCount: number;
    capacity: number;
    isRecommended: boolean;
}

export interface Room {
    id: string;
    title: string;
    image: string;
    category: string;
    description: string;
    searchLevel: number;
    thinkingLevel: number;
    manipulationLevel: number;
    difficultyLevel: number;
    duration: number;
    minPlayers: number;
    maxPlayers: number;
    price: { [participants: number]: number };
    isPmrAccessible: boolean;
    escapeGame: EscapeGame;
}