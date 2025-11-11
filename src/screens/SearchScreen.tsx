
'use client';
import React, { useState, useEffect } from 'react';
import { Book } from '@/lib/prisma/definitions';
import { getBooks } from '@/lib/actions';
import { Spinner } from '@/components/Spinner';

interface SearchScreenProps {
  navigate: (page: string, params?: any) => void;
}

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);


const SearchScreen: React.FC<SearchScreenProps> = ({ navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllBooks = async () => {
        setIsLoading(true);
        const books = await getBooks();
        setAllBooks(books as Book[]);
        setIsLoading(false);
    }
    fetchAllBooks();
  }, []);

  const filteredBooks = allBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filters = ['Todos', 'Por Título', 'Por Autor', 'Recentes'];

  return (
    <div className="flex flex-col min-h-full bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="flex items-center p-4 pb-2 h-16">
          <h1 className="flex-1 text-center lg:text-left text-xl font-bold tracking-tight text-text-light dark:text-text-dark">
            Buscar Livros
          </h1>
        </div>

        <div className="px-4 py-3">
          <div className="relative flex items-center w-full h-12 rounded-xl bg-card-light dark:bg-card-dark shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
            <div className="absolute left-0 flex items-center justify-center pl-4 pointer-events-none text-text-muted-light dark:text-text-muted-dark">
              <SearchIcon />
            </div>
            <input
              className="w-full h-full bg-transparent border-none rounded-xl pl-12 pr-4 text-text-light dark:text-text-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Pesquisar por título, autor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 px-4 pb-4 overflow-x-auto">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex h-9 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? 'bg-primary text-white'
                  : 'bg-card-light dark:bg-card-dark text-text-muted-light dark:text-text-muted-dark'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 px-4 py-4">
        {isLoading ? <div className="flex justify-center mt-8"><Spinner /></div> : <div className="flex flex-col gap-4">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => navigate('bookDetail', { bookId: book.id })}
                className="flex cursor-pointer items-stretch justify-between gap-4"
              >
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-24 h-36 flex-shrink-0 object-cover rounded-lg"
                />
                <div className="flex flex-1 flex-col justify-center gap-1 py-2">
                  <p className="text-text-light dark:text-text-dark text-base font-bold leading-tight line-clamp-2">
                    {book.title}
                  </p>
                  <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal">
                    {book.author}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 px-6">
                <div className="relative text-text-muted-light dark:text-text-muted-dark">
                    <SearchIcon />
                </div>
              <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mt-4">
                Nenhum livro encontrado
              </h3>
              <p className="text-text-muted-light dark:text-text-muted-dark mt-1">
                Tente usar outros termos para a sua busca.
              </p>
            </div>
          )}
        </div>}
      </main>
    </div>
  );
};

export default SearchScreen;
