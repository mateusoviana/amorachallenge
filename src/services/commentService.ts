import { ApartmentComment, User } from '../types';
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

export const commentService = {
  // Buscar comentários de um imóvel em um grupo
  async getCommentsByApartmentAndGroup(apartmentId: string, groupId: string): Promise<ApartmentComment[]> {
    try {
      const { data, error } = await supabase
        .from('apartment_comments')
        .select('*')
        .eq('apartment_id', apartmentId)
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Erro ao buscar comentários:', error);
        return [];
      }
      
      // Buscar dados dos usuários separadamente
      const comments = await Promise.all(
        (data || []).map(async (comment) => {
          const user = await findUserById(comment.user_id);
          return {
            id: comment.id,
            apartmentId: comment.apartment_id,
            groupId: comment.group_id,
            userId: comment.user_id,
            comment: comment.comment,
            user: user || {
              id: comment.user_id,
              name: 'Usuário não encontrado',
              email: '',
              password: '',
              userType: 'buyer' as const,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            createdAt: new Date(comment.created_at),
            updatedAt: new Date(comment.updated_at),
          };
        })
      );
      
      return comments;
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
      return [];
    }
  },

  // Adicionar comentário
  async addComment(
    apartmentId: string,
    groupId: string,
    userId: string,
    commentText: string
  ): Promise<ApartmentComment> {
    try {
      const { data, error } = await supabase
        .from('apartment_comments')
        .insert({
          apartment_id: apartmentId,
          group_id: groupId,
          user_id: userId,
          comment: commentText,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar comentário:', error);
        throw error;
      }
      
      // Buscar dados do usuário
      const user = await findUserById(userId);
      if (!user) {
        throw new Error(`Usuário não encontrado: ${userId}`);
      }
      
      return {
        id: data.id,
        apartmentId: data.apartment_id,
        groupId: data.group_id,
        userId: data.user_id,
        comment: data.comment,
        user,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      throw error;
    }
  },

  // Remover comentário
  async removeComment(commentId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('apartment_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', userId); // Só pode deletar próprios comentários
      
      if (error) {
        console.error('Erro ao remover comentário:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erro ao remover comentário:', error);
      throw error;
    }
  },

  // Contar comentários
  async getCommentsCount(apartmentId: string, groupId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('apartment_comments')
        .select('*', { count: 'exact', head: true })
        .eq('apartment_id', apartmentId)
        .eq('group_id', groupId);
      
      if (error) {
        console.error('Erro ao contar comentários:', error);
        return 0;
      }
      
      return count || 0;
    } catch (error) {
      console.error('Erro ao contar comentários:', error);
      return 0;
    }
  },
};