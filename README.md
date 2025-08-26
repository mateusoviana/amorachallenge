# aMORA - Plataforma de Imóveis

Uma plataforma web moderna para busca, comparação e gerenciamento de apartamentos e casas, desenvolvida com React, TypeScript e Material-UI.

## 🏠 Sobre o Projeto

A aMORA é uma plataforma completa que permite:

- **Compradores**: Cadastrar imóveis de interesse, analisar imóveis cadastrados, criar grupos colaborativos e comparar opções
- **Corretores**: Publicar imóveis para venda de forma pública ou privada e interagir com clientes, ofertando opções e comentando sobre elas
- **Grupos**: Colaborar em projetos de compra de imóveis, interagindo entre si

## ✨ Funcionalidades Principais

### 🏘️ Sistema de Imóveis
- Cadastro completo de apartamentos e casas
- **Importação automática via link** (QuintoAndar e OLX)
- Sistema de imagens e galeria
- Filtros avançados por preço, área, quartos, localização
- Visualização detalhada de cada imóvel
- **Calculadora aMORA**: Simulação de financiamento com entrada reduzida
- **Comparação de Imóveis**: Página dedicada para comparar múltiplos imóveis
- **Dashboard Interativo**: Gráficos e estatísticas para corretores

### 📊 Sistema de Analytics
- **Dashboard de Corretores**: Gráficos de pizza, barras e linha
- **Análise por Faixa de Preço**: Distribuição percentual
- **Crescimento Mensal**: Evolução do portfólio
- **Exportação PDF**: Relatórios em formato profissional

### 👥 Sistema de Usuários
- Dois tipos de usuário: Compradores e Corretores
- Perfis personalizáveis

### 👥 Sistema de Grupos
- Criação de grupos colaborativos
- Acesso restrito apenas a membros do grupo
- Controle de permissões (Admin/Membro)
- Organização de imóveis por projeto
- **Seleção Visual**: Interface para escolher imóveis para o grupo
- **Notificações Automáticas**: Emails quando novos imóveis são adicionados

### 📧 Sistema de Notificações
- **Notificações por Email**: Alertas automáticos via EmailJS
- **Alertas Visuais**: Notificações na interface para novos imóveis
- **Reativação de Leads**: Emails personalizados com detalhes dos imóveis

### 🔍 Sistema de Filtros
- Filtros por características físicas
- Filtros por localização
- Filtros por grupos
- Filtros por preço e área

## 🎨 Design e Interface

- **Cores**: Tema personalizado com #fc94fc (rosa) e #04144c (azul escuro)
- **UI**: Material-UI com componentes modernos e responsivos
- **UX**: Interface intuitiva e acessível
- **Responsivo**: Funciona perfeitamente em desktop e mobile

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **Roteamento**: React Router v6
- **Estado**: React Hooks + Context API
- **Estilização**: Emotion + Material-UI Theme
- **Build**: Create React App
- **Gráficos**: Recharts para dashboards interativos
- **Email**: EmailJS para notificações
- **PDF**: jsPDF para exportação de relatórios
- **Web Scraping**: ScrapingBee para importação via link

## 🚀 Passo a Passo para Rodar o Projeto Localmente

### Não há necessidade de rodar localmente. A aplicação já está hospedada no link : https://amorachallenge.netlify.app/

### Pré-requisitos
- **Node.js**: Versão 16 ou superior
- **npm**: Gerenciador de pacotes (vem com Node.js)
- **Git**: Para clonar o repositório
- **Navegador moderno**: Chrome, Firefox, Safari ou Edge

### Instalação e Configuração

