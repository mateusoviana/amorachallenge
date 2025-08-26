# aMORA - Plataforma Completa de Imóveis

Uma plataforma web moderna e completa para busca, comparação, gerenciamento e colaboração em projetos imobiliários, desenvolvida com React, TypeScript e Material-UI.

## 🏠 Sobre o Projeto

A aMORA é uma plataforma inovadora que resolve os principais problemas do mercado imobiliário:

- **Compradores**: Organizam, comparam e colaboram na busca por imóveis
- **Corretores**: Apresentam o modelo aMORA e gerenciam portfólios
- **Grupos**: Colaboram em projetos de compra de forma eficiente
- **Engajamento**: Sistema de notificações e reativação de leads

## ✨ Funcionalidades Implementadas

### 🏘️ Sistema de Imóveis
- **Cadastro Completo**: Formulário detalhado para apartamentos e casas
- **Importação Automática**: Via link do QuintoAndar e OLX usando ScrapingBee
- **Galeria de Imagens**: Upload e gerenciamento de fotos dos imóveis
- **Filtros Avançados**: Por preço, área, quartos, localização e grupos
- **Visualização Detalhada**: Página completa com todas as informações
- **Calculadora aMORA**: Simulação de financiamento com entrada reduzida (5% vs 20%)
- **Comparação de Imóveis**: Página dedicada para comparar múltiplos imóveis
- **Dashboard Interativo**: Gráficos e estatísticas para corretores

### 📊 Sistema de Analytics e Dashboard
- **Dashboard de Corretores**: Gráficos interativos com Recharts
- **Gráficos de Pizza**: Distribuição por bairro e faixa de preço
- **Gráficos de Barras**: Preços médios por bairro
- **Gráficos de Linha**: Crescimento mensal do portfólio
- **Exportação PDF**: Relatórios profissionais em PDF
- **Estatísticas Detalhadas**: Análise completa do portfólio

### 👥 Sistema de Usuários e Autenticação
- **Dois Tipos de Usuário**: Compradores e Corretores
- **Perfis Personalizáveis**: Informações e preferências
- **Sistema de Autenticação**: Login/Logout com persistência
- **Controle de Acesso**: Permissões baseadas em tipo de usuário
- **Modal de Autenticação**: Interface integrada para login/registro

### 👥 Sistema de Grupos Colaborativos
- **Criação de Grupos**: Grupos privados para colaboração
- **Controle de Permissões**: Admin e membros com diferentes níveis
- **Adição de Membros**: Convite de usuários para grupos específicos
- **Seleção Visual**: Interface para escolher imóveis para o grupo
- **Organização por Projeto**: Imóveis organizados por projeto
- **Notificações Automáticas**: Emails quando novos imóveis são adicionados

### 📧 Sistema de Notificações e Engajamento
- **Notificações por Email**: Alertas automáticos via EmailJS
- **Sistema de Alertas**: Notificações visuais na interface
- **Reativação de Leads**: Emails personalizados com detalhes dos imóveis
- **Integração WhatsApp**: Compartilhamento direto de imóveis
- **Gerenciador de Alertas**: Interface para gerenciar notificações

### 🔍 Sistema de Filtros e Busca
- **Filtros Avançados**: Por características físicas, localização, grupos
- **Filtros por Preço**: Faixas de preço personalizáveis
- **Filtros por Área**: Metragem quadrada
- **Filtros por Localização**: Bairros e regiões
- **Filtros por Grupos**: Imóveis específicos de grupos

### 💬 Sistema de Interação
- **Comentários**: Sistema de comentários em imóveis
- **Reações**: Sistema de reações (like, dislike, etc.)
- **Feedback**: Sistema de feedback para corretores
- **Scoring**: Sistema de pontuação para imóveis

### 🏠 Sistema de Match (Amora Match)
- **Swipe de Imóveis**: Interface similar ao Tinder para imóveis
- **Sistema de Match**: Algoritmo de compatibilidade
- **Redirecionamento Inteligente**: Navegação contextual
- **Perfil de Preferências**: Configuração de critérios de busca

