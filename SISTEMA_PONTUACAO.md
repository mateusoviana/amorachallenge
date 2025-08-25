# Sistema de Pontuação por Reações - aMORA

## 📊 Visão Geral

Implementado sistema de pontuação automática baseado nas reações dos usuários nos grupos, ordenando os imóveis de forma inteligente sem mostrar as pontuações explicitamente aos usuários.

## 🎯 Funcionalidades Implementadas

### Sistema de Pontuação
- **Amei** = +2 pontos
- **Gostei** = +1 ponto  
- **Não sei** = 0 pontos
- **Não gostei** = -1 ponto
- **Odiei** = -2 pontos

### Critérios de Ordenação
1. **Pontuação Total** (decrescente)
2. **Critério de Desempate**: Menos rejeições (👎 + 💔)
3. **Segundo Desempate**: Mais reações totais

### Exemplo Prático
- Imóvel A: 1 Gostei + 1 Não sei = 1 ponto, 0 rejeições
- Imóvel B: 1 Amei + 1 Não gostei = 1 ponto, 1 rejeição
- **Resultado**: Imóvel A fica à frente do Imóvel B

## 🛠️ Arquivos Criados/Modificados

### Novos Arquivos
- `src/utils/reactionScoring.ts` - Lógica de cálculo de pontuação
- `src/hooks/useApartmentScoring.tsx` - Hook para gerenciar pontuações
- `src/components/ReactionScoringInfo/` - Componente informativo
- `src/utils/testReactionScoring.ts` - Testes do sistema

### Arquivos Modificados
- `src/types/index.ts` - Adicionado interface ApartmentScore
- `src/pages/GroupDetail/GroupDetail.tsx` - Implementada ordenação automática
- `src/components/ApartmentCard/ApartmentCard.tsx` - Callback para atualizar pontuações

## 🔧 Como Funciona

### 1. Cálculo Automático
- Quando usuários reagem aos imóveis, as pontuações são calculadas automaticamente
- Sistema considera todas as reações do grupo para cada imóvel

### 2. Ordenação Inteligente
- Imóveis são reordenados em tempo real baseado nas pontuações
- Critério de desempate favorece imóveis com menos rejeições

### 3. Interface Transparente
- Pontuações não são visíveis aos usuários
- Apenas a ordenação é aplicada
- Componente informativo explica o sistema quando solicitado

## 🎮 Uso no Sistema

### Para Usuários
- Reações nos imóveis influenciam automaticamente a ordem
- Imóveis mais bem avaliados aparecem primeiro
- Sistema transparente e intuitivo

### Para Desenvolvedores
```typescript
// Hook para usar o sistema
const { getSortedApartments, refreshScores } = useApartmentScoring(apartments, groupId);

// Função de cálculo
const score = calculateApartmentScore(reactions);

// Ordenação
const sortedScores = sortApartmentsByScore(scores);
```

## 🧪 Testes

Execute o teste do sistema:
```typescript
import { testReactionScoring } from './utils/testReactionScoring';
testReactionScoring(); // Executa no console
```

## 🚀 Benefícios

1. **Decisão Colaborativa**: Toda reação conta para a ordenação
2. **Transparência**: Sistema claro mas não intrusivo
3. **Eficiência**: Imóveis mais relevantes aparecem primeiro
4. **Flexibilidade**: Critérios de desempate inteligentes
5. **Tempo Real**: Atualizações automáticas das ordenações

## 📈 Próximos Passos

- [ ] Adicionar métricas de engajamento
- [ ] Implementar histórico de pontuações
- [ ] Criar relatórios de preferências do grupo
- [ ] Adicionar pesos diferentes por tipo de usuário
- [ ] Implementar sistema de trending (imóveis em alta)

---

**Sistema implementado com sucesso!** 🎉
Os imóveis agora são automaticamente ordenados baseado nas reações dos membros do grupo, criando uma experiência mais colaborativa e eficiente.