#### 1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd amorachallenge
```

#### 2. **Instale as dependências**
```bash
npm install
```

#### 3. **Configure as variáveis de ambiente (opcional)**
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

#### 4. **Execute a aplicação**
```bash
npm start
```

#### 5. **Acesse no navegador**
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
- **React + TypeScript**: Escolhido para type safety e melhor DX
- **Material-UI**: Componentes prontos e tema customizável
- **Context API**: Gerenciamento de estado global simples e eficiente
- **React Router**: Navegação SPA com URLs amigáveis

### **Experiência do Usuário**
- **Design Responsivo**: Funciona em todos os dispositivos
- **Navegação Intuitiva**: Fluxo claro entre páginas
- **Feedback Visual**: Loading states, tooltips e notificações
- **Acessibilidade**: Cores contrastantes e navegação por teclado

### **Modelo de Negócio**
- **Freemium**: Uso gratuito inicial, funcionalidades avançadas para corretores
- **Colaboração**: Grupos para casais, famílias e corretores
- **Integração**: WhatsApp e email para engajamento
- **Viralização**: Compartilhamento fácil de imóveis e grupos

### **Tecnologias de Terceiros**
- **ScrapingBee**: Importação automática de imóveis via link
- **EmailJS**: Notificações por email sem backend
- **Recharts**: Dashboards interativos para corretores
- **jsPDF**: Exportação de relatórios em PDF

### **Segurança e Privacidade**
- **Autenticação Simulada**: Sistema mock para demonstração
- **Controle de Acesso**: Permissões baseadas em tipo de usuário
- **Dados Privados**: Imóveis e grupos restritos aos membros

### Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm build` - Cria a versão de produção
- `npm test` - Executa os testes
- `npm eject` - Ejecta do Create React App


## 🔐 Sistema de Autenticação

A aplicação inclui um sistema de autenticação simulado que permite:

- Login/Logout de usuários
- Diferentes tipos de usuário (Comprador/Corretor)
- Controle de acesso baseado em permissões
- Persistência de sessão

## 🏗️ Arquitetura

### Frontend
- **Componentes**: Arquitetura baseada em componentes reutilizáveis
- **Estado**: Gerenciamento de estado com React Hooks e Context API
- **Roteamento**: Navegação entre páginas com React Router
- **Tema**: Sistema de temas personalizável com Material-UI

### Dados
- **Tipos**: Definições TypeScript para todas as entidades
- **Mock Data**: Dados de exemplo para demonstração
- **Estrutura**: Modelo de dados bem definido para imóveis, usuários e grupos

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🎯 Funcionalidades por Tipo de Usuário

### 👤 Compradores
- Visualizar imóveis públicos
- Cadastrar imóveis de interesse (privados)
- Criar e gerenciar grupos
- Adicionar imóveis aos grupos
- Filtrar e comparar opções

