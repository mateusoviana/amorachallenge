import { ReactionType, ApartmentReaction } from '../types';

// Pontuação por tipo de reação
const REACTION_SCORES: Record<ReactionType, number> = {
  love: 2,
  like: 1,
  unsure: 0,
  dislike: -1,
  hate: -2,
};

// Reações consideradas negativas para critério de desempate
const NEGATIVE_REACTIONS: ReactionType[] = ['dislike', 'hate'];

export interface ApartmentScore {
  apartmentId: string;
  totalScore: number;
  negativeCount: number;
  reactionCount: number;
}

/**
 * Calcula a pontuação de um apartamento baseado nas reações
 */
export const calculateApartmentScore = (reactions: ApartmentReaction[]): ApartmentScore => {
  let totalScore = 0;
  let negativeCount = 0;
  
  reactions.forEach(reaction => {
    const score = REACTION_SCORES[reaction.reaction];
    totalScore += score;
    
    if (NEGATIVE_REACTIONS.includes(reaction.reaction)) {
      negativeCount++;
    }
  });
  
  return {
    apartmentId: reactions[0]?.apartmentId || '',
    totalScore,
    negativeCount,
    reactionCount: reactions.length,
  };
};

/**
 * Ordena apartamentos por pontuação (decrescente) com critério de desempate
 * Em caso de empate na pontuação, o apartamento com menos rejeições ganha
 */
export const sortApartmentsByScore = (
  apartmentScores: ApartmentScore[]
): ApartmentScore[] => {
  return apartmentScores.sort((a, b) => {
    // Primeiro critério: pontuação total (decrescente)
    if (a.totalScore !== b.totalScore) {
      return b.totalScore - a.totalScore;
    }
    
    // Segundo critério: menos rejeições (crescente)
    if (a.negativeCount !== b.negativeCount) {
      return a.negativeCount - b.negativeCount;
    }
    
    // Terceiro critério: mais reações totais (decrescente)
    return b.reactionCount - a.reactionCount;
  });
};

/**
 * Calcula pontuações para múltiplos apartamentos
 */
export const calculateMultipleApartmentScores = (
  apartmentReactions: Record<string, ApartmentReaction[]>
): ApartmentScore[] => {
  return Object.entries(apartmentReactions).map(([apartmentId, reactions]) => ({
    ...calculateApartmentScore(reactions),
    apartmentId,
  }));
};