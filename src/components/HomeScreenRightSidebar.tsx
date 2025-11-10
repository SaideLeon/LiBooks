
'use client';
import React, { useEffect, useState } from 'react';
import { Activity } from '@/lib/prisma/definitions';
import { getActivities } from '@/lib/actions';
import { Spinner } from './Spinner';

const ActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => (
    <div className="w-full rounded-xl bg-card-light p-4 shadow-sm dark:bg-card-dark">
        <div className="mb-3 flex items-center gap-3">
            {activity.author?.avatarUrl && 
                <img className="h-10 w-10 rounded-full object-cover" alt={`Avatar de ${activity.author.name}`} src={activity.author.avatarUrl} />
            }
            <div>
                <p className="font-semibold leading-tight text-text-light dark:text-text-dark">{activity.author?.name}</p>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{activity.type}</p>
            </div>
        </div>
        {activity.book && (
            <div className="flex flex-col gap-4">
                <img className="h-36 w-24 flex-shrink-0 rounded-md object-cover" alt={`Capa do livro ${activity.book.title}`} src={activity.book.coverUrl} />
                <div className="flex flex-col">
                    <p className="text-lg font-bold leading-tight tracking-[-0.015em] text-text-light dark:text-text-dark">{activity.book.title}</p>
                    <p className="mt-2 text-base font-normal leading-normal text-text-light dark:text-text-dark">
                        {activity.comment}
                    </p>
                </div>
            </div>
        )}
        <div className="mt-4 flex items-center justify-start gap-6 border-t border-background-light pt-3 dark:border-zinc-700/50">
            <button className="flex items-center gap-1.5 text-text-muted-light transition-colors hover:text-secondary dark:text-text-muted-dark dark:hover:text-secondary">
                <span className="material-symbols-outlined text-xl">favorite_border</span>
                <span className="text-sm">{activity.likes}</span>
            </button>
            <button className="flex items-center gap-1.5 text-text-muted-light transition-colors hover:text-secondary dark:text-text-muted-dark dark:hover:text-secondary">
                <span className="material-symbols-outlined text-xl">chat_bubble_outline</span>
                <span className="text-sm">0</span>
            </button>
            <button className="ml-auto flex items-center gap-1.5 text-text-muted-light transition-colors hover:text-secondary dark:text-text-muted-dark dark:hover:text-secondary">
                <span className="material-symbols-outlined text-xl">share</span>
            </button>
        </div>
    </div>
);

const HomeScreenRightSidebar: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      const acts = await getActivities();
      setActivities(acts);
      setIsLoading(false);
    }
    fetchActivities();
  }, []);

  return (
    <div className="h-full overflow-y-auto">
        <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
            <div className="flex h-16 items-center px-4">
                <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-text-light dark:text-text-dark">Atividades Recentes</h2>
            </div>
        </header>
        <div className="flex flex-col gap-4 p-4">
            {isLoading ? <div className="flex justify-center mt-8"><Spinner/></div> : activities.map(activity => (
                <ActivityCard key={activity.id} activity={activity} />
            ))}
        </div>
    </div>
  );
};

export default HomeScreenRightSidebar;
