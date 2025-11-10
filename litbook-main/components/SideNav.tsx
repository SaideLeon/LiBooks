import React from 'react';

type Screen = 'home' | 'search' | 'library' | 'profile' | 'community' | 'settings';

interface SideNavProps {
  activeTab: Screen;
  changeTab: (tab: Screen) => void;
  navigate: (page: string, params?: any) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = 'bg-primary/10 text-primary dark:bg-primary/20';
  const inactiveClasses = 'text-text-muted-light dark:text-text-muted-dark hover:bg-zinc-500/10';
  const iconFill = isActive ? { fontVariationSettings: "'FILL' 1" } : {};
  
  return (
    <button onClick={onClick} className={`flex h-12 w-full items-center gap-3 rounded-lg px-4 text-base font-semibold transition-colors ${isActive ? activeClasses : inactiveClasses}`}>
      <span className="material-symbols-outlined text-2xl" style={iconFill}>
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
};

const Logo: React.FC = () => (
    <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-3xl text-primary">import_contacts</span>
        <span className="text-2xl font-bold text-text-light dark:text-text-dark">LitBook</span>
    </div>
);


const SideNav: React.FC<SideNavProps> = ({ activeTab, changeTab, navigate }) => {
  const navItems = [
    { id: 'home', label: 'Leitura', icon: 'book' },
    { id: 'search', label: 'Busca', icon: 'search' },
    { id: 'library', label: 'Biblioteca', icon: 'bookmarks' },
    { id: 'community', label: 'Feed', icon: 'forum' },
    { id: 'profile', label: 'Perfil', icon: 'person' },
    { id: 'settings', label: 'Ajustes', icon: 'settings' },
  ];

  return (
    <div className="flex h-full flex-col p-4">
        <div className="flex h-16 items-center px-2">
            <Logo />
        </div>
        <nav className="mt-6 flex-grow space-y-2">
            {navItems.map((item) => (
            <NavItem
                key={item.id}
                label={item.label}
                icon={item.icon}
                isActive={activeTab === item.id}
                onClick={() => changeTab(item.id as Screen)}
            />
            ))}
        </nav>
        <div className="mt-auto">
             <button onClick={() => navigate('newPublication')} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-white shadow-sm transition-colors hover:bg-primary/90">
                <span className="material-symbols-outlined">add</span>
                <span>Nova Publicação</span>
            </button>
        </div>
    </div>
  );
};

export default SideNav;
