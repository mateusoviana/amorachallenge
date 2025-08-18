import { ApartmentReaction, ReactionType, User } from '../types';
import { supabase } from '../lib/supabase';

// Função para buscar usuário por ID no Supabase
const findUserById = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      password: '',
      userType: data.user_type,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
};

export const reactionService = {
  // Buscar reações de um imóvel em um grupo
  async getReactionsByApartmentAndGroup(apartmentId: string, groupId: string): Promise<ApartmentReaction[]> {
    try {
      const { data, error } = await supabase
        .from('apartment_reactions')
        .select('*')
        .eq('apartment_id', apartmentId)
        .eq('group_id', groupId);
      
      if (error) {
        console.error('Erro ao buscar reações:', error);
        return [];
      }
      
      // Buscar dados dos usuários separadamente
      const reactions = await Promise.all(
        (data || []).map(async (reaction) => {
          const user = await findUserById(reaction.user_id);
          return {
            id: reaction.id,
            apartmentId: reaction.apartment_id,
            groupId: reaction.group_id,
            userId: reaction.user_id,
            reaction: reaction.reaction as ReactionType,
            user: user || {
              id: reaction.user_id,
              name: 'Usuário não encontrado',
              email: '',
              password: '',
              userType: 'buyer' as const,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            createdAt: new Date(reaction.created_at),
            updatedAt: new Date(reaction.updated_at),
          };
        })
      );
      
      return reactions;
    } catch (error) {
      console.error('Erro ao buscar reações:', error);
      return [];
    }
  },

  // Adicionar ou atualizar reação
  async addOrUpdateReaction(
    apartmentId: string,
    groupId: string,
    userId: string,
    reactionType: ReactionType
  ): Promise<ApartmentReaction> {
    console.log('🔄 addOrUpdateReaction:', { apartmentId, groupId, userId, reactionType });
    
    try {
      // Verificar se já existe uma reação do usuário
      const { data: existing, error: selectError } = await supabase
        .from('apartment_reactions')
        .select('*')
        .eq('apartment_id', apartmentId)
        .eq('group_id', groupId)
        .eq('user_id', userId)
        .single();
      
      console.log('🔍 Existing reaction:', existing, 'Error:', selectError);
      
      let reactionData;
      
      if (existing) {
        // Atualizar reação existente
        const { data, error } = await supabase
          .from('apartment_reactions')
          .update({
            reaction: reactionType,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) {
          console.error('❌ Erro ao atualizar reação:', error);
          throw error;
        }
        console.log('✅ Reação atualizada:', data);
        reactionData = data;
      } else {
        // Criar nova reação
        console.log('➕ Criando nova reação...');
        const { data, error } = await supabase
          .from('apartment_reactions')
          .insert({
            apartment_id: apartmentId,
            group_id: groupId,
            user_id: userId,
            reaction: reactionType,
          })
          .select()
          .single();
        
        if (error) {
          console.error('❌ Erro ao criar reação:', error);
          throw error;
        }
        console.log('✅ Reação criada:', data);
        reactionData = data;
      }
      
      // Buscar dados do usuário
      const user = await findUserById(userId);
      if (!user) {
        throw new Error(`Usuário não encontrado: ${userId}`);
      }
      
      return {
        id: reactionData.id,
        apartmentId: reactionData.apartment_id,
        groupId: reactionData.group_id,
        userId: reactionData.user_id,
        reaction: reactionData.reaction as ReactionType,
        user,
        createdAt: new Date(reactionData.created_at),
        updatedAt: new Date(reactionData.updated_at),
      };
    } catch (error) {
      console.error('Erro ao adicionar/atualizar reação:', error);
      throw error;
    }
  },

  // Remover reação
  async removeReaction(apartmentId: string, groupId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('apartment_reactions')
        .delete()
        .eq('apartment_id', apartmentId)
        .eq('group_id', groupId)
        .eq('user_id', userId);
      
      if (error) {
        console.error('Erro ao remover reação:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erro ao remover reação:', error);
      throw error;
    }
  },

  // Buscar reação específica do usuário
  async getUserReaction(
    apartmentId: string,
    groupId: string,
    userId: string
  ): Promise<ApartmentReaction | null> {
    try {
      const { data, error } = await supabase
        .from('apartment_reactions')
        .select('*')
        .eq('apartment_id', apartmentId)
        .eq('group_id', groupId)
        .eq('user_id', userId)
        .single();
      
      if (error || !data) return null;
      
      const user = await findUserById(userId);
      if (!user) return null;
      
      return {
        id: data.id,
        apartmentId: data.apartment_id,
        groupId: data.group_id,
        userId: data.user_id,
        reaction: data.reaction as ReactionType,
        user,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    } catch (error) {
      return null;
    }
  },

  // Buscar todas as reações de um usuário em um grupo
  async getUserReactionsInGroup(groupId: string, userId: string): Promise<ApartmentReaction[]> {
    try {
      const { data, error } = await supabase
        .from('apartment_reactions')
        .select('*')
        .eq('group_id', groupId)
        .eq('user_id', userId);
      
      if (error || !data) return [];
      
      const user = await findUserById(userId);
      if (!user) return [];
      
      return data.map(reaction => ({
        id: reaction.id,
        apartmentId: reaction.apartment_id,
        groupId: reaction.group_id,
        userId: reaction.user_id,
        reaction: reaction.reaction as ReactionType,
        user,
        createdAt: new Date(reaction.created_at),
        updatedAt: new Date(reaction.updated_at),
      }));
    } catch (error) {
      return [];
    }
  },

  // Estatísticas de reações por imóvel
  async getReactionStats(apartmentId: string, groupId: string) {
    const reactions = await this.getReactionsByApartmentAndGroup(apartmentId, groupId);
    
    const stats = {
      love: 0,
      like: 0,
      unsure: 0,
      dislike: 0,
      hate: 0,
      total: reactions.length,
    };

    reactions.forEach(reaction => {
      stats[reaction.reaction]++;
    });

    return stats;
  },
};