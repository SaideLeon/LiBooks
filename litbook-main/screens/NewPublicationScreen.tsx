import React, { useState } from 'react';
import { MOCK_USER_PROFILE } from '../data';
import VerseSearchModal from '../components/VerseSearchModal';

interface NewPublicationScreenProps {
  goBack: () => void;
}

const NewPublicationScreen: React.FC<NewPublicationScreenProps> = ({ goBack }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>('https://lh3.googleusercontent.com/aida-public/AB6AXuAVMIRrobj52bhxvIkoHglmUMJUxGXm7Rfs5-r_Qii5vQYSsTOZErbvJfeYn_pCL_KUGbyHEX_5ipW8KOUPEfdKKEpStT2KZLenreJpwjpOxh1WpDyHjt7OcHwUx4Oiwvn7-GLq3MB3QBvdmYHtx0PeKig2URJkeHoYAt4WupmwXSsWaeOxb3JUkhgzvXwAf80C6QV4u4WHUg-8yx_HnzDbE7wtgzzxiQGY4q4ljzNkXn5VPRtoU2mKkEHRu8IQl5McvXUsqVOn4x0');
  const [verses, setVerses] = useState<string[]>(['Gênesis 1:1', 'João 3:16']);
  const [isVerseSearchOpen, setIsVerseSearchOpen] = useState(false);

  const removeVerse = (verseToRemove: string) => {
    setVerses(verses.filter(v => v !== verseToRemove));
  };
  
  const handleAddVerse = (verse: string) => {
    if (!verses.includes(verse)) {
      setVerses(prev => [...prev, verse]);
    }
    setIsVerseSearchOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <div className="flex h-dvh flex-col bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200/50 bg-background-light/80 px-4 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-background-dark/80">
        <button onClick={goBack} className="flex size-10 items-center justify-center">
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold">Nova Publicação</h1>
        <button onClick={goBack} className="flex h-10 w-auto items-center justify-center px-2">
          <p className="text-base font-bold text-primary">Publicar</p>
        </button>
      </header>
      
      <main className="flex-1 overflow-y-auto">
        <div className="flex items-start gap-3 p-4">
          <img className="mt-3 size-10 shrink-0 rounded-full object-cover" src={MOCK_USER_PROFILE.avatarUrl} alt="User avatar" />
          <div className="flex min-w-0 flex-1 flex-col">
            <textarea
              className="w-full resize-none border-0 bg-transparent p-0 pt-3 text-base placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:ring-0"
              rows={5}
              placeholder="Escreva sua reflexão aqui..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {image && (
              <div className="relative mt-4 w-full max-w-sm overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                <img src={image} alt="Preview" className="h-full w-full object-cover" />
                <button onClick={() => setImage(null)} className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm">
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3 px-4 pb-4">
          {verses.map((verse) => (
            <div key={verse} className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/20 pl-4 pr-2">
              <p className="text-sm font-medium text-primary">{verse}</p>
              <button onClick={() => removeVerse(verse)} className="text-primary">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          ))}
        </div>
      </main>

      <div className="mt-auto border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
            <div className="flex items-center gap-1">
                <button className="flex items-center justify-center rounded-md p-1.5 text-text-muted-light dark:text-text-muted-dark hover:bg-zinc-500/10">
                    <span className="material-symbols-outlined text-2xl">format_bold</span>
                </button>
                <button className="flex items-center justify-center rounded-md p-1.5 text-text-muted-light dark:text-text-muted-dark hover:bg-zinc-500/10">
                    <span className="material-symbols-outlined text-2xl">format_italic</span>
                </button>
                <button className="flex items-center justify-center rounded-md p-1.5 text-text-muted-light dark:text-text-muted-dark hover:bg-zinc-500/10">
                    <span className="material-symbols-outlined text-2xl">format_list_bulleted</span>
                </button>
                <label className="flex cursor-pointer items-center justify-center rounded-md p-1.5 text-text-muted-light dark:text-text-muted-dark hover:bg-zinc-500/10">
                    <span className="material-symbols-outlined text-2xl">image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
            </div>
            <button onClick={() => setIsVerseSearchOpen(true)} className="flex h-10 min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-4 text-sm font-medium text-white">
                <span className="material-symbols-outlined text-lg">add</span>
                <span className="truncate">Adicionar Versículo</span>
            </button>
        </div>
        <div style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}></div>
      </div>

      {isVerseSearchOpen && <VerseSearchModal onAddVerse={handleAddVerse} onClose={() => setIsVerseSearchOpen(false)} />}
    </div>
  );
};

export default NewPublicationScreen;