'use client';
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createBook } from '@/lib/actions';
import { Spinner } from '@/components/Spinner';
import { useUser } from '@/hooks/use-user';
import { Book } from '@/lib/prisma/definitions';

interface BookFormScreenProps {
  goBack: () => void;
  navigate: (page: string, params?: any) => void;
  existingBook?: Book | null;
}

type FormData = {
  title: string;
  author: string;
  description: string;
  preface: string;
  coverUrl: string;
  chapters: {
    title: string;
    subtitle: string;
    content: string;
  }[];
};

const BookFormScreen: React.FC<BookFormScreenProps> = ({ goBack, navigate, existingBook }) => {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const isEditing = !!existingBook;

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    defaultValues: {
      title: '',
      author: '',
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
            author: existingBook.author,
            description: existingBook.description,
            preface: existingBook.preface,
            coverUrl: existingBook.coverUrl,
            chapters: existingBook.chapters?.map(c => ({...c, content: Array.isArray(c.content) ? c.content.join('\n') : c.content || ''})) || [{ title: '', subtitle: '', content: '' }],
        });
    }
  }, [isEditing, existingBook, reset]);


  const { fields, append, remove } = useFieldArray({
    control,
    name: 'chapters',
  });

  const onSubmit = async (data: FormData) => {
    if (isEditing) {
        // TODO: Implement update logic
        console.log("Updating book:", data);
        toast({
            title: 'Funcionalidade em desenvolvimento',
            description: 'A edição de livros será implementada em breve.',
        });
        return;
    }

    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Erro de autenticação',
            description: 'Você precisa estar logado para publicar um livro.',
        });
        return;
    }
    setIsSubmitting(true);
    try {
      const newBook = await createBook({...data, authorId: user.id });
      toast({
        title: 'Livro publicado com sucesso!',
        description: `"${newBook.title}" está agora disponível.`,
      });
      navigate('bookDetail', { bookId: newBook.id });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erro ao publicar livro',
        description: 'Não foi possível salvar o livro. Tente novamente.',
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
          {isSubmitting ? <><Spinner /> Publicando...</> : submitButtonText}
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
              <Label htmlFor="author">Nome do Autor</Label>
              <Input id="author" {...register('author', { required: 'Autor é obrigatório' })} />
              {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>}
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
                  <Label htmlFor={`chapters.${index}.content`}>Conteúdo do Capítulo</Label>
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
