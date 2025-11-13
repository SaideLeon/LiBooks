'use client';
import React, { useState, useEffect } from 'react';
import { getFollowing, toggleFollow } from '@/lib/actions';
import { User } from '@/lib/prisma/definitions';
import { NavigateFunction } from '@/lib/definitions';
import { useUser } from '@/hooks/use-user';
import { Spinner } from '@/components/Spinner';

interface FollowingScreenProps {
  goBack: () => void;
  navigate: NavigateFunction;
}

const UserListItem: React.FC<{ user: User, currentUser: User }> = ({ user, currentUser }) => {
    const [isFollowing, setIsFollowing] = useState(true);

    const handleFollowToggle = async () => {
        const newState = await toggleFollow(currentUser.id, user.id);
        setIsFollowing(newState);
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
    const [followingList, setFollowingList] = useState<User[]>([]);
    const { user: currentUser } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        if (currentUser) {
            setIsLoading(true);
            getFollowing(currentUser.id).then(users => {
                setFollowingList(users);
                setIsLoading(false);
            });
        }
    }, [currentUser]);

  if (!currentUser) return null;

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
                {isLoading ? <div className="flex justify-center mt-8"><Spinner/></div> : followingList.map((user) => (
                    <UserListItem key={user.id} user={user} currentUser={currentUser} />
                ))}
            </div>
        </main>
    </div>
  );
};

export default FollowingScreen;
