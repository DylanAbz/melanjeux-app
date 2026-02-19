export interface Filters {
    locations: string[];
    themes: string[];
    accessibility: boolean;
    dates: Date[];
    playerCount: number;
}

export interface Room {
    title: string;
    category: string;
    description: string;
    stats: {
        searchLevel: number;
        thinkingLevel: number;
        manipulationLevel: number;
        difficultyLevel: number;
    };
    duration: number; // in minutes
    minPlayers: number;
    maxPlayers: number;
    priceRange: string; // e.g., "Entre 20€ et 30€"
    isPmrAccessible: boolean;
    locationName: string;
    address: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    image: string; // URL for the hero image
}