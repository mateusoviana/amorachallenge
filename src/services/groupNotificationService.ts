import { supabase } from '../lib/supabase';
import { EmailService } from './emailService';
import { Apartment, Group } from '../types';

export class GroupNotificationService {
  // Notificar membros do grupo sobre novo imóvel
  static async notifyGroupMembers(
    apartment: Apartment, 
    group: Group, 
    addedByUserId: string
  ): Promise<void> {
    try {
      // Buscar membros do grupo (exceto quem adicionou)
      const { data: members, error } = await supabase
        .from('group_members')
        .select(`
          user_id,
          users!inner(name, email)
        `)
        .eq('group_id', group.id)
        .neq('user_id', addedByUserId);

      if (error) throw error;

      // Buscar dados de quem adicionou
      const { data: addedByUser } = await supabase
        .from('users')
        .select('name')
        .eq('id', addedByUserId)
        .single();

      const addedByName = addedByUser?.name || 'Um membro';

      // Enviar email para cada membro
      for (const member of members) {
        const memberUser = member.users as any;
        
        const subject = `🏠 Novo imóvel no grupo "${group.name}"`;
        const body = `Olá ${memberUser.name}!

${addedByName} adicionou um novo imóvel ao grupo "${group.name}":

🏠 ${apartment.title}
💰 R$ ${apartment.price.toLocaleString('pt-BR')}
📐 ${apartment.area}m²
🛏️ ${apartment.bedrooms} quartos
🚿 ${apartment.bathrooms} banheiros
🚗 ${apartment.parkingSpaces} vagas
📍 ${apartment.neighborhood}, ${apartment.city}

Acesse a aMORA para ver mais detalhes e dar sua opinião!

---
aMORA - Plataforma de Imóveis`;

        await EmailService.sendEmail(memberUser.email, subject, body);
      }
    } catch (error) {
      console.error('Erro ao notificar membros do grupo:', error);
    }
  }
}