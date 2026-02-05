import React, { useState } from 'react';
import './SearchPage.css';
import { SearchBar } from "../../components/SearchBar/SearchBar.tsx";
import FilterButton from "../../components/FilterButton/FilterButton.tsx";
import BottomSheetBar from "../../components/BottomSheetBar/BottomSheetBar.tsx";

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
      <BottomSheetBar
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

