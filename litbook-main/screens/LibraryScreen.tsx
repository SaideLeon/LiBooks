import React, { useState, useEffect } from 'react';
import { Book, Bookmark, ReadingProgress, getAllReadingProgress, getAllBookmarks } from '../types';
import { MOCK_BOOKS } from '../data';

interface LibraryScreenProps {
  navigate: (page: string, params?: any) => void;
}

interface BookWithProgress extends Book {
    progress: ReadingProgress;
}

const LibraryScreen: React.FC<LibraryScreenProps> = ({ navigate }) => {
    const [activeTab, setActiveTab] = useState<'books' | 'bookmarks'>('books');
    const [myBooks, setMyBooks] = useState<BookWithProgress[]>([]);
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

    useEffect(() => {
        if (activeTab === 'books') {
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
            setMyBooks(booksWithProgress);
        } else {
            const allBookmarks = getAllBookmarks();
            setBookmarks(allBookmarks);
        }
    }, [activeTab]);

    const handleBookmarkClick = (bookmark: Bookmark) => {
        navigate('reader', { 
            bookId: bookmark.bookId, 
            chapter: bookmark.chapterId,
            paragraph: bookmark.paragraphIndex
        });
    };
    
    const findBook = (bookId: number) => MOCK_BOOKS.find(b => b.id === bookId);

    return (
        <div className="flex flex-col min-h-full">
            <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
                <div className="flex items-center p-4 h-16">
                    <h1 className="flex-1 text-center lg:text-left text-xl font-bold tracking-tight text-text-light dark:text-text-dark">
                        Minha Biblioteca
                    </h1>
                </div>
                <div className="flex justify-center lg:justify-start border-b border-zinc-200 dark:border-zinc-800 lg:px-4">
                    <button 
                        onClick={() => setActiveTab('books')}
                        className={`px-4 py-3 text-sm font-semibold transition-colors ${activeTab === 'books' ? 'text-primary border-b-2 border-primary' : 'text-text-muted-light dark:text-text-muted-dark'}`}
                    >
                        Meus Livros
                    </button>
                    <button 
                        onClick={() => setActiveTab('bookmarks')}
                        className={`px-4 py-3 text-sm font-semibold transition-colors ${activeTab === 'bookmarks' ? 'text-primary border-b-2 border-primary' : 'text-text-muted-light dark:text-text-muted-dark'}`}
                    >
                        Favoritos
                    </button>
                </div>
            </header>

            <main className="flex-1 px-4 lg:px-6 py-4">
                {activeTab === 'books' && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6">
                        {myBooks.map(book => (
                             <div key={book.id} className="flex flex-col gap-2 cursor-pointer" onClick={() => navigate('bookDetail', { bookId: book.id })}>
                                <img src={book.coverUrl} alt={book.title} className="w-full aspect-[2/3] object-cover rounded-lg shadow-md" />
                                <p className="text-sm font-semibold truncate text-text-light dark:text-text-dark">{book.title}</p>
                             </div>
                        ))}
                    </div>
                )}
                {activeTab === 'bookmarks' && (
                    <div className="flex flex-col gap-4">
                        {bookmarks.length > 0 ? bookmarks.map((bookmark, index) => {
                            const book = findBook(bookmark.bookId);
                            if (!book) return null;
                            const chapter = book.chapters.find(c => c.id === bookmark.chapterId);
                            return (
                                <div key={index} onClick={() => handleBookmarkClick(bookmark)} className="flex cursor-pointer flex-col gap-2 rounded-lg bg-card-light p-4 shadow-sm dark:bg-card-dark">
                                    <div className="flex items-center gap-3">
                                        <img src={book.coverUrl} alt={book.title} className="w-12 h-[72px] object-cover rounded-md" />
                                        <div>
                                            <p className="font-bold text-text-light dark:text-text-dark">{book.title}</p>
                                            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{book.author}</p>
                                            <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">Cap. {chapter?.id}: {chapter?.title}</p>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm italic text-text-light dark:text-text-dark line-clamp-3">
                                        "...{bookmark.text}..."
                                    </p>
                                </div>
                            );
                        }) : (
                             <div className="flex flex-col items-center justify-center text-center py-20 px-6">
                                <span className="material-symbols-outlined text-5xl text-text-muted-light dark:text-text-muted-dark">bookmark</span>
                                <h3 className="text-lg font-semibold mt-4">Nenhum Favorito</h3>
                                <p className="text-text-muted-light dark:text-text-muted-dark mt-1">
                                    Adicione parágrafos aos seus favoritos durante a leitura.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default LibraryScreen;
