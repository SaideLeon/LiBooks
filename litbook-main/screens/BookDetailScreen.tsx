import React, { useState, useEffect } from 'react';
import { Book, ReadingProgress } from '../types';
import { getReadingProgress } from '../types';

interface BookDetailScreenProps {
  book: Book;
  goBack: () => void;
  navigate: (page: string, params?: any) => void;
}

const ChapterList: React.FC<{ book: Book; navigate: (page: string, params?: any) => void, goBack: () => void }> = ({ book, navigate, goBack }) => (
    <div className="bg-background-light dark:bg-background-dark min-h-full">
        <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
            <div className="flex h-16 items-center px-4">
                <button onClick={goBack} className="flex size-10 shrink-0 items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-text-light dark:text-text-dark">arrow_back</span>
                </button>
                <div className="mx-4 flex-1 text-center">
                    <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 truncate">{book.title}</h1>
                </div>
                 <button className="flex size-10 shrink-0 items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-text-light dark:text-text-dark">search</span>
                </button>
            </div>
        </header>
        <main className="flex-1">
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {book.chapters.map((chapter) => (
                    <a key={chapter.id} onClick={() => navigate('reader', { bookId: book.id, chapter: chapter.id })} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 cursor-pointer">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800">
                            <span className="text-xl font-bold text-zinc-600 dark:text-zinc-400">{chapter.id}</span>
                        </div>
                        <div className="flex-1">
                            <h2 className="font-semibold text-zinc-800 dark:text-zinc-200">{chapter.title}</h2>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">{chapter.subtitle}</p>
                        </div>
                        <span className="material-symbols-outlined text-zinc-400 dark:text-zinc-500">chevron_right</span>
                    </a>
                ))}
            </div>
        </main>
    </div>
);

const BookDetailScreen: React.FC<BookDetailScreenProps> = ({ book, goBack, navigate }) => {
  const [showChapters, setShowChapters] = useState(false);
  const [progress, setProgress] = useState<ReadingProgress | null>(null);

  useEffect(() => {
    const savedProgress = getReadingProgress(book.id);
    setProgress(savedProgress);
  }, [book.id]);


  if (showChapters) {
    return <ChapterList book={book} navigate={navigate} goBack={() => setShowChapters(false)} />;
  }

  const handleReadButtonClick = () => {
    if (progress) {
      navigate('reader', { bookId: book.id, chapter: progress.chapterId, paragraph: progress.paragraphIndex });
    } else {
      navigate('reader', { bookId: book.id, chapter: 1, paragraph: 1 });
    }
  };

  const buttonText = progress ? `Continuar de onde parou (Cap. ${progress.chapterId})` : 'Começar a Ler';

  return (
    <div className="text-zinc-800 dark:text-zinc-200">
        <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm lg:hidden">
            <div className="flex h-16 items-center px-4">
                <button onClick={goBack} className="flex size-10 shrink-0 items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                </button>
                <div className="flex-1"></div>
                <div className="flex items-center gap-2">
                    <button className="flex size-10 shrink-0 items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">bookmark_border</span>
                    </button>
                    <button className="flex size-10 shrink-0 items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">share</span>
                    </button>
                </div>
            </div>
        </header>
        <main className="flex-1">
            <div className="md:grid md:grid-cols-12 md:gap-8 lg:gap-12 md:p-8">
                <div className="flex flex-col items-center px-6 pt-4 pb-8 md:p-0 md:col-span-5 lg:col-span-4">
                    <div className="h-64 w-44 md:h-auto md:w-full md:aspect-[2/3] flex-shrink-0 rounded-lg bg-cover bg-center shadow-lg" style={{ backgroundImage: `url("${book.coverUrl}")` }}></div>
                </div>
                <div className="md:col-span-7 lg:col-span-8">
                    <div className="text-center md:text-left px-6 md:px-0">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-100" style={{ textWrap: 'balance' }}>{book.title}</h1>
                        <p className="mt-1 text-base md:text-lg text-zinc-600 dark:text-zinc-400">{book.author}</p>
                    </div>
                     <div className="hidden md:flex items-center gap-2 mt-4">
                        <button className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card-light dark:bg-card-dark/80 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50">
                            <span className="material-symbols-outlined text-2xl">bookmark_border</span>
                        </button>
                        <button className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card-light dark:bg-card-dark/80 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50">
                            <span className="material-symbols-outlined text-2xl">share</span>
                        </button>
                    </div>
                    <div className="mt-6 w-full px-6 md:px-0">
                        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                            {book.description}
                        </p>
                    </div>
                     <div className="px-6 md:px-0 py-6 space-y-4">
                        <button onClick={handleReadButtonClick} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-secondary font-semibold text-white shadow-sm transition-colors hover:bg-secondary/90">
                            <span className="material-symbols-outlined">{progress ? 'play_arrow' : 'book'}</span>
                            <span>{buttonText}</span>
                        </button>
                        <button onClick={() => setShowChapters(true)} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary/10 font-semibold text-primary shadow-sm transition-colors hover:bg-primary/20">
                            <span className="material-symbols-outlined">menu_book</span>
                            <span>Ver todos os capítulos</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-full bg-white dark:bg-zinc-900/50 px-6 md:px-8 py-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Prefácio</h2>
                <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {book.preface}
                </p>
            </div>
        </main>
    </div>
  );
};

export default BookDetailScreen;
