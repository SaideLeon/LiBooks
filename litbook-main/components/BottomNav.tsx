import React from 'react';

type Screen = 'home' | 'search' | 'library' | 'profile' | 'community' | 'settings';

interface BottomNavProps {
  activeTab: Screen;
  setActiveTab: (tab: Screen) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = 'text-primary';
  const inactiveClasses = 'text-text-muted-light dark:text-text-muted-dark';
  const iconFill = isActive ? { fontVariationSettings: "'FILL' 1" } : {};
  
  return (
    <button onClick={onClick} className={`inline-flex h-full flex-shrink-0 flex-col items-center justify-center gap-1 px-4 hover:bg-gray-50/5 dark:hover:bg-gray-800/20 group ${isActive ? activeClasses : inactiveClasses}`}>
      <span className="material-symbols-outlined text-2xl" style={iconFill}>
        {icon}
      </span>
      <span className={`text-xs whitespace-nowrap ${isActive ? 'font-bold' : ''}`}>{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', label: 'Leitura', icon: 'book' },
    { id: 'search', label: 'Busca', icon: 'search' },
    { id: 'library', label: 'Biblioteca', icon: 'bookmarks' },
    { id: 'community', label: 'Feed', icon: 'forum' },
    { id: 'profile', label: 'Perfil', icon: 'person' },
    { id: 'settings', label: 'Ajustes', icon: 'settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 w-full border-t border-gray-200/80 bg-background-light/80 backdrop-blur-lg dark:border-gray-800/80 dark:bg-background-dark/80">
      <div className="flex h-20 items-center justify-start overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            label={item.label}
            icon={item.icon}
            isActive={activeTab === item.id}
            onClick={() => setActiveTab(item.id as Screen)}
          />
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
