import React from 'react';
import './BottomBar.css';

interface BottomBarProps {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
}

// Helper component to render the correct icon as an inline SVG
const TabIcon = ({ name }: { name: string }) => {
  const commonProps = {
    viewBox: "0 0 32 32",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  };

  switch (name) {
    case 'Chercher':
      return (
        <svg {...commonProps}>
          <path d="M14.6667 25.3333C20.5577 25.3333 25.3333 20.5577 25.3333 14.6667C25.3333 8.77563 20.5577 4 14.6667 4C8.77563 4 4 8.77563 4 14.6667C4 20.5577 8.77563 25.3333 14.6667 25.3333Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M28.0002 28L22.2002 22.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'Réservations':
      return (
        <svg {...commonProps}>
          <path d="M25.3333 5.33331H6.66667C5.19391 5.33331 4 6.52722 4 7.99998V26.6666C4 28.1394 5.19391 29.3333 6.66667 29.3333H25.3333C26.8061 29.3333 28 28.1394 28 26.6666V7.99998C28 6.52722 26.8061 5.33331 25.3333 5.33331Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21.3333 2.66669V8.00002" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.6667 2.66669V8.00002" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 13.3333H28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'Messages':
      return (
        <svg {...commonProps}>
          <path d="M28 20C28 20.7072 27.719 21.3855 27.219 21.8856C26.7189 22.3857 26.0406 22.6667 25.3333 22.6667H9.33333L4 28V6.66667C4 5.95942 4.28095 5.28115 4.78105 4.78105C5.28115 4.28095 5.95942 4 6.66667 4H25.3333C26.0406 4 26.7189 4.28095 27.219 4.78105C27.719 5.28115 28 5.95942 28 6.66667V20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'Mon compte':
      return (
        <svg {...commonProps}>
          <path d="M26.6666 28V25.3333C26.6666 23.9188 26.1047 22.5623 25.1045 21.5621C24.1043 20.5619 22.7477 20 21.3333 20H10.6666C9.2521 20 7.89554 20.5619 6.89535 21.5621C5.89515 22.5623 5.33325 23.9188 5.33325 25.3333V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16.0001 14.6667C18.9456 14.6667 21.3334 12.2789 21.3334 9.33333C21.3334 6.38781 18.9456 4 16.0001 4C13.0546 4 10.6667 6.38781 10.6667 9.33333C10.6667 12.2789 13.0546 14.6667 16.0001 14.6667Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    default:
      return null;
  }
};

const BottomBar: React.FC<BottomBarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { name: 'Chercher' },
    { name: 'Réservations' },
    { name: 'Messages' },
    { name: 'Mon compte' },
  ];

  return (
    <nav className="bottom-bar">
      {tabs.map((tab) => (
        <div
          key={tab.name}
          className={`bottom-bar-item ${activeTab === tab.name ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.name)}
        >
          <TabIcon name={tab.name} />
          <span>{tab.name}</span>
        </div>
      ))}
    </nav>
  );
};

export default BottomBar;
