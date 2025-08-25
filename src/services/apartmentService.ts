import { supabase } from '../lib/supabase';
import { Apartment } from '../types';
import { AlertService } from './alertService';

export const apartmentService = {
  // Buscar apartamentos baseado no usuário logado
  async getApartments(userId?: string): Promise<Apartment[]> {
    let query = supabase
      .from('apartments')
      .select(`
        *,
        owner:users(*),
        apartment_groups(
          groups(*)
        )
      `);

    if (!userId) {
      // Usuário não logado: apenas apartamentos públicos
      query = query.eq('is_public', true);
    } else {
      // Usuário logado: públicos + apartamentos dos grupos do usuário
      const { data: userGroupIds } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', userId);
      
      const groupIds = userGroupIds?.map(g => g.group_id) || [];
      
      if (groupIds.length > 0) {
        // Apartamentos públicos OU que pertencem aos grupos do usuário OU que são do próprio usuário
        const { data: groupApartmentIds } = await supabase
          .from('apartment_groups')
          .select('apartment_id')
          .in('group_id', groupIds);
        
        const apartmentIds = groupApartmentIds?.map(a => a.apartment_id) || [];
        
        if (apartmentIds.length > 0) {
          query = query.or(`is_public.eq.true,id.in.(${apartmentIds.join(',')}),owner_id.eq.${userId}`);
        } else {
          query = query.or(`is_public.eq.true,owner_id.eq.${userId}`);
        }
      } else {
        query = query.or(`is_public.eq.true,owner_id.eq.${userId}`);
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return data?.map(apt => ({
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
      groups: apt.apartment_groups?.map((ag: any) => ({
        id: ag.groups.id,
        name: ag.groups.name,
        description: ag.groups.description,
        isPublic: ag.groups.is_public,
        createdAt: new Date(ag.groups.created_at),
        updatedAt: new Date(ag.groups.updated_at),
        members: [],
        apartments: [],
      })) || [],
      images: apt.images || [],
      sourceType: apt.source_type || 'manual',
      sourceUrl: apt.source_url,
      createdAt: new Date(apt.created_at),
      updatedAt: new Date(apt.updated_at),
    })) || [];
  },

  // Buscar apartamento por ID
  async getApartmentById(id: string): Promise<Apartment | null> {
    const { data, error } = await supabase
      .from('apartments')
      .select(`
        *,
        owner:users(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price,
      condominiumFee: data.condominium_fee || 0,
      iptu: data.iptu || 0,
      address: data.address,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      parkingSpaces: data.parking_spaces,
      area: data.area,
      isPublic: data.is_public,
      ownerId: data.owner_id,
      owner: {
        id: data.owner.id,
        name: data.owner.name,
        email: data.owner.email,
        password: '',
        userType: data.owner.user_type,
        createdAt: new Date(data.owner.created_at),
        updatedAt: new Date(data.owner.updated_at),
      },
      groups: [],
      images: data.images || [],
      sourceType: data.source_type || 'manual',
      sourceUrl: data.source_url,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  // Buscar apartamentos disponíveis para adicionar a um grupo
  async getAvailableApartmentsForGroup(userId: string, excludeGroupId: string): Promise<Apartment[]> {
    // Buscar grupos do usuário
    const { data: userGroupIds } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('user_id', userId);
    
    const groupIds = userGroupIds?.map(g => g.group_id) || [];
    
    let query = supabase
      .from('apartments')
      .select(`
        *,
        owner:users(*),
        apartment_groups(
          groups(*)
        )
      `);
    
    if (groupIds.length > 0) {
      // Buscar apartamentos dos grupos do usuário OU que são do próprio usuário
      const { data: groupApartmentIds } = await supabase
        .from('apartment_groups')
        .select('apartment_id')
        .in('group_id', groupIds);
      
      const apartmentIds = groupApartmentIds?.map(a => a.apartment_id) || [];
      
      if (apartmentIds.length > 0) {
        query = query.or(`id.in.(${apartmentIds.join(',')}),owner_id.eq.${userId}`);
      } else {
        query = query.eq('owner_id', userId);
      }
    } else {
      query = query.eq('owner_id', userId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    const apartments = data?.map(apt => ({
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
      groups: apt.apartment_groups?.map((ag: any) => ({
        id: ag.groups.id,
        name: ag.groups.name,
        description: ag.groups.description,
        isPublic: ag.groups.is_public,
        createdAt: new Date(ag.groups.created_at),
        updatedAt: new Date(ag.groups.updated_at),
        members: [],
        apartments: [],
      })) || [],
      images: apt.images || [],
      sourceType: apt.source_type || 'manual',
      sourceUrl: apt.source_url,
      createdAt: new Date(apt.created_at),
      updatedAt: new Date(apt.updated_at),
    })) || [];
    
    // Filtrar apartamentos que não estão no grupo atual
    return apartments.filter(apt => 
      !apt.groups.some((group: any) => group.id === excludeGroupId)
    );
  },

  // Criar apartamento
  async createApartment(apartment: Omit<Apartment, 'id' | 'createdAt' | 'updatedAt' | 'owner'>): Promise<Apartment> {
    const { data, error } = await supabase
      .from('apartments')
      .insert({
        title: apartment.title,
        description: apartment.description,
        price: apartment.price,
        condominium_fee: apartment.condominiumFee,
        iptu: apartment.iptu,
        address: apartment.address,
        neighborhood: apartment.neighborhood,
        city: apartment.city,
        state: apartment.state,
        bedrooms: apartment.bedrooms,
        bathrooms: apartment.bathrooms,
        parking_spaces: apartment.parkingSpaces,
        area: apartment.area,
        is_public: apartment.isPublic,
        owner_id: apartment.ownerId,
        images: apartment.images,
        source_type: apartment.sourceType,
        source_url: apartment.sourceUrl,
      })
      .select(`
        *,
        owner:users(*)
      `)
      .single();

    if (error) throw error;

    const newApartment = {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price,
      condominiumFee: data.condominium_fee || 0,
      iptu: data.iptu || 0,
      address: data.address,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      parkingSpaces: data.parking_spaces,
      area: data.area,
      isPublic: data.is_public,
      ownerId: data.owner_id,
      owner: {
        id: data.owner.id,
        name: data.owner.name,
        email: data.owner.email,
        password: '',
        userType: data.owner.user_type,
        createdAt: new Date(data.owner.created_at),
        updatedAt: new Date(data.owner.updated_at),
      },
      groups: [],
      images: data.images || [],
      sourceType: data.source_type || 'manual',
      sourceUrl: data.source_url,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };

    // Verificar alertas apenas para apartamentos públicos
    if (newApartment.isPublic) {
      try {
        await AlertService.checkMatches(newApartment);
      } catch (error) {
        console.error('Erro ao verificar alertas:', error);
      }
    }

    return newApartment;
  },

  // Atualizar apartamento
  async updateApartment(id: string, updates: Partial<Apartment>): Promise<Apartment | null> {
    const updateData: any = {};
    
    // Mapear campos do frontend para o backend
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.condominiumFee !== undefined) updateData.condominium_fee = updates.condominiumFee;
    if (updates.iptu !== undefined) updateData.iptu = updates.iptu;
    if (updates.address !== undefined) updateData.address = updates.address;
    if (updates.neighborhood !== undefined) updateData.neighborhood = updates.neighborhood;
    if (updates.city !== undefined) updateData.city = updates.city;
    if (updates.state !== undefined) updateData.state = updates.state;
    if (updates.bedrooms !== undefined) updateData.bedrooms = updates.bedrooms;
    if (updates.bathrooms !== undefined) updateData.bathrooms = updates.bathrooms;
    if (updates.parkingSpaces !== undefined) updateData.parking_spaces = updates.parkingSpaces;
    if (updates.area !== undefined) updateData.area = updates.area;
    if (updates.isPublic !== undefined) updateData.is_public = updates.isPublic;
    if (updates.images !== undefined) updateData.images = updates.images;

    const { data, error } = await supabase
      .from('apartments')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        owner:users(*)
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price,
      condominiumFee: data.condominium_fee || 0,
      iptu: data.iptu || 0,
      address: data.address,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      parkingSpaces: data.parking_spaces,
      area: data.area,
      isPublic: data.is_public,
      ownerId: data.owner_id,
      owner: {
        id: data.owner.id,
        name: data.owner.name,
        email: data.owner.email,
        password: '',
        userType: data.owner.user_type,
        createdAt: new Date(data.owner.created_at),
        updatedAt: new Date(data.owner.updated_at),
      },
      groups: [],
      images: data.images || [],
      sourceType: data.source_type || 'manual',
      sourceUrl: data.source_url,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
};