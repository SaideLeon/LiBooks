import React from 'react';
import { Publication, User } from '../types';
import { MOCK_USER_PROFILE } from '../data';

const PublicationCard: React.FC<{publication: Publication}> = ({ publication }) => (
    <article className="p-4">
        <div className="flex flex-col items-stretch justify-start">
            {publication.imageUrl && (
                 <div className="w-full bg-center bg-no-repeat aspect-[1.91/1] bg-cover rounded-lg" style={{backgroundImage: `url("${publication.imageUrl}")`}}></div>
            )}
            <div className="flex w-full grow flex-col items-stretch justify-center gap-2 py-4">
                <p className="text-sm font-normal leading-normal text-zinc-500 dark:text-zinc-400">{publication.verse}</p>
                <p className="text-lg font-bold leading-tight tracking-[-0.015em] text-[#333333] dark:text-white">{publication.title}</p>
                <div className="flex flex-col gap-1">
                    <p className="text-base font-normal leading-normal text-zinc-600 dark:text-zinc-300">
                        {publication.quote}
                    </p>
                    <p className="mt-2 text-base font-normal leading-normal text-zinc-600 dark:text-zinc-300">
                        {publication.content}
                    </p>
                </div>
            </div>
            <div className="flex flex-wrap gap-2 py-2">
                <div className="flex cursor-pointer items-center justify-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <span className="material-symbols-outlined text-zinc-500 dark:text-zinc-400">favorite</span>
                    <p className="text-[13px] font-bold leading-normal tracking-[0.015em] text-zinc-500 dark:text-zinc-400">{publication.likes}</p>
                </div>
                <div className="flex cursor-pointer items-center justify-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <span className="material-symbols-outlined text-zinc-500 dark:text-zinc-400">chat_bubble</span>
                    <p className="text-[13px] font-bold leading-normal tracking-[0.015em] text-zinc-500 dark:text-zinc-400">{publication.comments}</p>
                </div>
                <div className="flex cursor-pointer items-center justify-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <span className="material-symbols-outlined text-zinc-500 dark:text-zinc-400">share</span>
                    <p className="text-[13px] font-bold leading-normal tracking-[0.015em] text-zinc-500 dark:text-zinc-400">{publication.shares}</p>
                </div>
            </div>
        </div>
    </article>
);

interface ProfileScreenProps {
  navigate: (page: string, params?: any) => void;
}


const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigate }) => {
  const user = MOCK_USER_PROFILE;
  
  return (
    <div className="bg-background-light dark:bg-background-dark">
        <header className="sticky top-0 z-10 flex h-16 items-center border-b border-zinc-200/50 bg-background-light/80 p-4 pb-2 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-background-dark/80">
            <div className="flex size-12 shrink-0 items-center justify-start lg:hidden"></div>
            <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-[#333333] dark:text-white lg:text-left">Perfil</h1>
            <div className="flex size-12 shrink-0 items-center justify-end">
                <span className="material-symbols-outlined text-[#333333] dark:text-white">more_horiz</span>
            </div>
        </header>
        <main className="flex-grow">
            <div className="flex p-4 md:p-6">
                <div className="flex w-full flex-col items-center gap-4">
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-28 w-28 border-2 border-zinc-200 dark:border-zinc-700" style={{backgroundImage: `url("${user.avatarUrl}")`}}></div>
                        <div className="flex flex-col items-center justify-center text-center">
                            <p className="text-[22px] font-bold leading-tight tracking-[-0.015em] text-[#333333] dark:text-white">{user.name}</p>
                            <p className="mt-1 max-w-md text-base font-normal leading-normal text-zinc-600 dark:text-zinc-400">{user.bio}</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-1.5 rounded-full border border-primary bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90">
                        <span className="truncate">Seguir</span>
                    </button>
                </div>
            </div>

            <div className="flex w-full justify-around p-4 border-y border-zinc-200 dark:border-zinc-800">
                <div className="text-center">
                    <p className="font-bold text-lg text-text-light dark:text-text-dark">{user.publications?.length || 0}</p>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Publicações</p>
                </div>
                <button className="text-center transition-colors hover:text-primary group">
                    <p className="font-bold text-lg text-text-light dark:text-text-dark group-hover:text-primary">{user.followers || 0}</p>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark group-hover:text-primary">Seguidores</p>
                </button>
                <button className="text-center transition-colors hover:text-primary group" onClick={() => navigate('following')}>
                    <p className="font-bold text-lg text-text-light dark:text-text-dark group-hover:text-primary">{user.following || 0}</p>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark group-hover:text-primary">Seguindo</p>
                </button>
            </div>

            <div className="px-4 md:px-6 pb-2 pt-4">
                <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-[#333333] dark:text-white">Publicações</h2>
            </div>
            <div className="md:grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800 md:border-r md:dark:border-zinc-800">
                  {user.publications && user.publications.filter((_, i) => i % 2 === 0).map(pub => <PublicationCard key={pub.id} publication={pub} />)}
              </div>
              <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
                  {user.publications && user.publications.filter((_, i) => i % 2 !== 0).map(pub => <PublicationCard key={pub.id} publication={pub} />)}
              </div>
            </div>
        </main>
    </div>
  );
};

export default ProfileScreen;
