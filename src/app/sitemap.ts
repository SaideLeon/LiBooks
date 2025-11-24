import { MetadataRoute } from 'next'
import { getBooks } from '@/lib/actions'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://litbook.app' // MUDE PARA SEU DOMÍNIO
  
  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  // Páginas dinâmicas (livros)
  try {
    const books = await getBooks()
    const bookPages: MetadataRoute.Sitemap = books.map((book) => ({
      url: `${baseUrl}/books/${book.id}`,
      lastModified: book.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    return [...staticPages, ...bookPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
