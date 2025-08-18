import { ApartmentReaction, ReactionType, User } from '../types';

// Mock data para reações
let mockReactions: ApartmentReaction[] = [
  {
    id: 'reaction-1',
    apartmentId: 'apartment-1',
    groupId: 'group-1',
    userId: '11111111-1111-1111-1111-111111111111',
    reaction: 'love',
    user: {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'João Silva',
      email: 'joao@email.com',
      password: '123456',
      userType: 'buyer',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'reaction-2',
    apartmentId: 'apartment-1',
    groupId: 'group-1',
    userId: '22222222-2222-2222-2222-222222222222',
    reaction: 'like',
    user: {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Maria Santos',
      email: 'maria@email.com',
      password: '123456',
      userType: 'realtor',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'reaction-3',
    apartmentId: 'apartment-1',
    groupId: 'group-1',
    userId: '33333333-3333-3333-3333-333333333333',
    reaction: 'unsure',
    user: {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'Pedro Costa',
      email: 'pedro@email.com',
      password: '123456',
      userType: 'buyer',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'reaction-4',
    apartmentId: 'apartment-2',
    groupId: 'group-1',
    userId: '11111111-1111-1111-1111-111111111111',
    reaction: 'love',
    user: {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'João Silva',
      email: 'joao@email.com',
      password: '123456',
      userType: 'buyer',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock users para as reações
const mockUsers: User[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'João Silva',
    email: 'joao@email.com',
    password: '123456',
    userType: 'buyer',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Maria Santos',
    email: 'maria@email.com',
    password: '123456',
    userType: 'realtor',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Pedro Costa',
    email: 'pedro@email.com',
    password: '123456',
    userType: 'buyer',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const reactionService = {
  // Buscar reações de um imóvel em um grupo
  async getReactionsByApartmentAndGroup(apartmentId: string, groupId: string): Promise<ApartmentReaction[]> {
    return mockReactions.filter(
      reaction => reaction.apartmentId === apartmentId && reaction.groupId === groupId
    );
  },

  // Adicionar ou atualizar reação
  async addOrUpdateReaction(
    apartmentId: string,
    groupId: string,
    userId: string,
    reactionType: ReactionType
  ): Promise<ApartmentReaction> {
    // Verificar se já existe uma reação do usuário para este imóvel neste grupo
    const existingReactionIndex = mockReactions.findIndex(
      reaction => 
        reaction.apartmentId === apartmentId && 
        reaction.groupId === groupId && 
        reaction.userId === userId
    );

    const user = mockUsers.find(u => u.id === userId) || mockUsers[0];

    if (existingReactionIndex >= 0) {
      // Atualizar reação existente
      mockReactions[existingReactionIndex] = {
        ...mockReactions[existingReactionIndex],
        reaction: reactionType,
        updatedAt: new Date(),
      };
      return mockReactions[existingReactionIndex];
    } else {
      // Criar nova reação
      const newReaction: ApartmentReaction = {
        id: `reaction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        apartmentId,
        groupId,
        userId,
        reaction: reactionType,
        user,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockReactions.push(newReaction);
      return newReaction;
    }
  },

  // Remover reação
  async removeReaction(apartmentId: string, groupId: string, userId: string): Promise<void> {
    mockReactions = mockReactions.filter(
      reaction => !(
        reaction.apartmentId === apartmentId && 
        reaction.groupId === groupId && 
        reaction.userId === userId
      )
    );
  },

  // Buscar reação específica do usuário
  async getUserReaction(
    apartmentId: string,
    groupId: string,
    userId: string
  ): Promise<ApartmentReaction | null> {
    return mockReactions.find(
      reaction => 
        reaction.apartmentId === apartmentId && 
        reaction.groupId === groupId && 
        reaction.userId === userId
    ) || null;
  },

  // Buscar todas as reações de um usuário em um grupo
  async getUserReactionsInGroup(groupId: string, userId: string): Promise<ApartmentReaction[]> {
    return mockReactions.filter(
      reaction => reaction.groupId === groupId && reaction.userId === userId
    );
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