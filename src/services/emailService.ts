// Serviço de email usando EmailJS (gratuito)
export class EmailService {
  private static readonly SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'gmail';
  private static readonly TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_alerts';
  private static readonly PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || '';

  // Enviar email via EmailJS
  static async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    try {
      // Verificar se as credenciais estão configuradas
      if (!this.PUBLIC_KEY || !this.SERVICE_ID || !this.TEMPLATE_ID) {
        console.warn('⚠️ EmailJS não configurado. Configure as variáveis de ambiente:');
        console.warn('REACT_APP_EMAILJS_SERVICE_ID, REACT_APP_EMAILJS_TEMPLATE_ID, REACT_APP_EMAILJS_PUBLIC_KEY');
        console.log('📧 Simulando envio de email para:', to);
        console.log('📧 Assunto:', subject);
        console.log('📧 Conteúdo:', body);
        return true; // Simula sucesso para não quebrar o fluxo
      }

      // Importar EmailJS dinamicamente
      const emailjs = await import('@emailjs/browser');
      
      const templateParams = {
        to_email: to,
        to_name: to.split('@')[0],
        from_name: 'aMORA - Plataforma de Imóveis',
        subject: subject,
        message: body,
        reply_to: 'noreply@amora.com'
      };

      const response = await emailjs.send(
        this.SERVICE_ID,
        this.TEMPLATE_ID,
        templateParams,
        this.PUBLIC_KEY
      );

      console.log('✅ Email enviado com sucesso:', response);
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      return false;
    }
  }

  // Alternativa usando Supabase Edge Functions (recomendado para produção)
  static async sendEmailViaSupabase(to: string, subject: string, body: string): Promise<boolean> {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          body,
          from: 'noreply@amora.com.br'
        })
      });

      if (response.ok) {
        console.log('✅ Email enviado via Supabase');
        return true;
      } else {
        console.error('❌ Erro na API de email:', await response.text());
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao enviar email via Supabase:', error);
      return false;
    }
  }
}