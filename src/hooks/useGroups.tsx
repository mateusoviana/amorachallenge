import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { Group, GroupMember } from '../types';
import { supabase } from '../lib/supabase';

export const useGroups = () => {
  const { user } = useAuth();
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserGroups();
    }
  }, [user]);

  const fetchUserGroups = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          groups!inner(
            id,
            name,
            description,
            is_public,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      const groups: Group[] = data?.map(item => {
        const group = (item as any).groups;
        return {
          id: group.id,
          name: group.name,
          description: group.description,
          isPublic: group.is_public,
          createdAt: new Date(group.created_at),
          updatedAt: new Date(group.updated_at),
          members: [],
          apartments: [],
        };
      }) || [];

      setUserGroups(groups);
    } catch (err) {
      setError('Erro ao carregar grupos');
      console.error('Erro ao buscar grupos:', err);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (groupData: Omit<Group, 'id' | 'createdAt' | 'updatedAt' | 'members' | 'apartments'>) => {
    try {
      setLoading(true);
      
      // Criar o grupo
      const { data: groupResult, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: groupData.name,
          description: groupData.description,
          is_public: groupData.isPublic,
          admin_id: user?.id,
        })
        .select()
        .single();
      
      if (groupError) throw groupError;
      
      // Adicionar o usuário como admin do grupo
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: groupResult.id,
          user_id: user?.id,
          role: 'admin',
        });
      
      if (memberError) throw memberError;
      
      await fetchUserGroups();
      return groupResult;
    } catch (err) {
      setError('Erro ao criar grupo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    userGroups,
    loading,
    error,
    createGroup,
    refetch: fetchUserGroups,
  };
};
