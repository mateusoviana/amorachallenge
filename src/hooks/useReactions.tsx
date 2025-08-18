import { useState, useEffect } from 'react';
import { ApartmentReaction, ReactionType } from '../types';
import { reactionService } from '../services/reactionService';
import { useAuth } from './useAuth';

export const useReactions = (apartmentId: string, groupId: string) => {
  const { user } = useAuth();
  const [reactions, setReactions] = useState<ApartmentReaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReactions = async () => {
    if (!apartmentId || !groupId) return;
    
    try {
      setLoading(true);
      setError(null);
      const apartmentReactions = await reactionService.getReactionsByApartmentAndGroup(
        apartmentId,
        groupId
      );
      setReactions(apartmentReactions);
    } catch (err) {
      setError('Erro ao carregar reações');
      console.error('Erro ao carregar reações:', err);
    } finally {
      setLoading(false);
    }
  };

  const addOrUpdateReaction = async (reactionType: ReactionType) => {
    if (!user?.id || !apartmentId || !groupId) return;
    
    try {
      setError(null);
      await reactionService.addOrUpdateReaction(
        apartmentId,
        groupId,
        user.id,
        reactionType
      );
      await loadReactions();
    } catch (err) {
      setError('Erro ao adicionar reação');
      console.error('Erro ao adicionar reação:', err);
    }
  };

  const removeReaction = async () => {
    if (!user?.id || !apartmentId || !groupId) return;
    
    try {
      setError(null);
      await reactionService.removeReaction(apartmentId, groupId, user.id);
      await loadReactions();
    } catch (err) {
      setError('Erro ao remover reação');
      console.error('Erro ao remover reação:', err);
    }
  };

  const handleReactionChange = async (reaction: ReactionType | null) => {
    if (reaction) {
      await addOrUpdateReaction(reaction);
    } else {
      await removeReaction();
    }
  };

  const getUserReaction = (): ReactionType | null => {
    if (!user?.id) return null;
    const userReaction = reactions.find(r => r.userId === user.id);
    return userReaction?.reaction || null;
  };

  const getReactionSummary = () => {
    const summary = {
      love: 0,
      like: 0,
      unsure: 0,
      dislike: 0,
      hate: 0,
      total: reactions.length,
    };

    reactions.forEach(reaction => {
      summary[reaction.reaction]++;
    });

    return summary;
  };

  useEffect(() => {
    loadReactions();
  }, [apartmentId, groupId]);

  return {
    reactions,
    loading,
    error,
    handleReactionChange,
    getUserReaction,
    getReactionSummary,
    loadReactions,
  };
};