import { supabase } from '../lib/supabase';
import { AlertCriteria, AlertMatch, Apartment } from '../types';
import { EmailService } from './emailService';

export class AlertService {
  // Criar novo alerta
  static async createAlert(alert: Omit<AlertCriteria, 'id' | 'createdAt' | 'updatedAt'>): Promise<AlertCriteria> {
    const { data, error } = await supabase
      .from('alert_criteria')
      .insert([{
        user_id: alert.userId,
        name: alert.name,
        is_active: alert.isActive,
        price_min: alert.priceMin,
        price_max: alert.priceMax,
        area_min: alert.areaMin,
        area_max: alert.areaMax,
        bedrooms: alert.bedrooms,
        bathrooms: alert.bathrooms,
        parking_spaces: alert.parkingSpaces,
        cities: alert.cities,
        neighborhoods: alert.neighborhoods,
        email_notifications: alert.emailNotifications,
        whatsapp_notifications: alert.whatsappNotifications
      }])
      .select()
      .single();

    if (error) throw error;
    return this.mapAlert(data);
  }

  // Buscar alertas do usuário
  static async getUserAlerts(userId: string): Promise<AlertCriteria[]> {
    const { data, error } = await supabase
      .from('alert_criteria')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(this.mapAlert);
  }

  // Atualizar alerta existente
  static async updateAlert(alertId: string, alert: Partial<AlertCriteria>): Promise<AlertCriteria> {
    console.log('🔄 Atualizando alerta:', { alertId, alert });
    
    const updateData: any = {};
    
    if (alert.name !== undefined) updateData.name = alert.name;
    if (alert.isActive !== undefined) updateData.is_active = alert.isActive;
    if (alert.priceMin !== undefined) updateData.price_min = alert.priceMin;
    if (alert.priceMax !== undefined) updateData.price_max = alert.priceMax;
    if (alert.areaMin !== undefined) updateData.area_min = alert.areaMin;
    if (alert.areaMax !== undefined) updateData.area_max = alert.areaMax;
    if (alert.bedrooms !== undefined) updateData.bedrooms = alert.bedrooms;
    if (alert.bathrooms !== undefined) updateData.bathrooms = alert.bathrooms;
    if (alert.parkingSpaces !== undefined) updateData.parking_spaces = alert.parkingSpaces;
    if (alert.cities !== undefined) updateData.cities = alert.cities;
    if (alert.neighborhoods !== undefined) updateData.neighborhoods = alert.neighborhoods;
    if (alert.emailNotifications !== undefined) updateData.email_notifications = alert.emailNotifications;
    if (alert.whatsappNotifications !== undefined) updateData.whatsapp_notifications = alert.whatsappNotifications;
    
    updateData.updated_at = new Date().toISOString();

    console.log('📝 Dados para atualização:', updateData);

    const { data, error } = await supabase
      .from('alert_criteria')
      .update(updateData)
      .eq('id', alertId)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao atualizar alerta:', error);
      throw error;
    }
    
