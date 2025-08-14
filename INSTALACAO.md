# 🚀 Instruções de Instalação - aMORA

## 📋 Pré-requisitos

Antes de executar a aplicação aMORA, você precisa instalar:

### 1. Node.js
- **Versão**: 16.0.0 ou superior
- **Download**: [https://nodejs.org/](https://nodejs.org/)
- **Recomendado**: Versão LTS (Long Term Support)

### 2. NPM (Node Package Manager)
- **Incluído**: Vem automaticamente com o Node.js
- **Verificação**: `npm --version`

## 🔧 Instalação do Node.js no Windows

### Opção 1: Instalador Oficial (Recomendado)
1. Acesse [https://nodejs.org/](https://nodejs.org/)
2. Baixe a versão LTS (botão verde)
3. Execute o instalador `.msi`
4. Siga as instruções do assistente
5. Reinicie o terminal/PowerShell

### Opção 2: Chocolatey (Gerenciador de Pacotes)
```powershell
# Instalar Chocolatey primeiro (se não tiver)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Instalar Node.js
choco install nodejs
```

### Opção 3: Scoop (Gerenciador de Pacotes Alternativo)
```powershell
# Instalar Scoop primeiro (se não tiver)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# Instalar Node.js
scoop install nodejs
```

## ✅ Verificação da Instalação

Após a instalação, abra um **novo** terminal/PowerShell e execute:

```bash
node --version
npm --version
```

Você deve ver algo como:
```
v18.17.0
9.6.7
```

## 🚀 Executando a Aplicação aMORA

### 1. Navegue para o diretório do projeto
```bash
cd amorachallenge
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Execute a aplicação
```bash
npm start
```

### 4. Acesse no navegador
```
http://localhost:3000
```

## 🛠️ Scripts Disponíveis

```bash
npm start          # Inicia o servidor de desenvolvimento
npm run build      # Cria a versão de produção
npm test           # Executa os testes
npm run eject      # Ejecta do Create React App
```

## 🔍 Solução de Problemas

### Erro: "npm não é reconhecido"
- **Causa**: Node.js não instalado ou não no PATH
- **Solução**: Reinstale o Node.js e reinicie o terminal

### Erro: "EACCES: permission denied"
- **Causa**: Problemas de permissão
- **Solução**: Execute o terminal como administrador

### Erro: "Port 3000 already in use"
- **Causa**: Outra aplicação usando a porta 3000
- **Solução**: 
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # Ou use outra porta
  set PORT=3001 && npm start
  ```

### Erro: "Cannot find module"
- **Causa**: Dependências não instaladas
- **Solução**: 
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

## 📱 Requisitos do Sistema

- **Sistema Operacional**: Windows 10/11, macOS 10.14+, Linux
- **RAM**: Mínimo 4GB, Recomendado 8GB+
- **Espaço em Disco**: 2GB livres
- **Navegador**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 🔗 Links Úteis

- [Node.js Official](https://nodejs.org/)
- [NPM Documentation](https://docs.npmjs.com/)
- [Create React App](https://create-react-app.dev/)
- [Material-UI](https://mui.com/)
- [React Documentation](https://reactjs.org/)

## 📞 Suporte

Se você encontrar problemas durante a instalação:

1. Verifique se o Node.js está instalado corretamente
2. Certifique-se de que está usando uma versão compatível (16+)
3. Reinicie o terminal após a instalação
4. Verifique se as variáveis de ambiente estão configuradas

---

**aMORA** - Transformando a busca por imóveis em uma experiência colaborativa! 🏠✨
