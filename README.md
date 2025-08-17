# aMORA - Plataforma de Imóveis

Uma plataforma web moderna para busca, comparação e gerenciamento de apartamentos e casas, desenvolvida com React, TypeScript e Material-UI.

## 🏠 Sobre o Projeto

A aMORA é uma plataforma completa que permite:

- **Compradores**: Cadastrar imóveis de interesse, criar grupos colaborativos e comparar opções
- **Corretores**: Publicar imóveis para venda de forma pública ou privada
- **Usuários**: Filtrar e buscar imóveis por características específicas
- **Grupos**: Colaborar em projetos de compra de imóveis

## ✨ Funcionalidades Principais

### 🏘️ Sistema de Imóveis
- Cadastro completo de apartamentos e casas
- **Importação automática via link** (QuintoAndar e OLX)
- Sistema de imagens e galeria
- Filtros avançados por preço, área, quartos, localização
- Visualização detalhada de cada imóvel

### 👥 Sistema de Usuários
- Dois tipos de usuário: Compradores e Corretores
- Perfis personalizáveis
- Sistema de autenticação seguro

### 👥 Sistema de Grupos
- Criação de grupos públicos e privados
- Colaboração entre usuários
- Controle de permissões (Admin/Membro)
- Organização de imóveis por projeto

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

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd amorachallenge
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute a aplicação**
```bash
npm start
```

4. **Acesse no navegador**
```
http://localhost:3000
```

### Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm build` - Cria a versão de produção
- `npm test` - Executa os testes
- `npm eject` - Ejecta do Create React App

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Header/         # Cabeçalho da aplicação
│   ├── ApartmentCard/  # Card de imóvel
│   └── Filters/        # Sistema de filtros
├── pages/              # Páginas da aplicação
│   ├── Home/           # Página principal
│   ├── ApartmentDetail/# Detalhes do imóvel
│   ├── AddApartment/   # Cadastro de imóveis
│   └── Profile/        # Perfil do usuário
├── hooks/              # Hooks customizados
│   └── useAuth.ts      # Hook de autenticação
├── types/              # Definições de tipos TypeScript
├── theme/              # Configuração do tema Material-UI
└── App.tsx             # Componente principal
```

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

## 🔮 Roadmap

### Próximas Funcionalidades
- [ ] Sistema de notificações
- [ ] Chat entre usuários
- [ ] Sistema de avaliações
- [x] **Expansão da importação**: OLX ✅
- [ ] **Próximas plataformas**: Viva Real, ZAP Imóveis
- [ ] Sistema de favoritos
- [ ] Histórico de visualizações
- [ ] Relatórios e analytics

### Melhorias Técnicas
- [ ] Testes automatizados
- [ ] PWA (Progressive Web App)
- [ ] Otimização de performance
- [ ] Internacionalização (i18n)
- [ ] Acessibilidade (a11y)

---

**aMORA** - Transformando a busca por imóveis em uma experiência colaborativa e eficiente. 🏠✨