### 📱 Sistema de Responsividade
- **Design Responsivo**: Funciona em desktop, tablet e mobile
- **Interface Adaptativa**: Layouts otimizados para cada dispositivo
- **Navegação Mobile**: Otimizada para touch

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18**: Framework principal
- **TypeScript**: Type safety e melhor DX
- **Material-UI (MUI) v5**: Componentes e tema
- **React Router v6**: Navegação SPA
- **React Hooks + Context API**: Gerenciamento de estado
- **Emotion**: Estilização CSS-in-JS

### Bibliotecas de Terceiros
- **Recharts**: Gráficos interativos para dashboards
- **EmailJS**: Notificações por email sem backend
- **jsPDF + jsPDF-AutoTable**: Exportação de relatórios em PDF
- **ScrapingBee**: Web scraping para importação de imóveis
- **React Dropzone**: Upload de imagens

### Build e Deploy
- **Create React App**: Configuração inicial
- **Netlify**: Hospedagem e deploy automático

## 🚀 Passo a Passo para Rodar o Projeto Localmente

### ⚠️ Importante
**Não há necessidade de rodar localmente!** A aplicação já está hospedada e disponível em:
**https://www.amorachallenge.netlify.app**

### Caso queira rodar localmente:

#### Pré-requisitos
- **Node.js**: Versão 16 ou superior
- **npm**: Gerenciador de pacotes (vem com Node.js)
- **Git**: Para clonar o repositório
- **Navegador moderno**: Chrome, Firefox, Safari ou Edge

#### Instalação e Configuração

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd amorachallenge
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente (opcional)**
Crie um arquivo `.env` na raiz do projeto:
```env
# Configurações básicas
REACT_APP_API_URL=http://localhost:3001
REACT_APP_APP_NAME=aMORA

# Supabase (para funcionalidades avançadas)
REACT_APP_SUPABASE_URL=sua_url_supabase
REACT_APP_SUPABASE_ANON_KEY=sua_chave_supabase

# ScrapingBee (para importação via link)
REACT_APP_SCRAPINGBEE_API_KEY=sua_chave_scrapingbee

# EmailJS (para notificações por email)
REACT_APP_EMAILJS_SERVICE_ID=gmail
REACT_APP_EMAILJS_TEMPLATE_ID=template_alerts
REACT_APP_EMAILJS_PUBLIC_KEY=sua_chave_emailjs
```

4. **Execute a aplicação**
```bash
npm start
```

5. **Acesse no navegador**
```
http://localhost:3000
```

### Solução de Problemas Comuns

#### **Porta 3000 já em uso**
Se a porta 3000 estiver ocupada, o React perguntará se deseja usar outra porta. Responda `Y` para continuar.

#### **Erro de dependências**
```bash
# Limpe o cache do npm
npm cache clean --force

# Delete node_modules e reinstale
rm -rf node_modules package-lock.json
npm install
```

#### **Erro de TypeScript**
```bash
# Verifique se há erros de compilação
npm run build
```

### Dados de Teste
A aplicação vem com dados mockados para demonstração:
- **Usuários**: Compradores e corretores de exemplo
- **Imóveis**: Apartamentos e casas em diferentes bairros
- **Grupos**: Grupos colaborativos de exemplo

## 🎯 Decisões Técnicas e de Produto Relevantes

### **Arquitetura Frontend**
- **React + TypeScript**: Escolhido para type safety, melhor DX e manutenibilidade
- **Material-UI**: Componentes prontos, tema customizável e consistência visual
- **Context API**: Gerenciamento de estado global simples e eficiente
- **React Router**: Navegação SPA com URLs amigáveis e SEO-friendly

### **Experiência do Usuário**
- **Design Responsivo**: Funciona perfeitamente em todos os dispositivos
- **Navegação Intuitiva**: Fluxo claro e lógico entre páginas
- **Feedback Visual**: Loading states, tooltips, notificações e alertas
- **Acessibilidade**: Cores contrastantes, navegação por teclado e semântica HTML

### **Modelo de Negócio**
- **Freemium**: Uso gratuito inicial, funcionalidades avançadas para corretores
- **Colaboração**: Grupos para casais, famílias e corretores trabalharem juntos
- **Integração**: WhatsApp e email para engajamento contínuo
- **Viralização**: Compartilhamento fácil de imóveis e grupos

