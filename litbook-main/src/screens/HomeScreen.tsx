import React, { useState, useEffect } from 'react';
import { MOCK_BOOKS, MOCK_ACTIVITIES } from '../data';
import { Book, Activity, ReadingProgress, User } from '../types';
import { getAllReadingProgress } from '../types';

interface BookWithProgress extends Book {
    progress: ReadingProgress;
}

interface HomeScreenProps {
  navigate: (page: string, params?: any) => void;
  currentUser: User;
}

const BookCarouselItem: React.FC<{ book: Book; progress?: ReadingProgress; onClick: () => void }> = ({ book, progress, onClick }) => {
    let progressPercentage = 0;
    if (progress && book.chapters.length > 0) {
        // Find the index of the chapter to calculate progress more accurately
        const chapterIndex = book.chapters.findIndex(c => c.id === progress.chapterId);
        if (chapterIndex !== -1) {
            progressPercentage = ((chapterIndex + 1) / book.chapters.length) * 100;
        }
    }

    return (
        <div className="flex h-full w-40 flex-col gap-2 cursor-pointer" onClick={onClick}>
            <div className="relative w-full">
                <div className="aspect-[2/3] w-full rounded-lg bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url("${book.coverUrl}")` }}></div>
                <div className="absolute bottom-0 h-1.5 w-full rounded-full bg-card-light/50 dark:bg-card-dark/50">
                    <div className="h-1.5 rounded-full bg-secondary" style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </div>
            <div>
                <p className="truncate text-base font-medium leading-normal text-text-light dark:text-text-dark">{book.title}</p>
                <p className="truncate text-sm font-normal leading-normal text-text-muted-light dark:text-text-muted-dark">{book.author}</p>
            </div>
        </div>
    );
};

const ActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => (
    <div className="w-full rounded-xl bg-card-light p-4 shadow-sm dark:bg-card-dark">
        <div className="mb-3 flex items-center gap-3">
            <img className="h-10 w-10 rounded-full object-cover" alt={`Avatar de ${activity.user.name}`} src={activity.user.avatarUrl} />
            <div>
                <p className="font-semibold leading-tight text-text-light dark:text-text-dark">{activity.user.name}</p>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{activity.action}</p>
            </div>
        </div>
        {activity.book && (
            <div className="flex flex-col gap-4 sm:flex-row">
                <img className="h-36 w-24 flex-shrink-0 rounded-md object-cover" alt={`Capa do livro ${activity.book.title}`} src={activity.book.coverUrl} />
                <div className="flex flex-col">
                    <p className="text-lg font-bold leading-tight tracking-[-0.015em] text-text-light dark:text-text-dark">{activity.book.title}</p>
                    <p className="mt-2 text-base font-normal leading-normal text-text-light dark:text-text-dark">
                        {activity.comment}
                    </p>
                </div>
            </div>
        )}
        <div className="mt-4 flex items-center justify-start gap-6 border-t border-background-light pt-3 dark:border-background-dark">
            <button className="flex items-center gap-1.5 text-text-muted-light transition-colors hover:text-secondary dark:text-text-muted-dark dark:hover:text-secondary">
                <span className="material-symbols-outlined text-xl">favorite_border</span>
                <span className="text-sm">{activity.likes}</span>
            </button>
            <button className="flex items-center gap-1.5 text-text-muted-light transition-colors hover:text-secondary dark:text-text-muted-dark dark:hover:text-secondary">
                <span className="material-symbols-outlined text-xl">chat_bubble_outline</span>
                <span className="text-sm">{activity.comments}</span>
            </button>
            <button className="ml-auto flex items-center gap-1.5 text-text-muted-light transition-colors hover:text-secondary dark:text-text-muted-dark dark:hover:text-secondary">
                <span className="material-symbols-outlined text-xl">share</span>
            </button>
        </div>
    </div>
);


const HomeScreen: React.FC<HomeScreenProps> = ({ navigate, currentUser }) => {
    const [continueReading, setContinueReading] = useState<BookWithProgress[]>([]);

    useEffect(() => {
        const allProgress = getAllReadingProgress();
        const booksWithProgress: BookWithProgress[] = Object.keys(allProgress)
            .map(bookIdStr => {
                const bookId = parseInt(bookIdStr, 10);
                const book = MOCK_BOOKS.find(b => b.id === bookId);
                if (book) {
                    return { ...book, progress: allProgress[bookId] };
                }
                return null;
            })
            .filter((b): b is BookWithProgress => b !== null)
            .sort((a, b) => b.progress.timestamp - a.progress.timestamp);

        setContinueReading(booksWithProgress);
    }, []);

    const handleContinueReadingClick = (book: BookWithProgress) => {
        navigate('reader', {
            bookId: book.id,
            chapter: book.progress.chapterId,
            paragraph: book.progress.paragraphIndex,
        });
    };

  return (
    <div className="w-full">
      <header className="pt-6">
        <h1 className="px-4 pb-3 pt-6 text-[32px] font-bold leading-tight tracking-tight text-text-light dark:text-text-dark">Olá, {currentUser.name}!</h1>
      </header>
      
      <section className="w-full">
        <h2 className="px-4 pb-3 pt-5 text-[22px] font-bold leading-tight tracking-[-0.015em] text-text-light dark:text-text-dark">Continue de onde parou</h2>
        {continueReading.length > 0 ? (
            <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex flex-none items-stretch gap-4 px-4 py-2">
                    {continueReading.map(book => (
                        <BookCarouselItem 
                            key={book.id} 
                            book={book} 
                            progress={book.progress} 
                            onClick={() => handleContinueReadingClick(book)} 
                        />
                    ))}
                </div>
            </div>
         ) : (
            <div className="px-4">
                <p className="text-text-muted-light dark:text-text-muted-dark">Você não começou a ler nenhum livro ainda. Explore e comece sua jornada!</p>
            </div>
        )}
      </section>

      <section className="mt-4 w-full">
        <h2 className="px-4 pb-3 pt-5 text-[22px] font-bold leading-tight tracking-[-0.015em] text-text-light dark:text-text-dark">Atividades Recentes</h2>
        <div className="flex flex-col gap-4 px-4">
          {MOCK_ACTIVITIES.map(activity => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
