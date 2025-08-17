# Exemplo Prático - Importação via Link

## 🎯 Cenário de Uso

Um corretor encontrou um imóvel interessante no QuintoAndar e quer cadastrá-lo rapidamente na plataforma aMORA para seus clientes.

## 📝 Passo a Passo

### 1. Encontrar o Imóvel
- Acesse o site do QuintoAndar
- Navegue até um imóvel de interesse
- Copie a URL completa (ex: `https://www.quintoandar.com.br/imovel/apartamento-2-quartos-jardins-sao-paulo-sp-brasil`)

### 2. Importar na aMORA
1. **Login** na plataforma aMORA
2. **Navegue** para "Gerenciar Imóveis" (`/add-apartment`)
3. **Clique** na aba "Importar via Link"
4. **Cole** a URL do QuintoAndar
5. **Clique** em "Importar Dados"

### 3. Resultado Esperado
```json
{
  "title": "Apartamento com 2 quartos para alugar, 75m²",
  "description": "Apartamento moderno com 2 quartos, sala ampla, cozinha equipada...",
  "price": 3500,
  "address": "Rua Augusta, 1234",
  "neighborhood": "Jardins",
  "city": "São Paulo",
  "state": "SP",
  "bedrooms": 2,
  "bathrooms": 2,
  "parkingSpaces": 1,
  "area": 75,
  "images": [
    "https://img.quintoandar.com.br/image1.jpg",
    "https://img.quintoandar.com.br/image2.jpg"
  ]
}
```

### 4. Revisão e Ajustes
- **Verifique** se todos os dados foram extraídos corretamente
- **Ajuste** informações se necessário:
  - Título mais descritivo
  - Descrição personalizada
  - Preço atualizado
  - Grupos específicos
- **Configure** visibilidade (público/privado)

### 5. Salvar
- **Clique** em "Salvar Imóvel"
- **Confirme** o cadastro
- **Imóvel** estará disponível na plataforma

## ⚡ Vantagens

### Antes (Manual)
- ⏱️ **15-20 minutos** para cadastrar um imóvel
- 📝 **Digitação manual** de todos os campos
- 🖼️ **Upload individual** de cada imagem
- ❌ **Possibilidade de erros** de digitação

### Depois (Automático)
- ⏱️ **2-3 minutos** para importar e revisar
- 🤖 **Preenchimento automático** de 90% dos campos
- 🖼️ **Importação automática** de até 5 imagens
- ✅ **Dados consistentes** extraídos da fonte

## 🔍 Casos de Teste

### URLs Válidas
```
✅ https://www.quintoandar.com.br/imovel/apartamento-2-quartos-jardins-sao-paulo-sp-brasil
✅ https://quintoandar.com.br/imovel/casa-3-quartos-vila-madalena-sao-paulo
✅ https://www.quintoandar.com.br/imovel/studio-centro-rio-de-janeiro-rj
```

### URLs Inválidas
```
❌ https://www.olx.com.br/imovel/apartamento-sp
❌ https://www.vivareal.com.br/imovel/casa-sp
❌ https://www.quintoandar.com.br/busca
❌ https://google.com
```

## 🐛 Tratamento de Erros

### Erro: "URL deve ser do QuintoAndar"
**Causa:** URL não é do domínio quintoandar.com.br  
**Solução:** Verificar se a URL está correta

### Erro: "Erro ao extrair dados do imóvel"
**Causa:** Página não encontrada ou estrutura HTML mudou  
**Solução:** 
1. Verificar se o link está acessível
2. Tentar novamente em alguns minutos
3. Cadastrar manualmente se persistir

### Dados Incompletos
**Causa:** Alguns campos não foram encontrados na página  
**Solução:** Preencher manualmente os campos faltantes

## 📊 Métricas de Sucesso

### Taxa de Sucesso Esperada
- **95%** - URLs válidas do QuintoAndar
- **90%** - Extração completa de dados básicos
- **80%** - Extração de todas as imagens
- **70%** - Descrição completa extraída

### Tempo de Processamento
- **3-5 segundos** - Extração de dados
- **2-3 minutos** - Revisão e ajustes pelo usuário
- **Total: ~3 minutos** vs 15-20 minutos manual

## 💡 Dicas Avançadas

### Para Corretores
1. **Importe em lote** durante horários de menor tráfego
2. **Crie templates** de descrição personalizados
3. **Configure grupos padrão** para diferentes tipos de cliente
4. **Mantenha backup** dos links originais

### Para Compradores
1. **Use grupos privados** para organizar imóveis de interesse
2. **Adicione notas pessoais** na descrição
3. **Configure alertas** para imóveis similares
4. **Compartilhe** com outros membros do grupo

---

**💡 Lembre-se:** Esta funcionalidade economiza tempo, mas sempre revise os dados antes de salvar!