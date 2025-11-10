import React, { useState } from 'react';
import { CommunityPost } from '../types';
import { MOCK_COMMUNITY_POSTS } from '../data';

interface CommunityScreenProps {
  navigate: (page: string, params?: any) => void;
}

const CommunityPostCard: React.FC<{ post: CommunityPost, navigate: (page: string, params?: any) => void; }> = ({ post, navigate }) => {
  const [isFollowing, setIsFollowing] = useState(post.isFollowing);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likes);

  const handleFollow = () => setIsFollowing(!isFollowing);
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };
  
  const followButton = isFollowing ? (
    <button onClick={handleFollow} className="flex items-center gap-1.5 rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
        <span className="material-symbols-outlined text-base text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        <span>Seguindo</span>
    </button>
  ) : (
     <button onClick={handleFollow} className="flex items-center gap-1.5 rounded-full border border-primary bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary/90">
        <span className="material-symbols-outlined text-base">person_add</span>
        <span>Seguir</span>
    </button>
  );

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-card-light dark:border-gray-800 dark:bg-gray-900/50">
        <div className="flex items-start justify-between p-4">
            <a className="group flex cursor-pointer items-center gap-3" href="#">
                <img className="h-10 w-10 rounded-full object-cover" alt={`Avatar de ${post.user.name}`} src={post.user.avatarUrl} />
                <div>
                    <p className="font-semibold text-text-light group-hover:text-primary dark:text-text-dark dark:group-hover:text-primary">{post.user.name}</p>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">{post.timestamp}</p>
                </div>
            </a>
            {followButton}
        </div>

        {post.imageUrl && (
            <img alt="Post image" className="aspect-[4/3] w-full object-cover" src={post.imageUrl} />
        )}

        <div className="px-4 pt-4">
            <p className="mb-2 text-lg italic text-gray-800 dark:text-gray-200">"{post.quote}"</p>
            <p className="mb-4 text-gray-600 dark:text-gray-300">{post.comment}</p>
            <a className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary hover:bg-primary/20" href="#">{post.bookVerse}</a>
        </div>

        <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
                <button onClick={handleLike} className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-primary' : 'text-text-muted-light dark:text-text-muted-dark hover:text-primary'}`}>
                    <span className="material-symbols-outlined text-xl" style={isLiked ? { fontVariationSettings: "'FILL' 1" } : {}}>{isLiked ? 'favorite' : 'favorite_border'}</span>
                    <span className="text-sm font-medium">{likes}</span>
                </button>
                <button onClick={() => navigate('comments', { post })} className="flex items-center gap-1.5 text-text-muted-light dark:text-text-muted-dark hover:text-primary">
                    <span className="material-symbols-outlined text-xl">chat_bubble_outline</span>
                    <span className="text-sm font-medium">{post.comments}</span>
                </button>
            </div>
            <button className="flex items-center gap-1.5 text-text-muted-light dark:text-text-muted-dark hover:text-primary">
                <span className="material-symbols-outlined text-xl">share</span>
            </button>
        </div>
    </div>
  );
};

const CommunityScreen: React.FC<CommunityScreenProps> = ({ navigate }) => {
  return (
    <div className="w-full">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200/80 bg-background-light/80 px-4 backdrop-blur-sm dark:border-gray-800/80 dark:bg-background-dark/80">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Comunidade</h1>
        <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800">
          <span className="material-symbols-outlined text-2xl">search</span>
        </button>
      </header>
      <main className="flex-1 space-y-4 p-4">
        {MOCK_COMMUNITY_POSTS.map(post => (
          <CommunityPostCard key={post.id} post={post} navigate={navigate} />
        ))}
      </main>
    </div>
  );
};

export default CommunityScreen;