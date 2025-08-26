import { supabase } from '../lib/supabase';
import { Group, GroupMember, User, Apartment } from '../types';

export const groupService = {
  // Buscar todos os grupos
  async getGroups(): Promise<Group[]> {
    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        group_members(
          id,
          role,
          created_at,
          user:users(*)
        )
      `);

    if (error) throw error;
    
    return data?.map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      createdAt: new Date(group.created_at),
      updatedAt: new Date(group.updated_at),
      members: group.group_members?.map((member: any) => ({
        id: member.id,
        userId: member.user.id,
        groupId: group.id,
        role: member.role,
        user: {
          id: member.user.id,
          name: member.user.name,
          email: member.user.email,
          password: '',
          userType: member.user.user_type,
          createdAt: new Date(member.user.created_at),
          updatedAt: new Date(member.user.updated_at),
        },
        group: {} as Group, // Evita referência circular
        createdAt: new Date(member.created_at),
      })) || [],
      apartments: [],
    })) || [];
  },

  // Criar grupo
  async createGroup(groupData: { name: string; description: string; adminId: string }): Promise<Group> {
    const { data: groupResult, error: groupError } = await supabase
      .from('groups')
      .insert({
        name: groupData.name,
        description: groupData.description,
        is_public: true, // Todos os grupos são públicos agora
        admin_id: groupData.adminId,
      })
      .select()
      .single();
    
    if (groupError) throw groupError;
    
    // Adicionar o usuário como admin do grupo
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: groupResult.id,
        user_id: groupData.adminId,
        role: 'admin',
      });
    
    if (memberError) throw memberError;
    
    return {
      id: groupResult.id,
      name: groupResult.name,
      description: groupResult.description,
      createdAt: new Date(groupResult.created_at),
      updatedAt: new Date(groupResult.updated_at),
      members: [],
      apartments: [],
    };
  },

  // Atualizar grupo
  async updateGroup(groupId: string, updates: { name: string; description: string }): Promise<void> {
    const { error } = await supabase
      .from('groups')
      .update({
        name: updates.name,
        description: updates.description,
      })
      .eq('id', groupId);
    
    if (error) throw error;
  },

  // Deletar grupo
  async deleteGroup(groupId: string): Promise<void> {
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', groupId);
    
    if (error) throw error;
  },

  // Adicionar membro ao grupo
  async addMemberToGroup(groupId: string, userId: string, role: 'admin' | 'member' = 'member'): Promise<GroupMember> {
    const { data, error } = await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        user_id: userId,
        role: role,
      })
      .select(`
        *,
        user:users(*),
        group:groups(*)
      `)
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      userId: data.user_id,
      groupId: data.group_id,
      role: data.role,
      user: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        password: '',
        userType: data.user.user_type,
        createdAt: new Date(data.user.created_at),
        updatedAt: new Date(data.user.updated_at),
      },
      group: {
        id: data.group.id,
        name: data.group.name,
        description: data.group.description,
        createdAt: new Date(data.group.created_at),
        updatedAt: new Date(data.group.updated_at),
        members: [],
        apartments: [],
      },
      createdAt: new Date(data.created_at),
    };
  },

  // Remover membro do grupo
  async removeMemberFromGroup(groupId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);
    
    if (error) throw error;
  },

  // Listar membros do grupo
  async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    const { data, error } = await supabase
      .from('group_members')
      .select(`
        *,
        user:users(*),
        group:groups(*)
      `)
      .eq('group_id', groupId);
    
    if (error) throw error;
    
    return data?.map(member => ({
      id: member.id,
      userId: member.user_id,
      groupId: member.group_id,
      role: member.role,
      user: {
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        password: '',
        userType: member.user.user_type,
        createdAt: new Date(member.user.created_at),
        updatedAt: new Date(member.user.updated_at),
      },
      group: {
        id: member.group.id,
        name: member.group.name,
        description: member.group.description,
        createdAt: new Date(member.group.created_at),
        updatedAt: new Date(member.group.updated_at),
        members: [],
        apartments: [],
      },
      createdAt: new Date(member.created_at),
    })) || [];
  },

  // Atualizar role do membro
  async updateMemberRole(groupId: string, userId: string, role: 'admin' | 'member'): Promise<void> {
    const { error } = await supabase
      .from('group_members')
      .update({ role })
      .eq('group_id', groupId)
      .eq('user_id', userId);
    
    if (error) throw error;
  },

  // Adicionar apartamento ao grupo
  async addApartmentToGroup(apartmentId: string, groupId: string): Promise<void> {
    console.log('groupService.addApartmentToGroup chamado com:', { apartmentId, groupId });
    
    try {
      // Verificar se o apartamento já existe no grupo
      const { data: existingData, error: checkError } = await supabase
        .from('apartment_groups')
        .select('*')
        .eq('apartment_id', apartmentId)
        .eq('group_id', groupId);
      
      if (checkError) {
        console.error('Erro ao verificar apartamento existente:', checkError);
        throw checkError;
      }
      
      if (existingData && existingData.length > 0) {
        console.log('Apartamento já existe no grupo, ignorando...');
        return; // Apartamento já existe, não é um erro
      }
      
      // Inserir o apartamento no grupo
      const { error } = await supabase
        .from('apartment_groups')
        .insert({
          apartment_id: apartmentId,
          group_id: groupId,
        });
      
      if (error) {
        console.error('Erro do Supabase ao adicionar apartamento ao grupo:', error);
        throw error;
      }
      
      console.log('Apartamento adicionado ao grupo com sucesso no Supabase');
    } catch (err) {
      console.error('Erro capturado no groupService.addApartmentToGroup:', err);
      throw err;
    }
  },

  // Remover apartamento do grupo
  async removeApartmentFromGroup(apartmentId: string, groupId: string): Promise<void> {
    const { error } = await supabase
      .from('apartment_groups')
      .delete()
      .eq('apartment_id', apartmentId)
      .eq('group_id', groupId);
    
    if (error) throw error;
  },

  // Buscar usuário por email
  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
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
  },

  // Listar apartamentos por grupo
  async getApartmentsByGroup(groupId: string): Promise<Apartment[]> {
    const { data, error } = await supabase
      .from('apartment_groups')
      .select(`
        apartments(
          *,
          owner:users(*)
        )
      `)
      .eq('group_id', groupId);
    
    if (error) throw error;
    
    return data?.map(item => {
      const apt = (item as any).apartments;
      return {
        id: apt.id,
        title: apt.title,
        description: apt.description,
        price: apt.price,
        condominiumFee: apt.condominium_fee || 0,
        iptu: apt.iptu || 0,
        address: apt.address,
        neighborhood: apt.neighborhood,
        city: apt.city,
        state: apt.state,
        bedrooms: apt.bedrooms,
        bathrooms: apt.bathrooms,
        parkingSpaces: apt.parking_spaces,
        area: apt.area,
        isPublic: apt.is_public,
        ownerId: apt.owner_id,
        owner: {
          id: apt.owner.id,
          name: apt.owner.name,
          email: apt.owner.email,
          password: '',
          userType: apt.owner.user_type,
          createdAt: new Date(apt.owner.created_at),
          updatedAt: new Date(apt.owner.updated_at),
        },
        groups: [],
        images: apt.images || [],
        sourceType: apt.source_type || 'manual',
        sourceUrl: apt.source_url,
        createdAt: new Date(apt.created_at),
        updatedAt: new Date(apt.updated_at),
      };
    }) || [];
  }
};