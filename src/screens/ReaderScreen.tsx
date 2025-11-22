
'use client';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { marked } from 'marked';
import { saveReadingProgress, addBookmark, removeBookmark, isBookmarked, createActivity } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import { BookWithChapters } from '@/lib/definitions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { generateAnnotation as generateAnnotationFlow } from '@/ai/flows/annotation-generator';

interface ReaderScreenProps {
  book: BookWithChapters;
  chapterId: number;
  paragraph?: number;
  goBack: () => void;
}

interface ReaderToolbarProps {
    isBookmarked: boolean;
    onBookmarkToggle: () => void;
}

const ReaderToolbar: React.FC<ReaderToolbarProps> = ({ isBookmarked, onBookmarkToggle }) => (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-background-light dark:bg-background-dark shadow-[0_-1px_3px_rgba(0,0,0,0.1)] dark:shadow-[0_-1px_3px_rgba(0,0,0,0.5)] max-w-lg mx-auto">
        <div className="flex h-16 items-center justify-around border-t border-zinc-200 dark:border-zinc-800">
            <button onClick={onBookmarkToggle} className={`flex size-12 items-center justify-center rounded-full ${isBookmarked ? 'text-secondary' : 'text-zinc-600 dark:text-zinc-300'}`}>
                <span className="material-symbols-outlined text-2xl" style={isBookmarked ? {fontVariationSettings: "'FILL' 1"} : {}}>{isBookmarked ? 'bookmark' : 'bookmark_add'}</span>
            </button>
            <button className="flex size-12 items-center justify-center rounded-full text-zinc-600 dark:text-zinc-300">
                <span className="material-symbols-outlined text-2xl">format_ink_highlighter</span>
            </button>
            <button className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>edit_note</span>
            </button>
            <button className="flex size-12 items-center justify-center rounded-full text-zinc-600 dark:text-zinc-300">
                <span className="material-symbols-outlined text-2xl">share</span>
            </button>
        </div>
        <div style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}></div>
    </div>
);


