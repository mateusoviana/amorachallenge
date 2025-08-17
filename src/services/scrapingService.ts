import axios from 'axios';

export interface ScrapedApartmentData {
  title: string;
  description: string;
  price: number;
  condominiumFee: number;
  iptu: number;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  area: number;
  images: string[];
}

const SCRAPINGBEE_API_KEY = process.env.REACT_APP_SCRAPINGBEE_API_KEY;

export const scrapingService = {
  async scrapeApartmentListing(url: string): Promise<ScrapedApartmentData> {
    if (this.isValidQuintoAndarUrl(url)) {
      return this.scrapeQuintoAndarListing(url);
    } else if (this.isValidOlxUrl(url)) {
      return this.scrapeOlxListing(url);
    } else {
      throw new Error('URL não suportada. Use links do QuintoAndar ou OLX.');
    }
  },

  async scrapeQuintoAndarListing(url: string): Promise<ScrapedApartmentData> {
    if (!SCRAPINGBEE_API_KEY) {
      throw new Error('ScrapingBee API key não configurada');
    }

    try {
      const response = await axios.get('https://app.scrapingbee.com/api/v1/', {
        params: {
          api_key: SCRAPINGBEE_API_KEY,
          url: url,
          render_js: 'true',
          wait: 3000
        }
      });

      const html = response.data;
      
      // Extrair dados do HTML
      const titleText = this.extractTitle(html);
      const metaDescription = this.extractMetaDescription(html);
      
      // Tentar extrair dados do JSON-LD estruturado
      let structuredData = this.extractJsonLd(html);
      
      // Usar dados estruturados se disponíveis, senão fazer fallback para parsing manual
      if (structuredData) {
        const { address, neighborhood, city, state } = this.parseAddressFromStructured(structuredData.address);
        
        const { condominiumFee, iptu } = this.extractFeesFromHtml(html);
        
        return {
          title: structuredData.name || titleText,
          description: structuredData.description || metaDescription || 'Imóvel importado do QuintoAndar',
          price: structuredData.potentialAction?.price || 0,
          condominiumFee,
          iptu,
          address,
          neighborhood,
          city,
          state,
          bedrooms: structuredData.numberOfRooms || 1,
          bathrooms: structuredData.numberOfFullBathrooms || 1,
          parkingSpaces: this.extractParkingFromJson(html) || this.parseParkingFromAmenities(structuredData.amenityFeature) || 0,
          area: structuredData.floorSize || 50,
          images: Array.isArray(structuredData.image) ? structuredData.image.slice(0, 5) : []
        };
      } else {
        // Fallback para parsing manual
        const { bedrooms, area, parking } = this.parseFromTitle(titleText);
        const { address, neighborhood, city, state } = this.parseLocationFromMeta(metaDescription, titleText);
        const images = this.extractImages(html);
        
        const { condominiumFee, iptu } = this.extractFeesFromHtml(html);
        
        return {
          title: titleText,
          description: metaDescription || 'Imóvel importado do QuintoAndar',
          price: 0, // Não conseguimos extrair sem dados estruturados
          condominiumFee,
          iptu,
          address,
          neighborhood,
          city,
          state,
          bedrooms: bedrooms || 1,
          bathrooms: 1,
          parkingSpaces: parking || 0,
          area: area || 50,
          images: images.slice(0, 5)
        };
      }
    } catch (error) {
      console.error('Erro ao fazer scraping:', error);
      throw new Error('Erro ao extrair dados do imóvel. Verifique se o link é válido.');
    }
  },

  parsePrice(priceText: string): number {
    const cleanPrice = priceText.replace(/[^\d]/g, '');
    return parseInt(cleanPrice) || 0;
  },

  parseNumber(text: string): number {
    const match = text?.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  },

  parseArea(areaText: string): number {
    const match = areaText?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  },

  parseFromTitle(titleText: string): { bedrooms: number; area: number; parking: number } {
    const bedroomsMatch = titleText.match(/(\d+)\s*quartos?/i);
    const bedrooms = bedroomsMatch ? parseInt(bedroomsMatch[1]) : 1;
    
    const areaMatch = titleText.match(/(\d+)m²/i);
    const area = areaMatch ? parseInt(areaMatch[1]) : 50;
    
    const parkingMatch = titleText.match(/(\d+)\s*vagas?/i);
    const parking = parkingMatch ? parseInt(parkingMatch[1]) : 0;
    
    return { bedrooms, area, parking };
  },

  parseAddressFromStructured(addressText: string): { address: string; neighborhood: string; city: string; state: string } {
    // Exemplo: "Avenida Vila Ema, Vila Ema, São Paulo"
    const parts = addressText.split(',').map(p => p.trim());
    
    return {
      address: parts[0] || 'Endereço não especificado',
      neighborhood: parts[1] || 'Bairro não especificado',
      city: parts[2] || 'São Paulo',
      state: 'SP'
    };
  },

  parseParkingFromAmenities(amenities: any[]): number {
    if (!Array.isArray(amenities)) return 0;
    
    // Procurar por amenidades relacionadas a garagem/vaga
    const parkingAmenity = amenities.find(amenity => 
      amenity.name && (
        amenity.name.toLowerCase().includes('garagem') ||
        amenity.name.toLowerCase().includes('vaga de garagem') ||
        amenity.name.toLowerCase().includes('box')
      )
    );
    
    return parkingAmenity?.value ? 1 : 0;
  },

  parseLocationFromMeta(metaDescription: string, titleText: string): { address: string; neighborhood: string; city: string; state: string } {
    let neighborhood = '';
    let city = 'São Paulo';
    let state = 'SP';
    let address = '';
    
    const locationMatch = titleText.match(/em\s+([^,]+),?\s*([^,]*)/i);
    if (locationMatch) {
      neighborhood = locationMatch[1].trim();
      if (locationMatch[2]) {
        city = locationMatch[2].trim();
      }
    }
    
    if (!neighborhood && metaDescription) {
      const metaLocationMatch = metaDescription.match(/([A-Za-z\u00c0-\u00ff\s]+),\s*São Paulo/i);
      if (metaLocationMatch) {
        neighborhood = metaLocationMatch[1].trim();
      }
    }
    
    return {
      address: address || 'Endereço não especificado',
      neighborhood: neighborhood || 'Bairro não especificado',
      city,
      state
    };
  },

  parseAddress(addressText: string): { address: string; neighborhood: string; city: string; state: string } {
    const parts = addressText.split(',').map(p => p.trim());
    
    return {
      address: parts[0] || '',
      neighborhood: parts[1] || '',
      city: parts[2] || 'São Paulo',
      state: 'SP'
    };
  },

  extractTitle(html: string): string {
    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    return titleMatch ? titleMatch[1].trim() : 'Apartamento QuintoAndar';
  },

  extractMetaDescription(html: string): string {
    const metaMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
    return metaMatch ? metaMatch[1] : '';
  },

  extractJsonLd(html: string): any {
    const scriptMatches = html.match(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
    if (!scriptMatches) return null;
    
    for (const scriptMatch of scriptMatches) {
      const jsonContent = scriptMatch.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
      try {
        const data = JSON.parse(jsonContent);
        if (data['@type'] === 'Apartment' || data.numberOfRooms) {
          return data;
        }
      } catch (e) {
        continue;
      }
    }
    return null;
  },

  extractImages(html: string): string[] {
    const imageMatches = html.match(/data-testid="media-image"[^>]*src="([^"]+)"/gi);
    if (!imageMatches) return [];
    
    return imageMatches.map(match => {
      const srcMatch = match.match(/src="([^"]+)"/);
      return srcMatch ? srcMatch[1] : '';
    }).filter(src => src.length > 0);
  },

  extractFeesFromHtml(html: string): { condominiumFee: number; iptu: number } {
    let condominiumFee = 0;
    let iptu = 0;
    
    // Procurar por condomínio - diferentes padrões
    const condPatterns = [
      /"condominium":\{[^}]*"value":(\d+)/i,
      /"monthlyCondominiumFee"[^0-9]*(\d+)/i,
      /condom[\u00ed\u00ed]nio[^0-9]*R?\$?\s*([\d.,]+)/i
    ];
    
    for (const pattern of condPatterns) {
      const match = html.match(pattern);
      if (match) {
        condominiumFee = parseInt(match[1].replace(/[^\d]/g, '')) || 0;
        break;
      }
    }
    
    // Procurar por IPTU - diferentes padrões
    const iptuPatterns = [
      /"iptu":(\d+)/i,
      /"propertyTax"[^0-9]*(\d+)/i,
      /iptu[^0-9]*R?\$?\s*([\d.,]+)/i
    ];
    
    for (const pattern of iptuPatterns) {
      const match = html.match(pattern);
      if (match) {
        iptu = parseInt(match[1].replace(/[^\d]/g, '')) || 0;
        break;
      }
    }
    
    return { condominiumFee, iptu };
  },

  extractParkingFromJson(html: string): number {
    // Verificar se tem "Box" nas amenidades (indica vaga)
    const hasBox = html.includes('"name":"Box"') && html.includes('"value":true');
    if (hasBox) {
      return 1;
    }
    
    // Procurar por dados de vagas no JSON estruturado
    const parkingPatterns = [
      /"parking":(\d+)/i,
      /"garageSpaces":(\d+)/i,
      /"numberOfParkingSpaces":(\d+)/i
    ];
    
    for (const pattern of parkingPatterns) {
      const match = html.match(pattern);
      if (match) {
        return parseInt(match[1]) || 0;
      }
    }
    
    return 0;
  },

  async scrapeOlxListing(url: string): Promise<ScrapedApartmentData> {
    if (!SCRAPINGBEE_API_KEY) {
      throw new Error('ScrapingBee API key não configurada');
    }

    try {
      const response = await axios.get('https://app.scrapingbee.com/api/v1/', {
        params: {
          api_key: SCRAPINGBEE_API_KEY,
          url: url,
          render_js: 'true',
          wait: 3000
        }
      });

      const html = response.data;
      
      // Extrair dados do JSON-LD da OLX
      const structuredData = this.extractOlxJsonLd(html);
      const dataJson = this.extractOlxDataJson(html);
      
      if (structuredData && dataJson) {
        const product = structuredData.Object;
        const ad = dataJson.ad;
        
        return {
          title: product.name || ad.subject,
          description: this.cleanDescription(product.description || ad.description || ad.body),
          price: parseInt(structuredData.priceSpecification?.price || ad.priceValue?.replace(/[^\d]/g, '') || '0'),
          condominiumFee: this.parseOlxProperty(ad.properties, 'condominio') || 0,
          iptu: this.parseOlxProperty(ad.properties, 'iptu') || 0,
          address: ad.location?.address || structuredData.location?.address?.addressLocality || 'Endereço não especificado',
          neighborhood: ad.location?.neighbourhood || 'Bairro não especificado',
          city: ad.location?.municipality || structuredData.location?.address?.addressLocality || 'Cidade não especificada',
          state: ad.location?.uf || structuredData.location?.address?.addressRegion || 'Estado não especificado',
          bedrooms: this.parseOlxProperty(ad.properties, 'rooms') || 1,
          bathrooms: this.parseOlxProperty(ad.properties, 'bathrooms') || 1,
          parkingSpaces: this.parseOlxProperty(ad.properties, 'garage_spaces') || 0,
          area: this.parseOlxProperty(ad.properties, 'size') || 50,
          images: this.extractOlxImages(product.image || ad.images || [])
        };
      } else {
        throw new Error('Não foi possível extrair dados estruturados da OLX');
      }
    } catch (error) {
      console.error('Erro ao fazer scraping da OLX:', error);
      throw new Error('Erro ao extrair dados do imóvel da OLX. Verifique se o link é válido.');
    }
  },

  extractOlxJsonLd(html: string): any {
    const scriptMatches = html.match(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
    if (!scriptMatches) return null;
    
    for (const scriptMatch of scriptMatches) {
      const jsonContent = scriptMatch.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
      try {
        const data = JSON.parse(jsonContent);
        if (data['@type'] === 'BuyAction' && data.Object?.['@type'] === 'Product') {
          return data;
        }
      } catch (e) {
        continue;
      }
    }
    return null;
  },

  extractOlxDataJson(html: string): any {
    const dataJsonMatch = html.match(/data-json="([^"]*)"/i);
    if (!dataJsonMatch) return null;
    
    try {
      const jsonStr = dataJsonMatch[1].replace(/&quot;/g, '"');
      return JSON.parse(jsonStr);
    } catch (e) {
      return null;
    }
  },

  parseOlxProperty(properties: any[], propertyName: string): number {
    if (!Array.isArray(properties)) return 0;
    
    const property = properties.find(p => p.name === propertyName);
    if (!property) return 0;
    
    const value = property.value;
    if (typeof value === 'string') {
      // Para condomínio e IPTU, extrair valores monetários
      if (propertyName === 'condominio' || propertyName === 'iptu') {
        const match = value.match(/R\$\s*([\d.,]+)/);
        return match ? parseInt(match[1].replace(/[^\d]/g, '')) : 0;
      }
      // Para outros campos, extrair apenas números
      const match = value.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    }
    
    return parseInt(value) || 0;
  },

  extractOlxImages(images: any[]): string[] {
    if (!Array.isArray(images)) return [];
    
    return images.map(img => {
      if (typeof img === 'string') return img;
      if (img.contentUrl) return img.contentUrl;
      if (img.original) return img.original;
      return '';
    }).filter(url => url.length > 0).slice(0, 5);
  },

  cleanDescription(description: string): string {
    if (!description) return 'Descrição não disponível';
    return description.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '').trim();
  },

  isValidQuintoAndarUrl(url: string): boolean {
    return url.includes('quintoandar.com.br') && url.includes('/imovel/');
  },

  isValidOlxUrl(url: string): boolean {
    return url.includes('olx.com.br') && url.includes('/imoveis/');
  }
};