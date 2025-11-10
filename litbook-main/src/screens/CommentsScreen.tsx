import React, { useState, useEffect } from 'react';
import { CommunityPost, User, Comment } from '../types';
import { getCommentsForPost, addComment } from '../api';

interface CommentsScreenProps {
  goBack: () => void;
  navigate: (page: string, params?: any) => void;
  post: CommunityPost;
  currentUser: User;
}

const CommentCard: React.FC<{ comment: Comment }> = ({ comment }) => (
    <div className="flex w-full flex-row items-start justify-start gap-3 border-b border-zinc-200 p-4 dark:border-zinc-800">
        <img className="aspect-square w-10 shrink-0 rounded-full object-cover" alt={`Profile picture of ${comment.user.name}`} src={comment.user.avatarUrl} />
        <div className="flex h-full flex-1 flex-col items-start justify-start">
            <div className="flex w-full flex-row items-baseline justify-start gap-x-2">
                <p className="text-sm font-bold leading-normal tracking-[0.015em] text-text-light dark:text-text-dark">{comment.user.name}</p>
                <p className="text-xs font-normal leading-normal text-text-muted-light dark:text-text-muted-dark">{comment.timestamp}</p>
            </div>
            <p className="pt-1 text-sm font-normal leading-normal text-zinc-700 dark:text-zinc-300">
                {comment.text}
            </p>
            <div className="flex w-full flex-row items-center justify-start gap-6 pt-3">
                <button className="flex items-center gap-2 text-text-muted-light dark:text-text-muted-dark hover:text-primary">
                    <span className="material-symbols-outlined text-lg">thumb_up</span>
                    <p className="text-sm font-medium leading-normal">{comment.likes}</p>
                </button>
                <button className="flex items-center gap-2 text-text-muted-light dark:text-text-muted-dark hover:text-primary">
                    <span className="material-symbols-outlined text-lg">thumb_down</span>
                </button>
            </div>
        </div>
    </div>
);


const CommentsScreen: React.FC<CommentsScreenProps> = ({ goBack, post, currentUser }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newCommentText, setNewCommentText] = useState('');

    useEffect(() => {
        setComments(getCommentsForPost(post.id));
    }, [post.id]);

    const handleAddComment = () => {
        if (newCommentText.trim() === '') return;
        const newComment = addComment(post.id, currentUser.id, newCommentText.trim());
        setComments(prev => [newComment, ...prev]);
        setNewCommentText('');
    };

    return (
        <div className="relative flex h-dvh w-full flex-col overflow-x-hidden">
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-200/50 bg-background-light/80 p-4 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-background-dark/80">
                <button onClick={goBack} className="flex size-10 shrink-0 items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                </button>
                <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-text-light dark:text-text-dark">{post.bookVerse}</h1>
                <div className="flex w-10 items-center justify-end">
                    <button className="flex h-12 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg p-0 text-text-light dark:text-text-dark">
                        <span className="material-symbols-outlined text-2xl">bookmark_border</span>
                    </button>
                </div>
            </header>

            <main className="flex-grow pb-24">
                <div className="px-4 pt-4">
                    <div className="rounded-xl bg-card-light p-4 shadow-sm dark:bg-card-dark/80">
                        <p className="text-base font-normal leading-relaxed text-slate-800 dark:text-slate-200">
                            "{post.quote}"
                        </p>
                         <p className="text-base font-normal leading-relaxed text-slate-700 dark:text-slate-300 mt-2">
                            {post.comment}
                        </p>
                    </div>
                </div>
                <section>
                    <h2 className="px-4 pb-2 pt-6 text-lg font-bold leading-tight tracking-[-0.015em] text-text-light dark:text-text-dark">Comentários</h2>
                    <div className="flex flex-col">
                        {comments.map(comment => <CommentCard key={comment.id} comment={comment} />)}
                    </div>
                </section>
            </main>

            <div className="fixed bottom-0 left-0 right-0 z-10 mx-auto w-full max-w-lg bg-background-light dark:bg-background-dark">
                <div className="flex items-center gap-2 border-t border-zinc-200 bg-card-light p-3 dark:border-zinc-800 dark:bg-card-dark">
                    <img className="size-8 shrink-0 rounded-full object-cover" alt="Your profile picture" src={currentUser.avatarUrl} />
                    <input 
                        className="flex-1 rounded-full border-zinc-300 bg-zinc-100 px-4 py-2 text-sm text-text-light placeholder:text-text-muted-light focus:border-primary focus:ring-primary dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-text-muted-dark" 
                        placeholder="Adicione um comentário..." 
                        type="text" 
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    />
                    <button onClick={handleAddComment} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-transform active:scale-95">
                        <span className="material-symbols-outlined text-xl">send</span>
                    </button>
                </div>
                 <div style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}></div>
            </div>
        </div>
    );
};

export default CommentsScreen;
