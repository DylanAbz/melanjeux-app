import React from 'react';
import './SearchPage.css';
import {SearchBar} from "../../components/SearchBar/SearchBar.tsx";

const SearchPage: React.FC = () => {
  return (
    <div className="search-page">
      <h1 className="search-page-title">
        <span className="search-page-title kanit-semibold">Trouvez votre prochaine mission</span>
      </h1>
      <div className="search-options">
          <SearchBar className={"searchbar"} placeholder={"Rechercher"} autoFocus={false} onChange={(value) => {
              console.log(value);}}/>
      </div>
    </div>
  );
};

export default SearchPage;
