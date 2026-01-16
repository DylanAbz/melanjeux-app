import { useState } from 'react';
import './App.css';
import BottomBar from './components/BottomBar/BottomBar';
import SearchPage from './pages/SearchPage/SearchPage';

function App() {
  const [activeTab, setActiveTab] = useState('Chercher'); // State for the active tab

  const renderContent = () => {
    switch (activeTab) {
      case 'Chercher':
        return <SearchPage />;
      case 'Réservations':
        return <div>Contenu des Réservations</div>;
      case 'Messages':
        return <div>Contenu des Messages</div>;
      case 'Mon compte':
        return <div>Contenu du Compte</div>;
      default:
        return <SearchPage />;
    }
  };

  return (
    <div className="App">
      {renderContent()}
      <BottomBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
