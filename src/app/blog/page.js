'use client';

import React from 'react';
import Head from 'next/head';
import Menu from '@/components/LandingPage/Menu';
import Footer from '@/components/LandingPage/Footer';
import NewsGrid from '@/components/News/NewsGrid';

export default function NewsPage() {
  return (
    <>
      <Head>
        <title>Noticias | ArchCode</title>
        <meta
          name="description"
          content="Mantente al día con las últimas noticias y actualizaciones en el mundo de la arquitectura y construcción."
        />
        <meta
          name="keywords"
          content="noticias, arquitectura, construcción, normativa, actualidad, IA, inteligencia artificial"
        />
      </Head>
      <div className="bg-[#F5F5F5] overflow-x-hidden m-0 p-0 box-border">
        {/* Menú */}
        <Menu />

        <main className="font-personalizada min-h-screen flex flex-col">
          <section className="flex-grow">
            <div className="text-[#333333] py-12 mt-20">
              <div className="max-w-7xl mx-auto px-6">
                <h1 className="text-4xl font-bold mb-8 text-center">
                  Lo último sobre IA y Arquitectura
                </h1>
                <NewsGrid />
              </div>
            </div>
          </section>

          {/* Pie de Página */}
          <Footer />
        </main>
      </div>
    </>
  );
}
