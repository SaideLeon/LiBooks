'use client';
import React, { useState, useEffect } from 'react';
import { CommunityPost, User } from '@/lib/prisma/definitions';
import { getUserById, getCommunityPosts, getFollowers, getFollowing, getIsFollowing, toggleFollow } from '@/lib/actions';
import { useUser } from '@/hooks/use-user';
import { Spinner } from '@/components/Spinner';

const PublicationCard: React.FC<{publication: CommunityPost}> = ({ publication }) => (
    <article className="p-4">
        <div className="flex flex-col items-stretch justify-start">
            {publication.imageUrl && (
                 <div className="w-full bg-center bg-no-repeat aspect-[1.91/1] bg-cover rounded-lg" style={{backgroundImage: `url("${publication.imageUrl}")`}}></div>
            )}
            <div className="flex w-full grow flex-col items-stretch justify-center gap-2 py-4">
                <p className="text-sm font-normal leading-normal text-zinc-500 dark:text-zinc-400">{publication.bookVerse}</p>
                <div className="flex flex-col gap-1">
                    {publication.quote && <p className="text-base font-normal leading-normal text-zinc-600 dark:text-zinc-300">
                       "{publication.quote}"
                    </p>}
                    <p className="mt-2 text-base font-normal leading-normal text-zinc-600 dark:text-zinc-300">
                        {publication.comment}
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
                    <p className="text-[13px] font-bold leading-normal tracking-[0.015em] text-zinc-500 dark:text-zinc-400">{publication.commentsCount}</p>
                </div>
                <div className="flex cursor-pointer items-center justify-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <span className="material-symbols-outlined text-zinc-500 dark:text-zinc-400">share</span>
                    <p className="text-[13px] font-bold leading-normal tracking-[0.015em] text-zinc-500 dark:text-zinc-400">0</p>
                </div>
            </div>
        </div>
    </article>
);

interface ProfileScreenProps {
  navigate: (page: string, params?: any) => void;
  user: User; // The user whose profile is being viewed
}


const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigate, user: profileUser }) => {
  const { user: currentUser } = useUser();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        if (!profileUser) return;
        setIsLoading(true);
        const [userPosts, userFollowers, userFollowing, isFollowingStatus] = await Promise.all([
            getCommunityPosts().then(p => p.filter(post => post.authorId === profileUser.id)),
            getFollowers(profileUser.id),
            getFollowing(profileUser.id),
            currentUser ? getIsFollowing(currentUser.id, profileUser.id) : false
        ]);
        
        setPosts(userPosts as CommunityPost[]);
        setFollowers(userFollowers);
        setFollowing(userFollowing);
        setIsFollowing(isFollowingStatus);
        setIsLoading(false);
    }
    fetchData();
  }, [profileUser, currentUser]);

  const handleFollowToggle = async () => {
      if (!currentUser || !profileUser) return;
      const newState = await toggleFollow(currentUser.id, profileUser.id);
      setIsFollowing(newState);
      // Re-fetch follower count
      getFollowers(profileUser.id).then(setFollowers);
  }
  
  if (isLoading || !profileUser) {
    return <div className="h-full w-full flex items-center justify-center"><Spinner /></div>;
  }
  
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
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-28 w-28 border-2 border-zinc-200 dark:border-zinc-700" style={{backgroundImage: `url("${profileUser.avatarUrl}")`}}></div>
                        <div className="flex flex-col items-center justify-center text-center">
                            <p className="text-[22px] font-bold leading-tight tracking-[-0.015em] text-[#333333] dark:text-white">{profileUser.name}</p>
                            <p className="mt-1 max-w-md text-base font-normal leading-normal text-zinc-600 dark:text-zinc-400">{profileUser.bio}</p>
                        </div>
                    </div>
                    {currentUser?.id !== profileUser.id && (
                        <button onClick={handleFollowToggle} className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${isFollowing ? 'border border-zinc-300 dark:border-zinc-700' : 'bg-primary text-white border border-primary hover:bg-primary/90'}`}>
                            <span>{isFollowing ? 'Seguindo' : 'Seguir'}</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="flex w-full justify-around p-4 border-y border-zinc-200 dark:border-zinc-800">
                <div className="text-center">
                    <p className="font-bold text-lg text-text-light dark:text-text-dark">{posts.length}</p>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Publicações</p>
                </div>
                <button className="text-center transition-colors hover:text-primary group">
                    <p className="font-bold text-lg text-text-light dark:text-text-dark group-hover:text-primary">{followers.length}</p>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark group-hover:text-primary">Seguidores</p>
                </button>
                <button className="text-center transition-colors hover:text-primary group" onClick={() => navigate('following')}>
                    <p className="font-bold text-lg text-text-light dark:text-text-dark group-hover:text-primary">{following.length}</p>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark group-hover:text-primary">Seguindo</p>
                </button>
            </div>

            <div className="px-4 md:px-6 pb-2 pt-4">
                <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-[#333333] dark:text-white">Publicações</h2>
            </div>
            <div className="md:grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800 md:border-r md:dark:border-zinc-800">
                  {posts.filter((_, i) => i % 2 === 0).map(pub => <PublicationCard key={pub.id} publication={pub} />)}
              </div>
              <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
                  {posts.filter((_, i) => i % 2 !== 0).map(pub => <PublicationCard key={pub.id} publication={pub} />)}
              </div>
            </div>
        </main>
    </div>
  );
};

export default ProfileScreen;
