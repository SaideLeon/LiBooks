import { Metadata } from 'next'
import { getBookById } from '@/lib/actions'
import { notFound } from 'next/navigation'

// Gera metadados dinâmicos para cada livro
export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  const book = await getBookById(parseInt(params.id))
  
  if (!book) {
    return {
      title: 'Livro não encontrado',
    }
  }

  return {
    title: `${book.title} - ${book.authorName}`,
    description: book.description,
    
    openGraph: {
      title: book.title,
      description: book.description,
      type: 'book',
      authors: [book.authorName],
      images: [
        {
          url: book.coverUrl,
          width: 400,
          height: 600,
          alt: book.title,
        },
      ],
    },
    
    twitter: {
      card: 'summary_large_image',
      title: book.title,
      description: book.description,
      images: [book.coverUrl],
    },
  }
}

// Página renderizada no servidor
export default async function BookPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const book = await getBookById(parseInt(params.id))
  
  if (!book) {
    notFound()
  }

  // Structured Data JSON-LD para o livro
  const bookStructuredData = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": book.title,
    "author": {
      "@type": "Person",
      "name": book.authorName
    },
    "description": book.description,
    "image": book.coverUrl,
    "datePublished": book.createdAt.toISOString(),
    "publisher": {
      "@type": "Organization",
      "name": "LitBook"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "0" // Adicione contador real se tiver
    }
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(bookStructuredData)
        }}
      />
      
      {/* Conteúdo renderizado no servidor para SEO */}
      <article itemScope itemType="https://schema.org/Book" className="max-w-4xl mx-auto p-4 md:p-8 text-foreground">
        <meta itemProp="name" content={book.title} />
        <meta itemProp="author" content={book.authorName} />
        <meta itemProp="description" content={book.description} />
        <meta itemProp="image" content={book.coverUrl} />
        
        <div className="md:grid md:grid-cols-12 md:gap-8 lg:gap-12">
            <div className="flex flex-col items-center md:col-span-4">
                <img itemProp="image" src={book.coverUrl} alt={book.title} className="rounded-lg shadow-lg w-44 md:w-full" />
            </div>
            <div className="md:col-span-8 mt-4 md:mt-0">
                <h1 itemProp="headline" className="text-3xl md:text-4xl font-bold">{book.title}</h1>
                <p itemProp="author" className="text-xl text-muted-foreground mt-1">{book.authorName}</p>
                <div itemProp="description" className="mt-4 text-base leading-relaxed">
                  {book.description}
                </div>
            </div>
        </div>

        
        {book.preface && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">Prefácio</h2>
            <div itemProp="abstract" className="prose dark:prose-invert max-w-none">{book.preface}</div>
          </div>
        )}
        
        {/* Lista de capítulos */}
        <div className="mt-8">
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">Capítulos</h2>
            <div itemProp="hasPart" itemScope itemType="https://schema.org/Chapter" className="space-y-4">
            {book.chapters?.map((chapter, index) => (
                <div key={chapter.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <h3 itemProp="name" className="text-xl font-semibold">Capítulo {index + 1}: {chapter.title}</h3>
                    {chapter.subtitle && <p itemProp="description" className="text-muted-foreground">{chapter.subtitle}</p>}
                </div>
            ))}
            </div>
        </div>
      </article>
    </>
  )
}