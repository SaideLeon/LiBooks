
'use client';
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createBook, splitTextIntoVersesAction, updateBook } from '@/lib/actions';
import { Spinner } from '@/components/Spinner';
import { useUser } from '@/hooks/use-user';
import { BookWithChapters, NavigateFunction } from '@/lib/definitions';

interface BookFormScreenProps {
  goBack: () => void;
  navigate: NavigateFunction;
  existingBook?: BookWithChapters | null;
}

type FormData = {
  title: string;
  authorName: string;
  description: string;
  preface: string;
  coverUrl: string;
  chapters: {
    id?: number;
    title: string;
    subtitle: string;
    content: string; // This will be the raw text from the textarea
  }[];
};

const BookFormScreen: React.FC<BookFormScreenProps> = ({ goBack, navigate, existingBook }) => {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSplittingVerse, setIsSplittingVerse] = useState<number | null>(null);
  const { toast } = useToast();
  
  const isEditing = !!existingBook;

  const { register, control, handleSubmit, formState: { errors }, reset, getValues, setValue } = useForm<FormData>({
    defaultValues: {
      title: '',
      authorName: '',
      description: '',
      preface: '',
      coverUrl: '',
      chapters: [{ title: '', subtitle: '', content: '' }],
    },
  });

  useEffect(() => {
    if (isEditing && existingBook) {
        reset({
            title: existingBook.title,
            authorName: existingBook.authorName,
            description: existingBook.description,
            preface: existingBook.preface || '',
            coverUrl: existingBook.coverUrl,
            chapters: existingBook.chapters?.map(c => ({
              ...c, 
              subtitle: c.subtitle || '', // Handle null subtitle
              // Prioritize rawContent, fall back to joining the array for old data
              content: c.rawContent || (Array.isArray(c.content) ? c.content.join('\n\n') : ''),
            })) || [{ title: '', subtitle: '', content: '' }],
        });
    }
  }, [isEditing, existingBook, reset]);


  const { fields, append, remove } = useFieldArray({
    control,
    name: 'chapters',
  });

  const handleVerseSplit = async (chapterIndex: number) => {
    const content = getValues(`chapters.${chapterIndex}.content`);
    if (!content || !content.trim()) {
      toast({
        variant: 'destructive',
        title: 'Conteúdo vazio',
        description: 'Escreva o conteúdo do capítulo antes de usar a IA.',
      });
      return;
    }

    setIsSplittingVerse(chapterIndex);
    try {
      const cleanedContent = content.replace(/(\r\n|\n|\r)/gm, ' '); // Remove all line breaks
      const verses = await splitTextIntoVersesAction(cleanedContent);
      setValue(`chapters.${chapterIndex}.content`, verses.join('\n\n'));
      toast({
        title: 'Conteúdo dividido!',
        description: 'O texto foi formatado em versículos pela IA.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro da IA',
        description: 'Não foi possível dividir o texto. Tente novamente.',
      });
    } finally {
      setIsSplittingVerse(null);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Erro de autenticação',
            description: 'Você precisa estar logado para publicar ou editar um livro.',
        });
        return;
    }

    setIsSubmitting(true);
    try {
        // Data is now sent directly without client-side processing

        const bookData = {
            ...data,
            authorId: user.id, // Ensure authorId is included
        };

        let newOrUpdatedBook;
        if (isEditing && existingBook) {
            newOrUpdatedBook = await updateBook(existingBook.id, bookData);
            toast({
                title: 'Livro atualizado com sucesso!',
                description: `"${newOrUpdatedBook?.title}" foi atualizado.`,
            });
        } else {
            newOrUpdatedBook = await createBook(bookData);
            toast({
                title: 'Livro publicado com sucesso!',
                description: `"${newOrUpdatedBook.title}" está agora disponível.`,
            });
        }
        navigate('bookDetail', { bookId: newOrUpdatedBook?.id });

    } catch (error) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: `Erro ao ${isEditing ? 'atualizar' : 'publicar'} livro`,
            description: `Não foi possível salvar o livro. Tente novamente.`,
        });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const headerTitle = isEditing ? 'Editar Livro' : 'Publicar Livro';
  const submitButtonText = isEditing ? 'Salvar Alterações' : 'Publicar';

  return (
    <div className="flex h-dvh flex-col bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200/50 bg-background-light/80 px-4 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-background-dark/80">
        <Button variant="ghost" size="icon" onClick={goBack}>
          <span className="material-symbols-outlined">close</span>
        </Button>
        <h1 className="flex-1 text-center text-lg font-bold">{headerTitle}</h1>
        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? <><Spinner /> Salvando...</> : submitButtonText}
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-6 space-y-8">
          {/* Book Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Detalhes do Livro</h2>
            <div>
              <Label htmlFor="title">Título</Label>
              <Input id="title" {...register('title', { required: 'Título é obrigatório' })} />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>
             <div>
              <Label htmlFor="authorName">Nome do Autor</Label>
              <Input id="authorName" {...register('authorName', { required: 'Nome do autor é obrigatório' })} />
              {errors.authorName && <p className="text-red-500 text-sm mt-1">{errors.authorName.message}</p>}
            </div>
            <div>
              <Label htmlFor="coverUrl">URL da Capa</Label>
              <Input id="coverUrl" {...register('coverUrl', { required: 'URL da capa é obrigatória' })} placeholder="https://exemplo.com/capa.jpg" />
              {errors.coverUrl && <p className="text-red-500 text-sm mt-1">{errors.coverUrl.message}</p>}
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" {...register('description', { required: 'Descrição é obrigatória' })} />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>
             <div>
              <Label htmlFor="preface">Prefácio</Label>
              <Textarea id="preface" {...register('preface')} />
            </div>
          </div>

          {/* Chapters */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">Capítulos</h2>
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 p-4 border rounded-lg relative">
                 <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-destructive"
                  onClick={() => remove(index)}
                >
                  <span className="material-symbols-outlined">delete</span>
                </Button>
                <h3 className="font-semibold text-lg">Capítulo {index + 1}</h3>
                <div>
                  <Label htmlFor={`chapters.${index}.title`}>Título do Capítulo</Label>
                  <Input
                    id={`chapters.${index}.title`}
                    {...register(`chapters.${index}.title` as const, { required: 'Título do capítulo é obrigatório' })}
                  />
                  {errors.chapters?.[index]?.title && <p className="text-red-500 text-sm mt-1">{errors.chapters[index]?.title?.message}</p>}
                </div>
                 <div>
                  <Label htmlFor={`chapters.${index}.subtitle`}>Subtítulo (Opcional)</Label>
                  <Input
                    id={`chapters.${index}.subtitle`}
                    {...register(`chapters.${index}.subtitle` as const)}
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor={`chapters.${index}.content`}>Conteúdo do Capítulo</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleVerseSplit(index)}
                      disabled={isSplittingVerse === index}
                    >
                      {isSplittingVerse === index ? <><Spinner /> Dividindo...</> : 'Dividir com IA'}
                    </Button>
                  </div>
                  <Textarea
                    id={`chapters.${index}.content`}
                    {...register(`chapters.${index}.content` as const, { required: 'Conteúdo é obrigatório' })}
                    rows={10}
                    placeholder="Escreva o conteúdo do capítulo aqui. Use uma linha por parágrafo."
                  />
                   {errors.chapters?.[index]?.content && <p className="text-red-500 text-sm mt-1">{errors.chapters[index]?.content?.message}</p>}
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => append({ title: '', subtitle: '', content: '' })}>
              <span className="material-symbols-outlined mr-2">add</span>
              Adicionar Capítulo
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default BookFormScreen;