const ReaderScreen: React.FC<ReaderScreenProps> = ({ book, chapterId, paragraph, goBack }) => {
  const { user: currentUser } = useUser();
  const [currentChapterId, setCurrentChapterId] = useState(chapterId);
  const currentChapter = book.chapters?.find(c => c.id === currentChapterId);
  const [selectedParagraph, setSelectedParagraph] = useState<number | null>(paragraph || null);
  const [annotations, setAnnotations] = useState<Record<number, string>>({});
  const [loadingAnnotation, setLoadingAnnotation] = useState<number | null>(null);
  const [isCurrentParagraphBookmarked, setIsCurrentParagraphBookmarked] = useState(false);
  const paragraphRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { toast } = useToast();
  const [isChapterListOpen, setIsChapterListOpen] = useState(false);

  const handleChapterChange = (newChapterId: number) => {
    setCurrentChapterId(newChapterId);
    setSelectedParagraph(null);
    setAnnotations({});
    setIsChapterListOpen(false);
  };
  
  useEffect(() => {
    if (paragraph && paragraphRefs.current[paragraph - 1]) {
        setTimeout(() => {
            paragraphRefs.current[paragraph - 1]?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }, 100);
    }
  }, [paragraph]);
  
  const checkBookmarkStatus = useCallback(async (paragraphIdx: number) => {
    if (!currentUser || !currentChapter) return;
    const bookmarked = await isBookmarked(currentUser.id, book.id, currentChapter.id, paragraphIdx);
    setIsCurrentParagraphBookmarked(bookmarked);
  }, [currentUser, book.id, currentChapter]);

  useEffect(() => {
    const updateProgressAndBookmark = async () => {
        if (selectedParagraph && currentChapter && currentUser) {
            await saveReadingProgress(currentUser.id, book.id, currentChapter.id, selectedParagraph);
            await checkBookmarkStatus(selectedParagraph);
        }
    }
    updateProgressAndBookmark();
  }, [selectedParagraph, book.id, currentChapter, currentUser, checkBookmarkStatus]);

  const generateAnnotation = useCallback(async (paragraphText: string, paragraphIndex: number) => {
    setLoadingAnnotation(paragraphIndex);
    try {
      if (!currentChapter || !Array.isArray(currentChapter.content)) {
        throw new Error("Capítulo ou conteúdo não encontrado.");
      }

      const previousVerses = currentChapter.content
        .slice(Math.max(0, paragraphIndex - 6), paragraphIndex - 1)
        .filter((p): p is string => typeof p === 'string');

      const input = {
        selectedVerse: paragraphText,
        previousVerses: previousVerses,
        bookTitle: book.title,
        authorName: book.authorName,
      };

      const result = await generateAnnotationFlow(input);
      const parsedAnnotation = await marked.parse(result.annotation) as string;
      setAnnotations(prev => ({ ...prev, [paragraphIndex]: parsedAnnotation }));

    } catch (error) {
      console.error("Error generating annotation:", error);
      toast({
          variant: "destructive",
          title: "Erro de IA",
          description: "Não foi possível gerar a anotação.",
      });
      setAnnotations(prev => ({ ...prev, [paragraphIndex]: "<p>Não foi possível gerar a anotação.</p>" }));
    } finally {
      setLoadingAnnotation(null);
    }
  }, [toast, currentChapter, book.title, book.authorName]);

  const handleParagraphClick = useCallback((paragraphIndex: number, paragraphText: string) => {
    const isCurrentlySelected = selectedParagraph === paragraphIndex;
    setSelectedParagraph(isCurrentlySelected ? null : paragraphIndex);

    if (!isCurrentlySelected && !annotations[paragraphIndex] && paragraphText) {
      generateAnnotation(paragraphText, paragraphIndex);
    }
  }, [selectedParagraph, annotations, generateAnnotation]);
  
  const handleBookmarkToggle = async () => {
    if (!selectedParagraph || !currentChapter || !currentUser || !Array.isArray(currentChapter.content)) return;
    const paragraphText = currentChapter.content[selectedParagraph - 1];

    if (typeof paragraphText !== 'string') return;

    if (isCurrentParagraphBookmarked) {
        await removeBookmark(currentUser.id, book.id, currentChapter.id, selectedParagraph);
        toast({ title: "Favorito removido" });
    } else {
        await addBookmark(currentUser.id, book.id, currentChapter.id, selectedParagraph, paragraphText);
        await createActivity(currentUser.id, "ADDED_BOOKMARK", book.id, `Marcou um favorito em '${book.title}'`);
        setIsCurrentParagraphBookmarked(true);
        toast({ title: "Adicionado aos favoritos" });
    }
  };

  const chapterIndex = book.chapters?.findIndex(c => c.id === currentChapterId) ?? -1;
  const chapterNumber = chapterIndex + 1;

  if (!currentChapter) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p>Capítulo não encontrado.</p>
        <button onClick={goBack} className="mt-4 px-4 py-2 bg-primary text-white rounded">Voltar</button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background-light dark:bg-background-dark text-zinc-800 dark:text-zinc-200 pb-20">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-background-light/80 px-4 backdrop-blur-sm dark:bg-background-dark/80">
        <button onClick={goBack} className="flex size-10 items-center justify-center rounded-full">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <div className="text-center">
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{book.title}</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Capítulo {chapterNumber}</p>
        </div>
        <AlertDialog open={isChapterListOpen} onOpenChange={setIsChapterListOpen}>
          <AlertDialogTrigger asChild>
            <button className="flex size-10 items-center justify-center rounded-full">
                <span className="material-symbols-outlined text-2xl">menu_book</span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Capítulos</AlertDialogTitle>
              <AlertDialogDescription>
                Selecione um capítulo para navegar.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="max-h-60 overflow-y-auto">
              {book.chapters?.map((chap, index) => (
                <a key={chap.id} href="#" onClick={(e) => { e.preventDefault(); handleChapterChange(chap.id); }} className={`block p-2 rounded-md hover:bg-accent ${chap.id === currentChapterId ? 'bg-accent font-bold' : ''}`}>
                  Capítulo {index + 1}: {chap.title}
                </a>
              ))}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pt-4 pb-20">
       <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100 text-center">{currentChapter.title}</h2>
        <div className="space-y-6">
          {Array.isArray(currentChapter.content) && currentChapter.content.map((paragraph, index) => {
            const paraIndex = index + 1;
            const isSelected = selectedParagraph === paraIndex;
            return (
              <div
                key={index}
                ref={el => {paragraphRefs.current[index] = el;}}
                onClick={() => typeof paragraph === 'string' && handleParagraphClick(paraIndex, paragraph)}
                className={`flex items-start gap-4 transition-colors duration-200 rounded-lg cursor-pointer ${isSelected ? 'bg-primary/10 p-4 -mx-4 ring-2 ring-primary' : 'p-4 -mx-4'}`}
              >
                <span className="text-lg font-bold text-primary pt-0.5">{paraIndex}</span>
                <div className="flex-1">
                    {typeof paragraph === 'string' && <p className="text-lg leading-relaxed">{paragraph}</p>}
                    {isSelected && (
                        <div className="mt-4 rounded-lg border border-zinc-200 bg-white/50 p-3 dark:border-zinc-700 dark:bg-black/20">
                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Anotação da IA</p>
                            {loadingAnnotation === paraIndex ? (
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300">Gerando anotação...</p>
                                </div>
                            ) : (
                                <div
                                    className="prose prose-sm dark:prose-invert mt-1 max-w-none text-zinc-700 dark:text-zinc-300 prose-headings:text-zinc-800 dark:prose-headings:text-zinc-200 prose-strong:text-zinc-800 dark:prose-strong:text-zinc-200"
                                    dangerouslySetInnerHTML={{ __html: annotations[paraIndex] || '' }}
                                />
                            )}
                        </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </main>
      
      {selectedParagraph !== null && <ReaderToolbar isBookmarked={isCurrentParagraphBookmarked} onBookmarkToggle={handleBookmarkToggle} />}
    </div>
  );
};

export default ReaderScreen;
