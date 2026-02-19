import React, { useState } from 'react';
import './SearchPage.css';
import { SearchBar } from "../../components/SearchBar/SearchBar.tsx";
import FilterButton from "../../components/FilterButton/FilterButton.tsx";
import BottomSheetBar from "../../components/BottomSheetBar/BottomSheetBar.tsx";
import FilterPage from '../FilterPage/FilterPage.tsx';
import RoomCard from "../../components/RoomCard/RoomCard.tsx";
import type { Filters } from "../../types.ts";

const SearchPage: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
      locations: [],
      themes: [],
      accessibility: false,
      dates: [],
      playerCount: 0,
  });

  const handleApplyFilters = (newFilters: Filters) => {
      setFilters(newFilters);
      console.log("Filters applied:", newFilters);
      // Here you would typically trigger a new search/filter of the room list
  };

  const handleOpenFilters = () => {
    setIsFilterOpen(true);
  };

  const handleCloseFilters = () => {
    setIsFilterOpen(false);
    // The FilterPage component will call handleApplyFilters when the sheet closes.
  };

  const calculateActiveFilters = (f: Filters): number => {
      let count = 0;
      if (f.locations.length > 0) count++;
      if (f.themes.length > 0) count++;
      if (f.accessibility) count++;
      if (f.dates.length > 0) count++;
      if (f.playerCount > 0) count++;
      return count;
  };

  const activeFilterCount = calculateActiveFilters(filters);

  return (
    <div className="search-page">
      <div className="search-page-header">
        <h1 className="search-page-title">
          <span>Trouvez votre prochaine mission</span>
        </h1>
        <div className="search-options">
          <SearchBar
            className={"searchbar"}
            placeholder={"Rechercher"}
            autoFocus={false}
            onChange={(value) => {
              console.log(value);
            }}
          />
          <FilterButton onClick={handleOpenFilters} filterCount={activeFilterCount} />
        </div>
      </div>
      <div className="room-card-list-container">
                          <RoomCard
                              imageUrl="https://www.mosl.fr/fr/pylot_bridge/resize_image?mode=tronq&selwidth=800&selheight=800&quality=60&timeToCache=1800&file=https%3A%2F%2Fwww.sitlor.fr%2Fphotos%2F845%2F845160798_6.jpg"
                              title="Le Secret de la Momie de Râ"
                              subtitle="Escape Game Aventures Extrêmes"
                              location="Paris, France, 75001"
                              roomId="le-secret-de-la-momie-de-ra-1"
                          />
                          <RoomCard
                              imageUrl="https://escapegame.imgix.net/64/64b07aff481e6768595364.jpg"
                              title="Le Manoir Hanté de Transylvanie"
                              subtitle="Frissons Garantis Définitivement"
                              location="Lyon, France 69002 Ville très longue"
                              roomId="le-manoir-hante-de-transylvanie-2"
                          />
                          <RoomCard
                              imageUrl="https://www.mosl.fr/fr/pylot_bridge/resize_image?mode=tronq&selwidth=800&selheight=800&quality=60&timeToCache=1800&file=https%3A%2F%2Fwww.sitlor.fr%2Fphotos%2F845%2F845160798_6.jpg"
                              title="L'énigme du Pharaon"
                              subtitle="Aventure Égyptienne"
                              location="Marseille, France"
                              roomId="l-enigme-du-pharaon-3"
                          />
                          <RoomCard
                              imageUrl="https://escapegame.imgix.net/64/64b07aff481e6768595364.jpg"
                              title="La Forêt Oubliée"
                              subtitle="Exploration Nature"
                              location="Bordeaux, France"
                              roomId="la-foret-oubliee-4"
                          />
                          <RoomCard
                              imageUrl="https://www.mosl.fr/fr/pylot_bridge/resize_image?mode=tronq&selwidth=800&selheight=800&quality=60&timeToCache=1800&file=https%3A%2F%2Fwww.sitlor.fr%2Fphotos%2F845%2F845160798_6.jpg"
                              title="Le Mystère de l'Horloge"
                              subtitle="Voyage dans le Temps"
                              location="Toulouse, France"
                              roomId="le-mystere-de-l-horloge-5"
                          />
                          <RoomCard
                              imageUrl="https://escapegame.imgix.net/64/64b07aff481e6768595364.jpg"
                              title="L'Attaque des Zombies"
                              subtitle="Survival Horror"
                              location="Nice, France"
                              roomId="l-attaque-des-zombies-6"
                          />
                      </div>
      <BottomSheetBar
        isOpen={isFilterOpen}
        onClose={handleCloseFilters}
        title="Filtrer"
      >
        <FilterPage
          initialFilters={filters}
          onApplyFilters={handleApplyFilters}
          isOpen={isFilterOpen}
        />
      </BottomSheetBar>
    </div>
  );
};

export default SearchPage;

