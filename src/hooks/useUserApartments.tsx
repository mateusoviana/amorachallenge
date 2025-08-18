import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { Apartment } from '../types';
import { supabase } from '../lib/supabase';

export const useUserApartments = () => {
  const { user } = useAuth();
  const [userApartments, setUserApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserApartments();
    }
  }, [user]);

  const fetchUserApartments = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('apartments')
        .select(`
          *,
          owner:users!owner_id(*),
          apartment_groups(
            groups(*)
          )
        `)
        .eq('owner_id', user?.id);
      
      if (error) throw error;
      
      const apartments: Apartment[] = data?.map(apt => ({
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

        createdAt: new Date(apt.created_at),
        updatedAt: new Date(apt.updated_at),
      })) || [];

      setUserApartments(apartments);
    } catch (err) {
      setError('Erro ao carregar apartamentos');
      console.error('Erro ao buscar apartamentos:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateApartment = async (id: string, updates: Partial<Apartment>) => {
    try {
      setLoading(true);
      
      const updateData: any = {};
      if (updates.title) updateData.title = updates.title;
      if (updates.description) updateData.description = updates.description;
      if (updates.price) updateData.price = updates.price;
      if (updates.condominiumFee !== undefined) updateData.condominium_fee = updates.condominiumFee;
      if (updates.iptu !== undefined) updateData.iptu = updates.iptu;
      if (updates.address) updateData.address = updates.address;
      if (updates.neighborhood) updateData.neighborhood = updates.neighborhood;
      if (updates.city) updateData.city = updates.city;
      if (updates.state) updateData.state = updates.state;
      if (updates.bedrooms) updateData.bedrooms = updates.bedrooms;
      if (updates.bathrooms) updateData.bathrooms = updates.bathrooms;
      if (updates.parkingSpaces) updateData.parking_spaces = updates.parkingSpaces;
      if (updates.area) updateData.area = updates.area;
      if (updates.isPublic !== undefined) updateData.is_public = updates.isPublic;
      if (updates.images) updateData.images = updates.images;

      // Atualizar dados básicos do apartamento
      const { error } = await supabase
        .from('apartments')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
      // Atualizar associações de grupos se fornecidas
      if (updates.groups !== undefined) {
        // Remover todas as associações existentes
        const { error: deleteError } = await supabase
          .from('apartment_groups')
          .delete()
          .eq('apartment_id', id);
        
        if (deleteError) throw deleteError;
        
        // Adicionar novas associações
        if (updates.groups.length > 0) {
          const groupAssociations = updates.groups.map(group => ({
            apartment_id: id,
            group_id: group.id
          }));
          
          const { error: insertError } = await supabase
            .from('apartment_groups')
            .insert(groupAssociations);
          
          if (insertError) throw insertError;
        }
      }
      
      await fetchUserApartments();
      return true;
    } catch (err) {
      setError('Erro ao atualizar apartamento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteApartment = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('apartments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setUserApartments(prev => prev.filter(apt => apt.id !== id));
      return true;
    } catch (err) {
      setError('Erro ao deletar apartamento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addApartment = async (apartment: Omit<Apartment, 'id' | 'createdAt' | 'updatedAt' | 'owner'>) => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        throw new Error('Usuário não encontrado');
      }
      

      
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
        })
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar apartamento:', error);
        throw error;
      }
      

      
      // Associar apartamento aos grupos selecionados
      if (apartment.groups && apartment.groups.length > 0) {
        const groupAssociations = apartment.groups.map(group => ({
          apartment_id: data.id,
          group_id: group.id
        }));
        
        const { error: groupError } = await supabase
          .from('apartment_groups')
          .insert(groupAssociations);
          
        if (groupError) {
          console.error('Erro ao associar grupos:', groupError);
          throw groupError;
        }
      }
      
      await fetchUserApartments();
      return data;
    } catch (err) {
      console.error('Erro completo:', err);
      setError('Erro ao adicionar apartamento: ' + (err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    userApartments,
    loading,
    error,
    updateApartment,
    deleteApartment,
    addApartment,
    refetch: fetchUserApartments,
  };
};
