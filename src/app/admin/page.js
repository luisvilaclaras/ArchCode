// src/app/admin/page.js

"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/context/AuthContext';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase-credentials';
import { getAuth } from 'firebase/auth';

// Componente ReviewCard
function ReviewCard({ review }) {
  const [isVisible, setIsVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(false);
  const [errorUserInfo, setErrorUserInfo] = useState(null);

  // Función helper para determinar si una reseña es de hoy
  const isReviewToday = (createdAt) => {
    if (!createdAt) return false;

    const reviewDate = createdAt; // 'createdAt' ya es un objeto Date
    const today = new Date();
    return (
      reviewDate.getDate() === today.getDate() &&
      reviewDate.getMonth() === today.getMonth() &&
      reviewDate.getFullYear() === today.getFullYear()
    );
  };

  // Función para obtener la información del usuario
  const fetchUserInfo = async () => {
    setIsLoadingUserInfo(true);
    setErrorUserInfo(null);
    try {
      const userDocRef = doc(db, 'Users', review.userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserInfo(userDoc.data());
      } else {
        setErrorUserInfo('No se encontró información del usuario.');
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
      setErrorUserInfo('Error al obtener información del usuario.');
    }
    setIsLoadingUserInfo(false);
  };

  // Handler para el botón "Obtener info del usuario"
  const handleToggleUserInfo = () => {
    if (!isVisible && !userInfo && !isLoadingUserInfo) {
      fetchUserInfo();
    }
    setIsVisible(!isVisible);
  };

  // Handler para el botón "Descargar txt"
  const handleDownloadTxt = () => {
    if (review.txtWebContentLink) {
      window.open(review.txtWebContentLink, '_blank');
    } else {
      alert('Enlace de descarga de TXT no disponible.');
    }
  };

  // Handler para el botón "Ver PDF"
  const handleViewPdf = () => {
    if (review.pdfWebViewLink) {
      window.open(review.pdfWebViewLink, '_blank');
    } else {
      alert('Enlace para ver el PDF no disponible.');
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-lg ${isReviewToday(review.createdAt) ? 'bg-[#2A3E5A]' : 'bg-[#1A1E36]'}`}>
      {/* Etiqueta "Enviados hoy" */}
      {isReviewToday(review.createdAt) && (
        <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full mb-2">
          Enviados hoy
        </span>
      )}
      
      {/* Contenido de la Reseña */}
      <p className="text-lg mb-2 text-white">
        {review.type.startsWith('pdf_uploaded') 
          ? `Archivo añadido por usuario: ${review.fileName}` 
          : review.content}
      </p>

      {/* Tipo de Reseña */}
      <p className="text-sm text-gray-400">Tipo: {review.type.split('-')[0].replace('_', ' ')}</p>

      {/* Fecha de la Reseña */}
      <p className="text-sm text-gray-400">Fecha: {review.createdAt.toLocaleDateString()}</p>

      {/* ID del Usuario y Botón para Obtener Información */}
      <p className="text-sm text-gray-400 flex items-center">
        User ID: {review.userId}
        <button 
          onClick={handleToggleUserInfo} 
          className="ml-4 bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 transition"
        >
          {isVisible ? 'Ocultar info del usuario' : 'Obtener info del usuario'}
        </button>
      </p>

      {/* Información del Usuario */}
      {isVisible && (
        <div className="mt-4 p-4 bg-[#1A1E36] rounded-lg shadow-inner">
          {isLoadingUserInfo && <p className="text-gray-300">Cargando información del usuario...</p>}
          {errorUserInfo && <p className="text-red-500">{errorUserInfo}</p>}
          {userInfo && (
            <div className="space-y-2">
              <p className="text-sm text-gray-300">Gmail: {userInfo.gmail}</p>
              <p className="text-sm text-gray-300">Teléfono: {userInfo.phone}</p>
              <p className="text-sm text-gray-300">Plan: {userInfo.plan}</p>
              {/* Agrega otros campos que consideres relevantes */}
            </div>
          )}
        </div>
      )}

      {/* Botones para Reseñas del Tipo 'pdf_uploaded' */}
      {review.type.startsWith('pdf_uploaded') && (
        <div className="mt-4 flex space-x-4">
          {/* Botón para Descargar TXT */}
          <button
            onClick={handleDownloadTxt}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
          >
            Descargar TXT
          </button>

          {/* Botón para Ver PDF */}
          <button
            onClick={handleViewPdf}
            className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition"
          >
            Ver PDF
          </button>
        </div>
      )}
    </div>
  );
}

// Componente AdminPage
export default function AdminPage() {
  const { currentUser, isAdmin, loading } = useAuth();
  const router = useRouter();

  // Estados para filtros y paginación
  const [typeFilter, setTypeFilter] = useState('');
  const [allReviews, setAllReviews] = useState([]); // Todas las reseñas obtenidas
  const [displayedReviews, setDisplayedReviews] = useState([]); // Reseñas mostradas actualmente
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const REVIEWS_PER_PAGE = 5; // Número de reseñas por página

  // Función para extraer y convertir la fecha desde el campo 'type'
  const extractDateFromType = (type) => {
    const parts = type.split('-');
    if (parts.length !== 4) return null; // Validar formato

    const [tipo, dia, mes, año] = parts;
    // Crear una cadena de fecha en formato ISO para asegurar correcta conversión
    const fechaString = `${año}-${mes}-${dia}`;
    const fecha = new Date(fechaString);
    if (isNaN(fecha)) return null; // Fecha inválida
    return fecha;
  };

  // Función para obtener todas las reseñas filtradas por tipo
  const fetchReviews = async () => {
    if (!isAdmin) return;

    setIsLoading(true);

    try {
      let q;

      if (typeFilter) {
        // Filtrar por tipo exacto
        q = query(
          collection(db, 'Reviews'),
          where('type', '>=', `${typeFilter}-`),
          where('type', '<=', `${typeFilter}-\uf8ff`)
        );
      } else {
        // Obtener todas las reseñas
        q = query(collection(db, 'Reviews'));
      }

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const fetchedReviews = snapshot.docs.map(doc => {
          const data = doc.data();
          const fecha = extractDateFromType(data.type);
          return {
            id: doc.id,
            ...data,
            createdAt: fecha,
          };
        }).filter(review => review.createdAt !== null); // Filtrar reseñas con fecha válida

        // Ordenar las reseñas por fecha descendente
        fetchedReviews.sort((a, b) => b.createdAt - a.createdAt);

        setAllReviews(fetchedReviews);
        setDisplayedReviews(fetchedReviews.slice(0, REVIEWS_PER_PAGE));

        if (fetchedReviews.length <= REVIEWS_PER_PAGE) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } else {
        setAllReviews([]);
        setDisplayedReviews([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }

    setIsLoading(false);
  };

  // Obtener reseñas al montar el componente o cambiar filtros
  useEffect(() => {
    if (!loading) {
      if (!isAdmin) {
        router.push('/');
      } else {
        // Reiniciar estado al cambiar filtros
        setAllReviews([]);
        setDisplayedReviews([]);
        setHasMore(true);
        fetchReviews();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, isAdmin, loading, typeFilter]);

  // Función para cargar más reseñas
  const handleLoadMore = () => {
    const currentLength = displayedReviews.length;
    const nextReviews = allReviews.slice(currentLength, currentLength + REVIEWS_PER_PAGE);
    setDisplayedReviews(prev => [...prev, ...nextReviews]);

    if (currentLength + REVIEWS_PER_PAGE >= allReviews.length) {
      setHasMore(false);
    }
  };

  // Función para manejar cambios en el filtro de tipo
  const handleTypeChange = (e) => {
    setTypeFilter(e.target.value);
  };

  return (
    <div className="p-8 bg-[#1e3047] min-h-screen">
      {/* Título Centrado */}
      <h1 className="text-3xl font-bold mb-6 text-white text-center">Panel de Administración</h1>

      {/* Filtros Centrados */}
      <div className="flex flex-col md:flex-row items-center justify-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
        {/* Filtro por Tipo */}
        <div className="w-full md:w-1/3">
          <label htmlFor="typeFilter" className="block text-sm font-medium text-white mb-1">Tipo</label>
          <select
            id="typeFilter"
            value={typeFilter}
            onChange={handleTypeChange}
            className="mt-1 block w-full bg-[#344e6f] border border-gray-300 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos</option>
            <option value="thumbs_up">Thumbs Up</option>
            <option value="thumbs_down">Thumbs Down</option>
            <option value="opinion">Opinión</option>
            <option value="pdf_needed">PDF Necesario</option>
            <option value="pdf_uploaded">PDF Subido</option> {/* Nueva opción */}
          </select>
        </div>

        {/* El filtro de orden por fecha ha sido eliminado */}
      </div>

      {/* Lista de Reseñas */}
      <div className="space-y-4">
        {displayedReviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Botón para Cargar Más Reseñas */}
      {hasMore && displayedReviews.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            className="bg-[#344e6f] text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-500 transition"
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Cargar más'}
          </button>
        </div>
      )}

      {/* Mensaje cuando no hay más reseñas */}
      {!hasMore && displayedReviews.length > 0 && (
        <p className="text-center text-gray-400 mt-4">No hay más reseñas para cargar.</p>
      )}

      {/* Mensaje cuando no hay reseñas */}
      {displayedReviews.length === 0 && !isLoading && (
        <p className="text-center text-gray-400 mt-4">No se encontraron reseñas.</p>
      )}
    </div>
  );
}
