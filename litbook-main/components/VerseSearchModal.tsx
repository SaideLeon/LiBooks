import React, { useState, useEffect } from 'react';

const BIBLE_VERSES = [
  "Gênesis 1:1", "Gênesis 1:26", "Gênesis 2:24",
  "Êxodo 20:3", "Êxodo 20:12",
  "Salmos 23:1", "Salmos 91:1", "Salmos 119:105",
  "Provérbios 3:5-6", "Provérbios 4:23",
  "Isaías 40:31", "Isaías 53:5",
  "Jeremias 29:11",
  "Mateus 6:33", "Mateus 28:19-20",
  "Marcos 10:45",
  "Lucas 6:31",
  "João 3:16", "João 14:6",
  "Romanos 8:28", "Romanos 12:2",
  "1 Coríntios 13:4-7",
  "Gálatas 5:22-23",
  "Efésios 2:8-9",
  "Filipenses 4:13",
  "Hebreus 11:1",
  "Apocalipse 21:4"
];

interface VerseSearchModalProps {
  onAddVerse: (verse: string) => void;
  onClose: () => void;
}

const VerseSearchModal: React.FC<VerseSearchModalProps> = ({ onAddVerse, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = BIBLE_VERSES.filter(verse =>
      verse.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
    setResults(filtered);
  }, [debouncedQuery]);

  return (
    <div className="fixed inset-0 z-50 flex h-dvh w-full flex-col bg-background-light dark:bg-background-dark max-w-lg mx-auto">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200/50 px-4 dark:border-zinc-800/50">
        <button onClick={onClose} className="flex size-10 items-center justify-center">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold">Adicionar Versículo</h1>
        <div className="size-10"></div>
      </header>

      <div className="p-4">
        <div className="relative flex items-center w-full h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 shadow-sm">
          <div className="absolute left-0 flex items-center justify-center pl-4 pointer-events-none text-text-muted-light dark:text-text-muted-dark">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input
            className="w-full h-full bg-transparent border-none rounded-xl pl-12 pr-4 text-text-light dark:text-text-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Ex: Gênesis 1:1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>
      
      <main className="flex-1 overflow-y-auto">
        {results.length > 0 ? (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {results.map(verse => (
                    <div key={verse} className="flex items-center justify-between p-4">
                        <p className="text-base text-text-light dark:text-text-dark">{verse}</p>
                        <button onClick={() => onAddVerse(verse)} className="flex h-9 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary/10 px-4 text-sm font-medium text-primary hover:bg-primary/20">
                            <span className="material-symbols-outlined text-lg">add</span>
                            <span>Adicionar</span>
                        </button>
                    </div>
                ))}
            </div>
        ) : (
            debouncedQuery.length > 0 && (
                <div className="flex flex-col items-center justify-center text-center p-10">
                    <span className="material-symbols-outlined text-5xl text-text-muted-light dark:text-text-muted-dark">search_off</span>
                    <h3 className="text-lg font-semibold mt-4">Nenhum versículo encontrado</h3>
                    <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Tente uma busca diferente.</p>
                </div>
            )
        )}
      </main>
    </div>
  );
};

export default VerseSearchModal;