### **Tecnologias de Terceiros**
- **ScrapingBee**: Importação automática de imóveis via link (QuintoAndar/OLX)
- **EmailJS**: Notificações por email sem necessidade de backend
- **Recharts**: Dashboards interativos e profissionais para corretores
- **jsPDF**: Exportação de relatórios em PDF para apresentações

### **Segurança e Privacidade**
- **Autenticação Simulada**: Sistema mock robusto para demonstração
- **Controle de Acesso**: Permissões baseadas em tipo de usuário
- **Dados Privados**: Imóveis e grupos restritos aos membros autorizados
- **Validação de Dados**: Validação client-side e sanitização

### **Performance e Escalabilidade**
- **Lazy Loading**: Carregamento sob demanda de componentes
- **Otimização de Imagens**: Compressão e carregamento otimizado
- **Memoização**: Uso de React.memo e useMemo para performance
- **Code Splitting**: Separação de código por rotas

## 🎯 Como Cada Problema Foi Endereçado

### **1. Desorganização da Busca de Imóveis**
**Problema**: Ferramenta para salvar, organizar e comparar imóveis (via link, input manual ou crawler).

**Soluções Implementadas**:
- ✅ **Sistema de Grupos**: Criação de grupos colaborativos para organizar imóveis por projeto
- ✅ **Importação via Link**: Integração com ScrapingBee para importar imóveis do QuintoAndar e OLX automaticamente
- ✅ **Cadastro Manual**: Formulário completo e intuitivo para adicionar imóveis manualmente
- ✅ **Sistema de Filtros**: Filtros avançados por preço, área, quartos, localização e grupos
- ✅ **Comparação de Imóveis**: Página dedicada para comparar múltiplos imóveis lado a lado com tabelas detalhadas
- ✅ **Dashboard Interativo**: Gráficos e estatísticas para análise completa do portfólio
- ✅ **Sistema de Comentários**: Comentários e feedback em cada imóvel
- ✅ **Sistema de Reações**: Sistema de scoring e reações para imóveis

### **2. Falta de Engajamento Contínuo**
**Problema**: Notificações ou sugestões quando aparecer algo parecido com o que o lead busca e reativação via WhatsApp ou e-mail.

**Soluções Implementadas**:
- ✅ **Sistema de Notificações**: EmailJS integrado para notificar membros de grupos sobre novos imóveis
- ✅ **Notificações por Email**: Alertas automáticos quando novos imóveis são adicionados aos grupos
- ✅ **Integração WhatsApp**: Botões de compartilhamento direto para WhatsApp com mensagens personalizadas
- ✅ **Sistema de Alertas**: Notificações visuais na interface para novos imóveis
- ✅ **Reativação Automática**: Emails personalizados com detalhes dos novos imóveis
- ✅ **Gerenciador de Alertas**: Interface para configurar e gerenciar notificações
- ✅ **Sistema de Match**: Algoritmo de compatibilidade para sugerir imóveis relevantes

### **3. Dificuldade de Colaboração**
**Problema**: Contas ou links colaborativos para que casais, famílias e corretores trabalhem juntos.

**Soluções Implementadas**:
- ✅ **Sistema de Grupos**: Criação de grupos privados para colaboração
- ✅ **Controle de Permissões**: Admin e membros com diferentes níveis de acesso
- ✅ **Adição de Membros**: Convite de usuários para grupos específicos
- ✅ **Compartilhamento de Imóveis**: Adição de imóveis aos grupos colaborativos
- ✅ **Interface Colaborativa**: Página dedicada para seleção visual de imóveis em grupo
- ✅ **Notificações em Grupo**: Alertas automáticos para todos os membros
- ✅ **Sistema de Comentários**: Comentários colaborativos em imóveis
- ✅ **Sistema de Reações**: Feedback coletivo sobre imóveis

### **4. Corretores sem Ferramentas para Apresentar a aMORA**
**Problema**: Páginas personalizadas e interface para cadastrar imóveis junto com a apresentação do modelo aMORA.

