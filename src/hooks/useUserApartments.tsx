import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { Apartment } from '../types';

export const useUserApartments = () => {
  const { user } = useAuth();
  const [userApartments, setUserApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserApartments();
    }
  }, [user]);

  const fetchUserApartments = async () => {
    try {
      setLoading(true);
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock de apartamentos para demonstração
      const mockApartments: Apartment[] = [
        {
          id: '1',
          title: 'Apartamento Moderno no Centro',
          description: 'Apartamento recém-reformado com acabamento de luxo',
          price: 450000,
          address: 'Rua das Flores, 123',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          bedrooms: 2,
          bathrooms: 2,
          parkingSpaces: 1,
          area: 75,
          isPublic: false,
          ownerId: user?.id || '',
          owner: user!,
          groups: [],
          images: ['https://via.placeholder.com/300x200'],
          editors: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          title: 'Cobertura Duplex',
          description: 'Cobertura com vista panorâmica da cidade',
          price: 1200000,
          address: 'Av. Paulista, 1000',
          neighborhood: 'Bela Vista',
          city: 'São Paulo',
          state: 'SP',
          bedrooms: 3,
          bathrooms: 3,
          parkingSpaces: 2,
          area: 120,
          isPublic: true,
          ownerId: user?.id || '',
          owner: user!,
          groups: [],
          images: ['https://via.placeholder.com/300x200'],
          editors: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      console.log('Apartamentos mock criados:', mockApartments);
      console.log('Verificando propriedade editors:', mockApartments.map(apt => ({ id: apt.id, editors: apt.editors })));

      // Garantir que todos os apartamentos tenham a propriedade editors
      const validatedApartments = mockApartments.map(apt => ({
        ...apt,
        editors: Array.isArray(apt.editors) ? apt.editors : []
      }));

      console.log('Apartamentos validados:', validatedApartments);

      setUserApartments(validatedApartments);
    } catch (err) {
      setError('Erro ao carregar apartamentos');
      console.error('Erro ao buscar apartamentos:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateApartment = async (id: string, updates: Partial<Apartment>) => {
    try {
      setLoading(true);
      console.log('Atualizando apartamento:', id);
      console.log('Updates recebidos:', updates);
      
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserApartments(prev => {
        console.log('Estado anterior dos apartamentos:', prev);
        const updated = prev.map(apt => 
          apt.id === id 
            ? { ...apt, ...updates, updatedAt: new Date() }
            : apt
        );
        console.log('Estado atualizado dos apartamentos:', updated);
        return updated;
      });
      
      return true;
    } catch (err) {
      setError('Erro ao atualizar apartamento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteApartment = async (id: string) => {
    try {
      setLoading(true);
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserApartments(prev => prev.filter(apt => apt.id !== id));
      return true;
    } catch (err) {
      setError('Erro ao deletar apartamento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addApartment = async (apartment: Omit<Apartment, 'id' | 'createdAt' | 'updatedAt' | 'owner'>) => {
    try {
      setLoading(true);
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newApartment: Apartment = {
        ...apartment,
        id: Date.now().toString(),
        owner: user!,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUserApartments(prev => [...prev, newApartment]);
      return newApartment;
    } catch (err) {
      setError('Erro ao adicionar apartamento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    userApartments,
    loading,
    error,
    updateApartment,
    deleteApartment,
    addApartment,
    refetch: fetchUserApartments,
  };
};
