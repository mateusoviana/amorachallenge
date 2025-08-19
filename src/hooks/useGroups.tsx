import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { Group } from '../types';
import { groupService } from '../services/groupService';

export const useGroups = () => {
  const { user } = useAuth();
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserGroups = useCallback(async () => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        setUserGroups([]);
        return;
      }
      
      const allGroups = await groupService.getGroups();
      const userGroups = allGroups.filter(group => 
        group.members.some(member => member.userId === user.id)
      );

      setUserGroups(userGroups);
    } catch (err) {
      setError('Erro ao carregar grupos');
      console.error('Erro ao buscar grupos:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      fetchUserGroups();
    }
  }, [user, fetchUserGroups]);



  const createGroup = async (groupData: { name: string; description: string }) => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        throw new Error('Usuário não encontrado');
      }
      
      const result = await groupService.createGroup({
        ...groupData,
        adminId: user.id,
      });
      
      await fetchUserGroups();
      return result;
    } catch (err) {
      setError('Erro ao criar grupo: ' + (err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (groupId: string) => {
    try {
      setLoading(true);
      
      await groupService.deleteGroup(groupId);
      await fetchUserGroups();
      return true;
    } catch (err) {
      setError('Erro ao deletar grupo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addMemberToGroup = async (groupId: string, userId: string, role: 'admin' | 'member' = 'member') => {
    try {
      setLoading(true);
      await groupService.addMemberToGroup(groupId, userId, role);
      await fetchUserGroups();
    } catch (err) {
      setError('Erro ao adicionar membro');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeMemberFromGroup = async (groupId: string, userId: string) => {
    try {
      setLoading(true);
      await groupService.removeMemberFromGroup(groupId, userId);
      await fetchUserGroups();
    } catch (err) {
      setError('Erro ao remover membro');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addApartmentToGroup = async (apartmentId: string, groupId: string) => {
    try {
      setLoading(true);
      await groupService.addApartmentToGroup(apartmentId, groupId);
    } catch (err) {
      setError('Erro ao adicionar apartamento ao grupo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeApartmentFromGroup = async (apartmentId: string, groupId: string) => {
    try {
      setLoading(true);
      await groupService.removeApartmentFromGroup(apartmentId, groupId);
    } catch (err) {
      setError('Erro ao remover apartamento do grupo');
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
    deleteGroup,
    addMemberToGroup,
    removeMemberFromGroup,
    addApartmentToGroup,
    removeApartmentFromGroup,
    refetch: fetchUserGroups,
  };
};
