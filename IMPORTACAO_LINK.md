# Importação de Imóveis via Link - MVP

## 📋 Sobre a Funcionalidade

Esta funcionalidade permite importar dados de imóveis automaticamente através de links do **QuintoAndar**, utilizando a API do **ScrapingBee** para extrair as informações da página.

## 🚀 Como Usar

1. **Acesse a página de cadastro de imóveis** (`/add-apartment`)
2. **Clique na aba "Importar via Link"**
3. **Cole o link do imóvel do QuintoAndar**
4. **Clique em "Importar Dados"**
5. **Revise as informações na aba "Cadastrar/Editar"**
6. **Ajuste os dados se necessário e salve**

## ⚙️ Configuração

### 1. Criar conta no ScrapingBee
- Acesse [ScrapingBee](https://www.scrapingbee.com/)
- Crie uma conta gratuita (1000 requests/mês)
- Obtenha sua API Key

### 2. Configurar variáveis de ambiente
Adicione no arquivo `.env`:
```env
REACT_APP_SCRAPINGBEE_API_KEY=sua_api_key_aqui
```

## 📊 Dados Extraídos

A funcionalidade extrai automaticamente:
- **Título** do imóvel
- **Preço** de venda/aluguel
- **Endereço** completo
- **Número de quartos**
- **Número de banheiros**
- **Vagas de garagem**
- **Área** em m²
- **Descrição** do imóvel
- **Imagens** (até 5 fotos)

## 🔧 Implementação Técnica

### Arquivos Criados/Modificados:
- `src/services/scrapingService.ts` - Serviço de integração com ScrapingBee
- `src/pages/AddApartment/AddApartment.tsx` - Adicionada nova aba de importação
- `.env.example` - Adicionada variável de ambiente

### Fluxo de Funcionamento:
1. **Validação da URL** - Verifica se é um link válido do QuintoAndar
2. **Chamada para ScrapingBee** - Extrai dados usando seletores CSS
3. **Parsing dos dados** - Converte strings em números e formata endereços
4. **Preenchimento automático** - Popula o formulário com os dados extraídos

## 🎯 Limitações do MVP

- **Apenas QuintoAndar** - Suporte inicial apenas para este site
- **Dependente de estrutura HTML** - Pode quebrar se o site mudar
- **Sem validação avançada** - Dados extraídos podem precisar de revisão
- **Rate limiting** - Limitado pelas cotas da API do ScrapingBee

## 🔮 Próximos Passos

### Melhorias Planejadas:
- [ ] Suporte para **OLX Imóveis**
- [ ] Suporte para **Viva Real**
- [ ] Suporte para **ZAP Imóveis**
- [ ] **Validação automática** de dados extraídos
- [ ] **Cache** de dados para evitar re-scraping
- [ ] **Fallback** para extração manual se scraping falhar
- [ ] **Preview** dos dados antes de importar

### Melhorias Técnicas:
- [ ] **Error handling** mais robusto
- [ ] **Retry logic** para falhas temporárias
- [ ] **Logging** detalhado para debugging
- [ ] **Testes unitários** para parsing de dados
- [ ] **Validação de schema** dos dados extraídos

## 🛠️ Troubleshooting

### Problemas Comuns:

**"ScrapingBee API key não configurada"**
- Verifique se a variável `REACT_APP_SCRAPINGBEE_API_KEY` está no `.env`
- Reinicie o servidor de desenvolvimento

**"URL deve ser do QuintoAndar"**
- Certifique-se de usar um link válido: `https://www.quintoandar.com.br/imovel/...`

**"Erro ao extrair dados do imóvel"**
- O site pode ter mudado sua estrutura
- Verifique se o link está acessível
- Tente novamente em alguns minutos

**Dados incompletos ou incorretos**
- Revise sempre os dados na aba "Cadastrar/Editar"
- Ajuste manualmente campos que não foram extraídos corretamente

## 📈 Monitoramento

Para acompanhar o uso da funcionalidade:
- **Console do navegador** - Logs de debug
- **Dashboard ScrapingBee** - Uso da API e quotas
- **Feedback dos usuários** - Relatórios de problemas

## 💡 Dicas de Uso

1. **Sempre revise** os dados importados antes de salvar
2. **Teste com diferentes tipos** de imóveis (apartamento, casa, etc.)
3. **Mantenha backup** dos dados importantes
4. **Use a funcionalidade** durante horários de menor tráfego para melhor performance

---

**Versão:** 1.0.0 (MVP)  
**Data:** Dezembro 2024  
**Status:** ✅ Funcional