### 🏢 Corretores
- Todas as funcionalidades dos compradores
- Cadastrar imóveis públicos
- Gerenciar portfólio de imóveis
- Acesso ao grupo público automático

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_APP_NAME=aMORA
REACT_APP_SUPABASE_URL=sua_url_supabase
REACT_APP_SUPABASE_ANON_KEY=sua_chave_supabase
REACT_APP_SCRAPINGBEE_API_KEY=sua_chave_scrapingbee
```

**Para usar a importação via link:**
1. Crie uma conta gratuita no [ScrapingBee](https://www.scrapingbee.com/)
2. Obtenha sua API Key
3. Configure a variável `REACT_APP_SCRAPINGBEE_API_KEY`

### Tema Personalizado
O tema pode ser customizado editando `src/theme/index.ts`:

```typescript
export const theme = createTheme({
  palette: {
    primary: {
      main: '#fc94fc',    // Rosa principal
    },
    secondary: {
      main: '#04144c',    // Azul escuro
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

### Deploy no Netlify/Vercel
1. Conecte seu repositório
2. Configure o build command: `npm run build`
3. Configure o publish directory: `build`

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

## 🎯 Como Cada Problema Foi Endereçado

### **1. Desorganização da Busca de Imóveis**
**Problema**: Ferramenta para salvar, organizar e comparar imóveis (via link, input manual ou crawler).

**Soluções Implementadas**:
- ✅ **Sistema de Grupos**: Criação de grupos colaborativos para organizar imóveis por projeto
- ✅ **Importação via Link**: Integração com ScrapingBee para importar imóveis do QuintoAndar e OLX
- ✅ **Cadastro Manual**: Formulário completo para adicionar imóveis manualmente
- ✅ **Sistema de Filtros**: Filtros avançados por preço, área, quartos, localização e grupos
- ✅ **Comparação de Imóveis**: Página dedicada para comparar múltiplos imóveis lado a lado
- ✅ **Dashboard Interativo**: Gráficos e estatísticas para análise do portfólio

### **2. Falta de Engajamento Contínuo**
**Problema**: Notificações ou sugestões quando aparecer algo parecido com o que o lead busca e reativação via WhatsApp ou e-mail.

**Soluções Implementadas**:
- ✅ **Sistema de Notificações**: EmailJS integrado para notificar membros de grupos sobre novos imóveis
- ✅ **Notificações por Email**: Alertas automáticos quando novos imóveis são adicionados aos grupos
- ✅ **Integração WhatsApp**: Botões de compartilhamento direto para WhatsApp
- ✅ **Sistema de Alertas**: Notificações visuais na interface para novos imóveis
- ✅ **Reativação Automática**: Emails personalizados com detalhes dos novos imóveis

### **3. Dificuldade de Colaboração**
**Problema**: Contas ou links colaborativos para que casais, famílias e corretores trabalhem juntos.

**Soluções Implementadas**:
- ✅ **Sistema de Grupos**: Criação de grupos privados para colaboração
- ✅ **Controle de Permissões**: Admin e membros com diferentes níveis de acesso
- ✅ **Adição de Membros**: Convite de usuários para grupos específicos
- ✅ **Compartilhamento de Imóveis**: Adição de imóveis aos grupos colaborativos
- ✅ **Interface Colaborativa**: Página dedicada para seleção visual de imóveis em grupo
- ✅ **Notificações em Grupo**: Alertas automáticos para todos os membros

### **4. Corretores sem Ferramentas para Apresentar a aMORA**
**Problema**: Páginas personalizadas e interface para cadastrar imóveis junto com a apresentação do modelo aMORA.

**Soluções Implementadas**:
- ✅ **Dashboard de Corretores**: Interface dedicada com gráficos e estatísticas
- ✅ **Calculadora aMORA**: Simulação de financiamento com entrada reduzida (5% vs 20%)
- ✅ **Páginas de Apresentação**: Explicação detalhada do modelo aMORA
- ✅ **Cadastro de Imóveis**: Interface completa para corretores adicionarem imóveis
- ✅ **Relatórios em PDF**: Exportação de comparações e relatórios
- ✅ **Interface Profissional**: Design focado na experiência do corretor

### **5. Captação e Ativação de Leads sem Custo de Mídia**
**Problema**: Uso sem login obrigatório no início, integração com WhatsApp e potencial de viralização orgânica.

**Soluções Implementadas**:
- ✅ **Acesso Gratuito**: Visualização de imóveis públicos sem necessidade de cadastro
- ✅ **Login Opcional**: Usuários podem explorar a plataforma antes de se cadastrar
- ✅ **Integração WhatsApp**: Compartilhamento direto de imóveis via WhatsApp
- ✅ **Viralização Orgânica**: Links compartilháveis para imóveis e grupos
- ✅ **Modelo Freemium**: Funcionalidades básicas gratuitas, avançadas para corretores
- ✅ **Compartilhamento Fácil**: Botões de compartilhamento em todas as páginas

## 🔮 Roadmap

### Próximas Funcionalidades
- [x] **Sistema de notificações** ✅
- [x] **Dashboard interativo** ✅
- [x] **Importação via link** ✅
- [x] **Sistema de grupos** ✅
- [ ] Chat entre usuários
- [ ] Sistema de avaliações
- [x] **Expansão da importação**: OLX ✅
- [ ] **Próximas plataformas**: Viva Real, ZAP Imóveis
- [ ] Sistema de favoritos
- [ ] Histórico de visualizações
- [x] **Relatórios e analytics** ✅

### Melhorias Técnicas
- [ ] Testes automatizados
- [ ] PWA (Progressive Web App)
- [ ] Otimização de performance
- [ ] Internacionalização (i18n)
- [ ] Acessibilidade (a11y)

---

**aMORA** - Transformando a busca por imóveis em uma experiência colaborativa e eficiente. 🏠✨