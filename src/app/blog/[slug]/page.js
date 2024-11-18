import React from 'react';
import Head from 'next/head';
import Menu from '@/components/LandingPage/Menu';
import Footer from '@/components/LandingPage/Footer';
import ClientImage from '@/components/News/ClientImage';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { db } from '../../../../firebase-credentials';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { use } from 'react';

// Normaliza el contenido Markdown
function normalizeMarkdownContent(content) {
  return content
    .replace(/(\d\.)\s+/g, '$1 ')
    .replace(/---/g, '\n\n---\n\n')
    .replace(/(##\s.+)\n*/g, '\n\n$1\n\n')
    .replace(/(\*\*.+?\*\*)/g, '$1')
    .replace(/\.\s+/g, '.\n\n')
    .replace(/(1\.)/g, '\n$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Obtener datos de Firestore
async function fetchNewsData(slug) {
  const docRef = doc(db, 'News', slug);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('Noticia no encontrada');
  }

  return docSnap.data();
}

// Componente principal con manejo de `use`
export default function NewsDetail({ params }) {
  const { slug } = use(params);
  const newsItem = use(fetchNewsData(slug));

  const content = normalizeMarkdownContent(newsItem.content);
  const imagePath = `/images/news/${slug}.webp`;

  return (
    <>
      <Head>
        <title>{newsItem.title} | ArchCode</title>
        <meta name="description" content={newsItem.content?.slice(0, 150) || ''} />
      </Head>
      <div className="bg-[#F5F5F5] overflow-x-hidden m-0 p-0 box-border">
        <Menu />
        <main className="font-personalizada min-h-screen flex flex-col">
          <section className="flex-grow">
            <div className="text-[#333333] py-12 mt-32">
              <div className="max-w-5xl mx-auto px-6">
                {/* Título */}
                <h1 className="text-4xl font-bold mb-8">{newsItem.title}</h1>

                {/* Fecha */}
                <p className="text-sm text-gray-600 mb-8">{newsItem.date}</p>

                {/* Imagen */}
                <ClientImage
                  src={imagePath}
                  alt={newsItem.title}
                  className="w-full h-auto mb-8 rounded-lg shadow-md"
                />

                {/* Contenido */}
                <div className="prose prose-lg text-gray-800 leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      strong: ({ children }) => (
                        <span className="font-bold text-black">{children}</span>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-2xl font-bold text-black mt-6 mb-4">{children}</h2>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-6 mb-4">{children}</ol>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-6 mb-4">{children}</ul>
                      ),
                      li: ({ children }) => (
                        <li className="mb-2">{children}</li>
                      ),
                    }}
                  >
                    {content || 'Contenido no disponible.'}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </section>
          <Footer />
        </main>
      </div>
    </>
  );
}

// Generar rutas dinámicas para las noticias
export async function generateStaticParams() {
  try {
    const newsCollection = collection(db, 'News');
    const querySnapshot = await getDocs(newsCollection);

    return querySnapshot.docs.map((doc) => ({
      slug: doc.id,
    }));
  } catch (error) {
    console.error('Error al generar rutas estáticas:', error);
    return [];
  }
}

// Envolver en un Error Boundary
export function ErrorBoundary({ error }) {
  return (
    <div>
      <Menu />
      <main className="font-personalizada min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">{error.message || 'Error inesperado'}</h1>
      </main>
      <Footer />
    </div>
  );
}
