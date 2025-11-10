import React, { useState, useEffect } from 'react';
import { MOCK_BOOKS } from '../data';
import { Book, ReadingProgress, User } from '../types';
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
        const chapterIndex = book.chapters.findIndex(c => c.id === progress.chapterId);
        if (chapterIndex !== -1) {
            progressPercentage = ((chapterIndex + 1) / book.chapters.length) * 100;
        }
    }

    return (
        <div className="flex h-full w-40 flex-col gap-2 cursor-pointer" onClick={onClick}>
            <div className="relative w-full">
                <div className="aspect-[2/3] w-full rounded-lg bg-cover bg-center bg-no-repeat shadow-lg" style={{ backgroundImage: `url("${book.coverUrl}")` }}></div>
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
      <header className="pt-6 lg:pt-10">
        <h1 className="px-4 lg:px-8 pb-3 pt-6 text-[32px] font-bold leading-tight tracking-tight text-text-light dark:text-text-dark">Olá, {currentUser.name}!</h1>
      </header>
      
      <section className="w-full">
        <h2 className="px-4 lg:px-8 pb-3 pt-5 text-[22px] font-bold leading-tight tracking-[-0.015em] text-text-light dark:text-text-dark">Continue de onde parou</h2>
        {continueReading.length > 0 ? (
            <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex flex-none items-stretch gap-4 px-4 lg:px-8 py-2">
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
            <div className="px-4 lg:px-8">
                <p className="text-text-muted-light dark:text-text-muted-dark">Você não começou a ler nenhum livro ainda. Explore e comece sua jornada!</p>
            </div>
        )}
      </section>
    </div>
  );
};

export default HomeScreen;
