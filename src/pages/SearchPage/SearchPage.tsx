import React, { useState } from 'react';
import './SearchPage.css';
import { SearchBar } from "../../components/SearchBar/SearchBar.tsx";
import FilterButton from "../../components/FilterButton/FilterButton.tsx";
import BottomSheetBar from "../../components/BottomSheetBar/BottomSheetBar.tsx";
import RoomCard from "../../components/RoomCard/RoomCard.tsx";

const SearchPage: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleOpenFilters = () => {
    setIsFilterOpen(true);
  };

  const handleCloseFilters = () => {
    setIsFilterOpen(false);
  };

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
          <FilterButton onClick={handleOpenFilters} />
        </div>
      </div>
                      <div className="room-card-list-container">
                          <RoomCard
                              imageUrl="https://www.mosl.fr/fr/pylot_bridge/resize_image?mode=tronq&selwidth=800&selheight=800&quality=60&timeToCache=1800&file=https%3A%2F%2Fwww.sitlor.fr%2Fphotos%2F845%2F845160798_6.jpg"
                              title="Le Secret de la Momie de Râ"
                              subtitle="Escape Game Aventures Extrêmes"
                              location="Paris, France, 75001"
                          />
                          <RoomCard
                              imageUrl="https://escapegame.imgix.net/64/64b07aff481e6768595364.jpg"
                              title="Le Manoir Hanté de Transylvanie"
                              subtitle="Frissons Garantis Définitivement"
                              location="Lyon, France 69002 Ville très longue"
                          />
                          <RoomCard
                              imageUrl="https://www.mosl.fr/fr/pylot_bridge/resize_image?mode=tronq&selwidth=800&selheight=800&quality=60&timeToCache=1800&file=https%3A%2F%2Fwww.sitlor.fr%2Fphotos%2F845%2F845160798_6.jpg"
                              title="L'énigme du Pharaon"
                              subtitle="Aventure Égyptienne"
                              location="Marseille, France"
                          />
                          <RoomCard
                              imageUrl="https://escapegame.imgix.net/64/64b07aff481e6768595364.jpg"
                              title="La Forêt Oubliée"
                              subtitle="Exploration Nature"
                              location="Bordeaux, France"
                          />
                          <RoomCard
                              imageUrl="https://www.mosl.fr/fr/pylot_bridge/resize_image?mode=tronq&selwidth=800&selheight=800&quality=60&timeToCache=1800&file=https%3A%2F%2Fwww.sitlor.fr%2Fphotos%2F845%2F845160798_6.jpg"
                              title="Le Mystère de l'Horloge"
                              subtitle="Voyage dans le Temps"
                              location="Toulouse, France"
                          />
                          <RoomCard
                              imageUrl="https://escapegame.imgix.net/64/64b07aff481e6768595364.jpg"
                              title="L'Attaque des Zombies"
                              subtitle="Survival Horror"
                              location="Nice, France"
                          />
                      </div>      <BottomSheetBar
        isOpen={isFilterOpen}
        onClose={handleCloseFilters}
        title="Filtres"
      >
        <p>Contenu des filtres ici...</p>
        {/* You can add your filter options here */}
      </BottomSheetBar>
    </div>
  );
};

export default SearchPage;

