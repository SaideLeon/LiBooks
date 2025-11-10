
'use client';
import React from 'react';
import { User } from '@/lib/prisma/definitions';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';

type Screen = 'home' | 'search' | 'library' | 'profile' | 'community' | 'settings';

interface SideNavProps {
  activeTab: Screen;
  changeTab: (tab: Screen) => void;
  navigate: (page: string, params?: any) => void;
  currentUser: User;
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


const SideNav: React.FC<SideNavProps> = ({ activeTab, changeTab, navigate, currentUser }) => {
  const navItems = [
    { id: 'home', label: 'Leitura', icon: 'book' },
    { id: 'search', label: 'Busca', icon: 'search' },
    { id: 'library', label: 'Biblioteca', icon: 'bookmarks' },
    { id: 'community', label: 'Feed', icon: 'forum' },
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
        <div className="mt-auto flex flex-col space-y-2">
             <button onClick={() => changeTab('profile')} className="flex w-full items-center gap-3 rounded-lg p-3 transition-colors hover:bg-zinc-500/10">
                <img src={currentUser.avatarUrl ?? `https://i.pravatar.cc/150?u=${currentUser.email}`} alt="User Avatar" className="size-10 rounded-full" />
                <div className='text-left'>
                    <p className="font-semibold text-text-light dark:text-text-dark">{currentUser.name}</p>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Ver Perfil</p>
                </div>
            </button>
             <NavItem
                label="Ajustes"
                icon="settings"
                isActive={activeTab === 'settings'}
                onClick={() => changeTab('settings')}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-white shadow-sm transition-colors hover:bg-primary/90">
                  <span className="material-symbols-outlined">add</span>
                  <span>Novo</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mb-2">
                <DropdownMenuItem onClick={() => navigate('newPublication')}>
                  <span className="material-symbols-outlined mr-2">edit_note</span>
                  <span>Nova Publicação</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('newBook')}>
                   <span className="material-symbols-outlined mr-2">book</span>
                  <span>Publicar Livro</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
  );
};

export default SideNav;