**Soluções Implementadas**:
- ✅ **Dashboard de Corretores**: Interface dedicada com gráficos interativos e estatísticas
- ✅ **Calculadora aMORA**: Simulação de financiamento com entrada reduzida (5% vs 20%)
- ✅ **Páginas de Apresentação**: Explicação detalhada do modelo aMORA com exemplos
- ✅ **Cadastro de Imóveis**: Interface completa para corretores adicionarem imóveis
- ✅ **Relatórios em PDF**: Exportação de comparações e relatórios em formato profissional
- ✅ **Interface Profissional**: Design focado na experiência do corretor
- ✅ **Sistema de Upload**: Upload de imagens com preview e organização
- ✅ **Gerenciamento de Portfólio**: Interface para gerenciar todos os imóveis

### **5. Captação e Ativação de Leads sem Custo de Mídia**
**Problema**: Uso sem login obrigatório no início, integração com WhatsApp e potencial de viralização orgânica.

**Soluções Implementadas**:
- ✅ **Acesso Gratuito**: Visualização de imóveis públicos sem necessidade de cadastro
- ✅ **Login Opcional**: Usuários podem explorar a plataforma antes de se cadastrar
- ✅ **Integração WhatsApp**: Compartilhamento direto de imóveis via WhatsApp
- ✅ **Viralização Orgânica**: Links compartilháveis para imóveis e grupos
- ✅ **Modelo Freemium**: Funcionalidades básicas gratuitas, avançadas para corretores
- ✅ **Compartilhamento Fácil**: Botões de compartilhamento em todas as páginas
- ✅ **Sistema de Match**: Engajamento através do sistema de swipe
- ✅ **Sistema de Alertas**: Notificações que mantêm usuários engajados

## 📁 Estrutura do Projeto

```
src/
├── components/              # Componentes reutilizáveis
│   ├── Header/             # Cabeçalho da aplicação
│   ├── ApartmentCard/      # Card de imóvel
│   ├── Filters/            # Sistema de filtros
│   ├── AuthModal/          # Modal de autenticação
│   ├── FinancingCalculator/# Calculadora aMORA
│   ├── ApartmentComments/  # Sistema de comentários
│   ├── ApartmentReactions/ # Sistema de reações
│   ├── ImageUpload/        # Upload de imagens
│   ├── AlertsManager/      # Gerenciador de alertas
│   └── ReactionScoringInfo/# Informações de scoring
├── pages/                  # Páginas da aplicação
│   ├── Home/               # Página principal
│   ├── ApartmentDetail/    # Detalhes do imóvel
│   ├── AddApartment/       # Cadastro de imóveis
│   ├── Profile/            # Perfil do usuário
│   ├── Groups/             # Lista de grupos
│   ├── GroupDetail/        # Detalhes do grupo
│   ├── Compare/            # Comparação de imóveis
│   ├── Dashboard/          # Dashboard de corretores
│   ├── Match/              # Sistema de match
│   ├── Login/              # Página de login
│   ├── Register/           # Página de registro
│   └── Alerts/             # Página de alertas
├── services/               # Serviços e APIs
│   ├── apartmentService.ts # Serviço de imóveis
│   ├── groupService.ts     # Serviço de grupos
│   ├── emailService.ts     # Serviço de email
│   ├── scrapingService.ts  # Serviço de scraping
│   ├── commentService.ts   # Serviço de comentários
│   ├── reactionService.ts  # Serviço de reações
│   ├── imageService.ts     # Serviço de imagens
│   ├── alertService.ts     # Serviço de alertas
│   └── groupNotificationService.ts # Notificações de grupo
├── hooks/                  # Hooks customizados
│   └── useAuth.ts          # Hook de autenticação
├── types/                  # Definições de tipos TypeScript
├── theme/                  # Configuração do tema Material-UI
├── utils/                  # Utilitários
├── lib/                    # Bibliotecas e configurações
└── App.tsx                 # Componente principal
```

## 🎨 Design e Interface

### **Paleta de Cores**
- **Primária**: #fc94fc (Rosa aMORA)
- **Secundária**: #04144c (Azul escuro)
- **Sucesso**: #4caf50 (Verde)
- **Aviso**: #ff9800 (Laranja)
- **Erro**: #f44336 (Vermelho)

