import React, { useState } from 'react';
import { MOCK_FOLLOWING_LIST } from '../data';
import { FollowUser } from '../types';

interface FollowingScreenProps {
  goBack: () => void;
  navigate: (page: string, params?: any) => void;
}

const UserListItem: React.FC<{ user: FollowUser }> = ({ user }) => {
    const [isFollowing, setIsFollowing] = useState(user.isFollowing);

    const handleFollowToggle = () => {
        setIsFollowing(prev => !prev);
    };

    return (
        <div className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex flex-1 items-center gap-4 overflow-hidden">
                <div className="h-12 w-12 shrink-0 rounded-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url("${user.avatarUrl}")` }}></div>
                <p className="truncate text-base font-medium text-zinc-800 dark:text-zinc-200">{user.name}</p>
            </div>
            <div className="shrink-0">
                {isFollowing ? (
                    <button onClick={handleFollowToggle} className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-9 px-4 border border-zinc-300 bg-transparent text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
                        <span className="truncate">Deixar de Seguir</span>
                    </button>
                ) : (
                    <button onClick={handleFollowToggle} className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-9 px-4 border-transparent bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary/90">
                        <span className="truncate">Seguir</span>
                    </button>
                )}
            </div>
        </div>
    );
};

const FollowingScreen: React.FC<FollowingScreenProps> = ({ goBack }) => {
  return (
    <div className="flex flex-col min-h-full bg-background-light dark:bg-background-dark">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-zinc-200/50 bg-background-light/80 px-4 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-background-dark/80">
            <button onClick={goBack} className="flex size-10 items-center justify-center text-zinc-700 dark:text-zinc-300">
                <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <h1 className="flex-1 text-center text-lg font-bold text-zinc-900 dark:text-zinc-100">Seguindo</h1>
            <div className="size-10"></div>
        </header>

        <main className="flex-1">
            <div className="flex flex-col pt-2">
                {MOCK_FOLLOWING_LIST.map((user) => (
                    <UserListItem key={user.name} user={user} />
                ))}
            </div>
        </main>
    </div>
  );
};

export default FollowingScreen;
