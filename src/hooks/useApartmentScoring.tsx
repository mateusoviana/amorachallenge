import { useState, useEffect } from 'react';
import { Apartment, ApartmentReaction } from '../types';
import { reactionService } from '../services/reactionService';
import { 
  calculateMultipleApartmentScores, 
  sortApartmentsByScore, 
  ApartmentScore 
} from '../utils/reactionScoring';

export const useApartmentScoring = (apartments: Apartment[], groupId: string) => {
  const [apartmentScores, setApartmentScores] = useState<ApartmentScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentlyChanged, setRecentlyChanged] = useState<string[]>([]);
  const [positionChanges, setPositionChanges] = useState<Record<string, { oldPos: number; newPos: number; change: 'up' | 'down' | 'same' }>>({});

  const loadApartmentScores = async () => {
    if (!groupId || apartments.length === 0) {
      setApartmentScores([]);
      return;
    }

    try {
      setLoading(true);
      
      // Buscar reações para todos os apartamentos do grupo
      const apartmentReactions: Record<string, ApartmentReaction[]> = {};
      
      await Promise.all(
        apartments.map(async (apartment) => {
          const reactions = await reactionService.getReactionsByApartmentAndGroup(
            apartment.id, 
            groupId
          );
          apartmentReactions[apartment.id] = reactions;
        })
      );

      // Calcular pontuações
      const scores = calculateMultipleApartmentScores(apartmentReactions);
      const sortedScores = sortApartmentsByScore(scores);
      
      // Detectar mudanças na ordem
      const oldOrder = apartmentScores.map(s => s.apartmentId);
      const newOrder = sortedScores.map(s => s.apartmentId);
      
      if (oldOrder.length > 0) {
        const changes: Record<string, { oldPos: number; newPos: number; change: 'up' | 'down' | 'same' }> = {};
        const changedIds: string[] = [];
        
        newOrder.forEach((apartmentId, newIndex) => {
          const oldIndex = oldOrder.indexOf(apartmentId);
          if (oldIndex !== -1) {
            const change = oldIndex > newIndex ? 'up' : oldIndex < newIndex ? 'down' : 'same';
            if (change !== 'same') {
              changes[apartmentId] = {
                oldPos: oldIndex + 1,
                newPos: newIndex + 1,
                change
              };
              changedIds.push(apartmentId);
            }
          }
        });
        
        if (changedIds.length > 0) {
          setPositionChanges(changes);
          setRecentlyChanged(changedIds);
          
          // Limpar indicadores após 4 segundos
          setTimeout(() => {
            setRecentlyChanged([]);
            setPositionChanges({});
          }, 4000);
        }
      }
      
      setApartmentScores(sortedScores);
    } catch (error) {
      console.error('Erro ao carregar pontuações dos apartamentos:', error);
      setApartmentScores([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Ordena os apartamentos baseado na pontuação calculada
   */
  const getSortedApartments = (): Apartment[] => {
    if (apartmentScores.length === 0) {
      return apartments;
    }

    // Criar um mapa para acesso rápido aos apartamentos
    const apartmentMap = new Map(apartments.map(apt => [apt.id, apt]));
    
    // Ordenar apartamentos baseado na pontuação
    const sortedApartments: Apartment[] = [];
    
    // Primeiro, adicionar apartamentos com pontuação
    apartmentScores.forEach(score => {
      const apartment = apartmentMap.get(score.apartmentId);
      if (apartment) {
        sortedApartments.push(apartment);
        apartmentMap.delete(score.apartmentId);
      }
    });
    
    // Depois, adicionar apartamentos sem reações (no final)
    apartmentMap.forEach(apartment => {
      sortedApartments.push(apartment);
    });
    
    return sortedApartments;
  };

  /**
   * Obtém a pontuação de um apartamento específico
   */
  const getApartmentScore = (apartmentId: string): ApartmentScore | null => {
    return apartmentScores.find(score => score.apartmentId === apartmentId) || null;
  };

  useEffect(() => {
    loadApartmentScores();
  }, [apartments, groupId]);
  


  return {
    apartmentScores,
    loading,
    getSortedApartments,
    getApartmentScore,
    refreshScores: () => {
      console.log('🔄 Atualizando pontuações...');
      loadApartmentScores();
    },
    recentlyChanged,
    positionChanges,
  };
};