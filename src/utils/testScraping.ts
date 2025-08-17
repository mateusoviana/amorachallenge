// Utilitário para testar a funcionalidade de scraping
// Este arquivo pode ser usado para debug e testes durante desenvolvimento

import { scrapingService } from '../services/scrapingService';

export const testScrapingFunctionality = async () => {
  console.log('🧪 Testando funcionalidade de scraping...');
  
  // URLs de teste (substitua por URLs reais para testar)
  const testUrls = [
    'https://www.quintoandar.com.br/imovel/apartamento-2-quartos-jardins-sao-paulo-sp-brasil',
    'https://www.quintoandar.com.br/imovel/casa-3-quartos-vila-madalena-sao-paulo',
  ];

  for (const url of testUrls) {
    try {
      console.log(`\n📍 Testando URL: ${url}`);
      
      // Validar URL
      const isValid = scrapingService.isValidQuintoAndarUrl(url);
      console.log(`✅ URL válida: ${isValid}`);
      
      if (!isValid) {
        console.log('❌ URL inválida, pulando...');
        continue;
      }

      // Tentar extrair dados (comentado para evitar uso desnecessário da API)
      // const data = await scrapingService.scrapeQuintoAndarListing(url);
      // console.log('📊 Dados extraídos:', data);
      
    } catch (error) {
      console.error(`❌ Erro ao processar ${url}:`, error);
    }
  }
  
  console.log('\n🏁 Teste concluído!');
};

// Função para testar parsing de dados
export const testDataParsing = () => {
  console.log('🧪 Testando parsing de dados...');
  
  // Testar parsing de preço
  const priceTests = [
    'R$ 450.000',
    'R$ 3.500/mês',
    '450000',
    'R$450.000,00'
  ];
  
  priceTests.forEach(price => {
    const parsed = scrapingService.parsePrice(price);
    console.log(`💰 "${price}" -> ${parsed}`);
  });
  
  // Testar parsing de área
  const areaTests = [
    '75m²',
    '75 m²',
    '75',
    '75.5m²'
  ];
  
  areaTests.forEach(area => {
    const parsed = scrapingService.parseArea(area);
    console.log(`📐 "${area}" -> ${parsed}m²`);
  });
  
  // Testar parsing de endereço
  const addressTests = [
    'Rua Augusta, 1234, Jardins, São Paulo',
    'Av. Paulista, 1000, Bela Vista',
    'Rua das Flores, 123'
  ];
  
  addressTests.forEach(address => {
    const parsed = scrapingService.parseAddress(address);
    console.log(`📍 "${address}" ->`, parsed);
  });
  
  console.log('🏁 Teste de parsing concluído!');
};

// Para usar no console do navegador:
// import { testDataParsing } from './utils/testScraping';
// testDataParsing();