    console.log('✅ Alerta atualizado com sucesso:', data);
    return this.mapAlert(data);
  }

  // Excluir alerta
  static async deleteAlert(alertId: string): Promise<void> {
    console.log('🗑️ Excluindo alerta:', alertId);
    
    const { error } = await supabase
      .from('alert_criteria')
      .delete()
      .eq('id', alertId);

    if (error) {
      console.error('❌ Erro ao excluir alerta:', error);
      throw error;
    }
    
    console.log('✅ Alerta excluído com sucesso');
  }

  // Verificar matches para um apartamento
  static async checkMatches(apartment: Apartment): Promise<void> {
    const { data: alerts, error } = await supabase
      .from('alert_criteria')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;

    for (const alert of alerts) {
      const score = this.calculateMatchScore(apartment, alert);
      
      if (score >= 70) { // 70% de match mínimo
        await this.createMatch(alert.id, apartment.id, score);
        await this.sendNotifications(alert, apartment, score);
      }
    }
  }

  // Calcular score de match
  private static calculateMatchScore(apartment: Apartment, alert: any): number {
    let score = 0;
    let criteria = 0;

    // Preço
    if (alert.price_min || alert.price_max) {
      criteria++;
      if ((!alert.price_min || apartment.price >= alert.price_min) &&
          (!alert.price_max || apartment.price <= alert.price_max)) {
        score++;
      }
    }

    // Área
    if (alert.area_min || alert.area_max) {
      criteria++;
      if ((!alert.area_min || apartment.area >= alert.area_min) &&
          (!alert.area_max || apartment.area <= alert.area_max)) {
        score++;
      }
    }

    // Quartos
    if (alert.bedrooms?.length) {
      criteria++;
      if (alert.bedrooms.includes(apartment.bedrooms)) score++;
    }

    // Banheiros
    if (alert.bathrooms?.length) {
      criteria++;
      if (alert.bathrooms.includes(apartment.bathrooms)) score++;
    }

    // Vagas
    if (alert.parking_spaces?.length) {
      criteria++;
      if (alert.parking_spaces.includes(apartment.parkingSpaces)) score++;
    }

    // Cidade
    if (alert.cities?.length) {
      criteria++;
      if (alert.cities.includes(apartment.city)) score++;
    }

    // Bairro
    if (alert.neighborhoods?.length) {
      criteria++;
      if (alert.neighborhoods.includes(apartment.neighborhood)) score++;
    }

    return criteria > 0 ? Math.round((score / criteria) * 100) : 100;
  }

  // Criar match
  private static async createMatch(alertId: string, apartmentId: string, score: number): Promise<void> {
    await supabase
      .from('alert_matches')
      .insert([{
        alert_id: alertId,
        apartment_id: apartmentId,
        match_score: score
      }]);
  }

  // Enviar notificações
  private static async sendNotifications(alert: any, apartment: Apartment, score: number): Promise<void> {
    if (alert.email_notifications) {
      await this.sendEmailNotification(alert, apartment, score);
    }
    
    if (alert.whatsapp_notifications) {
      await this.sendWhatsAppNotification(alert, apartment, score);
    }
  }

  // Email
  private static async sendEmailNotification(alert: any, apartment: Apartment, score: number): Promise<void> {
    const { data: user } = await supabase
      .from('users')
      .select('email, name')
      .eq('id', alert.user_id)
      .single();

    if (!user) return;

    const subject = `🏠 aMORA Avisa: Novo imóvel encontrado (${score}% match)`;
    const body = `
Olá ${user.name}!

Encontramos um novo imóvel que combina com seu alerta "${alert.name}":

🏠 ${apartment.title}
💰 R$ ${apartment.price.toLocaleString('pt-BR')}
📐 ${apartment.area}m²
🛏️ ${apartment.bedrooms} quartos
🚿 ${apartment.bathrooms} banheiros
🚗 ${apartment.parkingSpaces} vagas
📍 ${apartment.neighborhood}, ${apartment.city}

Match: ${score}%

Acesse a aMORA para ver mais detalhes!
    `;

    // Tentar enviar email real
    const emailSent = await EmailService.sendEmail(user.email, subject, body);
    
    if (!emailSent) {
      // Fallback: log no console se falhar
      console.log('📧 Email (fallback):', { to: user.email, subject, body });
    }
    
    // Marcar como enviado
    await supabase
      .from('alert_matches')
      .update({ email_sent: true })
      .eq('alert_id', alert.id)
      .eq('apartment_id', apartment.id);
  }

  // WhatsApp (preparado para futuro)
  private static async sendWhatsAppNotification(alert: any, apartment: Apartment, score: number): Promise<void> {
    // TODO: Implementar quando tiver número comercial
    console.log('📱 WhatsApp preparado para:', {
      alertName: alert.name,
      apartmentTitle: apartment.title,
      score
    });
  }

  // Mapear dados do banco
  private static mapAlert(data: any): AlertCriteria {
    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      isActive: data.is_active,
      priceMin: data.price_min,
      priceMax: data.price_max,
      areaMin: data.area_min,
      areaMax: data.area_max,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      parkingSpaces: data.parking_spaces,
      cities: data.cities,
      neighborhoods: data.neighborhoods,
      emailNotifications: data.email_notifications,
      whatsappNotifications: data.whatsapp_notifications,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }
}