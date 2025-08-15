import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { Group, GroupMember } from '../types';

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
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock de grupos para demonstração
      const mockGroups: Group[] = [
        {
          id: '1',
          name: 'Grupo Familiar',
          description: 'Imóveis compartilhados com a família',
          isPublic: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          members: [
            {
              id: '1',
              userId: user?.id || '',
              groupId: '1',
              role: 'admin',
              user: user!,
              group: {} as Group,
              createdAt: new Date(),
            }
          ],
          apartments: [],
        },
        {
          id: '2',
          name: 'Amigos do Trabalho',
          description: 'Imóveis compartilhados com colegas',
          isPublic: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          members: [
            {
              id: '2',
              userId: user?.id || '',
              groupId: '2',
              role: 'member',
              user: user!,
              group: {} as Group,
              createdAt: new Date(),
            }
          ],
          apartments: [],
        },
        {
          id: '3',
          name: 'Investimentos',
          description: 'Portfólio de investimentos imobiliários',
          isPublic: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          members: [
            {
              id: '3',
              userId: user?.id || '',
              groupId: '3',
              role: 'admin',
              user: user!,
              group: {} as Group,
              createdAt: new Date(),
            }
          ],
          apartments: [],
        },
      ];

      setUserGroups(mockGroups);
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
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newGroup: Group = {
        ...groupData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        members: [
          {
            id: Date.now().toString(),
            userId: user?.id || '',
            groupId: Date.now().toString(),
            role: 'admin',
            user: user!,
            group: {} as Group,
            createdAt: new Date(),
          }
        ],
        apartments: [],
      };

      setUserGroups(prev => [...prev, newGroup]);
      return newGroup;
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
