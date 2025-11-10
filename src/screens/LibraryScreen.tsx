
'use client';
import React, { useState, useEffect } from 'react';
import { Book, Bookmark, ReadingProgress, getAllReadingProgress, getAllBookmarks, getBooks } from '@/lib/actions';
import { Spinner } from '@/components/Spinner';
import { useUser } from '@/hooks/use-user';

interface LibraryScreenProps {
  navigate: (page: string, params?: any) => void;
}

interface BookWithProgress extends Book {
    progress: ReadingProgress;
}

const LibraryScreen: React.FC<LibraryScreenProps> = ({ navigate }) => {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState<'books' | 'bookmarks'>('books');
    const [myBooks, setMyBooks] = useState<BookWithProgress[]>([]);
    const [bookmarks, setBookmarks] = useState<(Bookmark & { book?: Book, chapter?: Book['chapters'][0] })[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLibraryData = async () => {
            if (!user) return;

            setIsLoading(true);
            
            if (activeTab === 'books') {
                const progressRecords = await getAllReadingProgress(user.id);
                const booksWithProgress = progressRecords.map(record => ({
                    ...record.book,
                    progress: record,
                })) as BookWithProgress[];
                setMyBooks(booksWithProgress);
            } else {
                const allBookmarks = await getAllBookmarks(user.id);
                setBookmarks(allBookmarks as (Bookmark & { book: Book, chapter: Book['chapters'][0]})[]);
            }
            setIsLoading(false);
        };

        fetchLibraryData();
    }, [activeTab, user]);

    const handleBookmarkClick = (bookmark: Bookmark) => {
        navigate('reader', { 
            bookId: bookmark.bookId, 
            chapterId: bookmark.chapterId,
            paragraph: bookmark.paragraphIndex
        });
    };

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
                {isLoading ? <div className="flex justify-center mt-8"><Spinner /></div> : 
                    <>
                        {activeTab === 'books' && (
                            myBooks.length > 0 ?
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6">
                                {myBooks.map(book => (
                                     <div key={book.id} className="flex flex-col gap-2 cursor-pointer" onClick={() => navigate('bookDetail', { bookId: book.id })}>
                                        <img src={book.coverUrl} alt={book.title} className="w-full aspect-[2/3] object-cover rounded-lg shadow-md" />
                                        <p className="text-sm font-semibold truncate text-text-light dark:text-text-dark">{book.title}</p>
                                     </div>
                                ))}
                            </div>
                            : <div className="flex flex-col items-center justify-center text-center py-20 px-6">
                                <span className="material-symbols-outlined text-5xl text-text-muted-light dark:text-text-muted-dark">book</span>
                                <h3 className="text-lg font-semibold mt-4">Nenhum Livro na Biblioteca</h3>
                                <p className="text-text-muted-light dark:text-text-muted-dark mt-1">
                                    Comece a ler um livro para adicioná-lo aqui.
                                </p>
                            </div>
                        )}
                        {activeTab === 'bookmarks' && (
                            <div className="flex flex-col gap-4">
                                {bookmarks.length > 0 ? bookmarks.map((bookmark) => {
                                    if (!bookmark.book) return null;
                                    return (
                                        <div key={bookmark.id} onClick={() => handleBookmarkClick(bookmark)} className="flex cursor-pointer flex-col gap-2 rounded-lg bg-card-light p-4 shadow-sm dark:bg-card-dark">
                                            <div className="flex items-center gap-3">
                                                <img src={bookmark.book.coverUrl} alt={bookmark.book.title} className="w-12 h-[72px] object-cover rounded-md" />
                                                <div>
                                                    <p className="font-bold text-text-light dark:text-text-dark">{bookmark.book.title}</p>
                                                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{bookmark.book.author}</p>
                                                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">Cap. {bookmark.chapter?.id}: {bookmark.chapter?.title}</p>
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
                    </>
                }
            </main>
        </div>
    );
};

export default LibraryScreen;