### **Componentes Design System**
- **Cards**: Consistência visual em todos os elementos
- **Botões**: Hierarquia clara com variantes
- **Formulários**: Validação visual e feedback
- **Navegação**: Breadcrumbs e navegação intuitiva

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- **Desktop** (1200px+): Layout completo com sidebar
- **Tablet** (768px - 1199px): Layout adaptado
- **Mobile** (320px - 767px): Layout otimizado para touch

## 🎯 Funcionalidades por Tipo de Usuário

### 👤 Compradores
- Visualizar imóveis públicos
- Cadastrar imóveis de interesse (privados)
- Criar e gerenciar grupos
- Adicionar imóveis aos grupos
- Filtrar e comparar opções
- Usar o sistema de match
- Comentar e reagir a imóveis
- Receber notificações personalizadas

### 🏢 Corretores
- Todas as funcionalidades dos compradores
- Cadastrar imóveis públicos
- Gerenciar portfólio de imóveis
- Acesso ao dashboard com analytics
- Exportar relatórios em PDF
- Usar a calculadora aMORA
- Gerenciar alertas e notificações

## 🔧 Configuração Avançada

### Variáveis de Ambiente
```env
# Configurações básicas
REACT_APP_API_URL=http://localhost:3001
REACT_APP_APP_NAME=aMORA

# Supabase (para funcionalidades avançadas)
REACT_APP_SUPABASE_URL=sua_url_supabase
REACT_APP_SUPABASE_ANON_KEY=sua_chave_supabase

# ScrapingBee (para importação via link)
REACT_APP_SCRAPINGBEE_API_KEY=sua_chave_scrapingbee

# EmailJS (para notificações por email)
REACT_APP_EMAILJS_SERVICE_ID=gmail
REACT_APP_EMAILJS_TEMPLATE_ID=template_alerts
REACT_APP_EMAILJS_PUBLIC_KEY=sua_chave_emailjs
```

### Tema Personalizado
O tema pode ser customizado editando `src/theme/index.ts`:
```typescript
export const theme = createTheme({
  palette: {
    primary: {
      main: '#fc94fc',    // Rosa principal
      light: '#ffb3ff',
      dark: '#c965c9',
    },
    secondary: {
      main: '#04144c',    // Azul escuro
      light: '#1a2b6b',
      dark: '#020d2e',
    },
  },
  // ... outras configurações
});
```

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

### Deploy no Netlify
1. Conecte seu repositório ao Netlify
2. Configure o build command: `npm run build`
3. Configure o publish directory: `build`
4. Configure as variáveis de ambiente no painel do Netlify

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte:
- Abra uma issue no GitHub
- Entre em contato com a equipe de desenvolvimento
- Acesse a documentação técnica

## 🔮 Roadmap

### Funcionalidades Implementadas ✅
- [x] **Sistema de notificações** ✅
- [x] **Dashboard interativo** ✅
- [x] **Importação via link** ✅
- [x] **Sistema de grupos** ✅
- [x] **Sistema de comentários** ✅
- [x] **Sistema de reações** ✅
- [x] **Sistema de match** ✅
- [x] **Upload de imagens** ✅
- [x] **Calculadora aMORA** ✅
- [x] **Exportação PDF** ✅
- [x] **Sistema de alertas** ✅

### Próximas Funcionalidades
- [ ] Chat entre usuários
- [ ] Sistema de avaliações
- [ ] **Próximas plataformas**: Viva Real, ZAP Imóveis
- [ ] Sistema de favoritos
- [ ] Histórico de visualizações
- [ ] Notificações push
- [ ] Integração com CRM

### Melhorias Técnicas
- [ ] Testes automatizados
- [ ] PWA (Progressive Web App)
- [ ] Otimização de performance
- [ ] Internacionalização (i18n)
- [ ] Acessibilidade (a11y)
- [ ] Cache inteligente
- [ ] Offline mode

---

**aMORA** - Transformando a busca por imóveis em uma experiência colaborativa, eficiente e engajante. 🏠✨

**Acesse agora**: https://www.amorachallenge.netlify.app
