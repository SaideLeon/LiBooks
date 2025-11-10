import React, { useState } from 'react';
import { Book } from '../types';
import { MOCK_BOOKS } from '../data';
import { SearchIcon } from '../components/icons/NavIcons';

interface SearchScreenProps {
  navigate: (page: string, params?: any) => void;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filteredBooks = MOCK_BOOKS.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filters = ['Todos', 'Por Título', 'Por Autor', 'Recentes'];

  return (
    <div className="flex flex-col min-h-full">
      <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-sm">
        <div className="flex items-center p-4 pb-2 h-16">
          <h1 className="flex-1 text-center text-xl font-bold tracking-tight text-white">
            Buscar Livros
          </h1>
        </div>

        <div className="px-4 py-3">
          <div className="relative flex items-center w-full h-12 rounded-xl bg-slate-800 shadow-sm">
            <div className="absolute left-0 flex items-center justify-center pl-4 pointer-events-none text-gray-400">
              <SearchIcon />
            </div>
            <input
              className="w-full h-full bg-transparent border-none rounded-xl pl-12 pr-4 text-white placeholder:text-gray-400 focus:outline-none focus:ring-0 text-base"
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
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-gray-300'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 px-4 py-4">
        <div className="flex flex-col gap-4">
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
                  <p className="text-white text-base font-bold leading-tight line-clamp-2">
                    {book.title}
                  </p>
                  <p className="text-gray-400 text-sm font-normal leading-normal">
                    {book.author}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 px-6">
                <div className="relative text-gray-500">
                    <SearchIcon />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="absolute -top-3 -right-3 w-8 h-8 text-gray-500 bg-slate-900 rounded-full">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                </div>
              <h3 className="text-lg font-semibold text-white mt-4">
                Nenhum livro encontrado
              </h3>
              <p className="text-gray-400 mt-1">
                Tente usar outros termos para a sua busca.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchScreen;
