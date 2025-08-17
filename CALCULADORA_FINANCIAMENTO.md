# Calculadora de Financiamento aMORA

## Descrição

A calculadora de financiamento é uma nova funcionalidade integrada aos cards de imóveis da plataforma aMORA. Ela permite que os usuários calculem valores estimativos de mensalidade para financiamento de apartamentos.

## Funcionalidades

### Características Principais

- **Período de financiamento**: 36 meses
- **Entrada inicial**: Mínimo de R$ 50.000 e máximo de R$ 200.000
- **Entrada total necessária**: 20% do valor do imóvel
- **Cálculo automático**: Atualiza em tempo real conforme o usuário altera a entrada inicial

### Composição da Mensalidade

A mensalidade total é composta por duas parcelas:

1. **Parcela do aluguel**: 0,6% do valor do imóvel ao mês
2. **Parcela da entrada**: Valor restante da entrada (entrada total - entrada inicial) × 1,1 ÷ 36 meses

### Fórmula de Cálculo

```
Entrada Total = Valor do Imóvel × 0,2
Entrada Restante = Entrada Total - Entrada Inicial
Parcela do Aluguel = Valor do Imóvel × 0,006
Parcela da Entrada = (Entrada Restante × 1,1) ÷ 36
Total Mensal = Parcela do Aluguel + Parcela da Entrada
```

## Implementação Técnica

### Componente

- **Arquivo**: `src/components/FinancingCalculator/FinancingCalculator.tsx`
- **Props**: `apartmentPrice: number`
- **Localização**: Integrado à página `ApartmentDetail` logo abaixo do valor do imóvel

### Validações

- Entrada inicial deve estar entre R$ 50.000 e R$ 200.000
- Entrada inicial não pode ser maior que 20% do valor do imóvel
- Exibição de mensagens de erro quando as validações não são atendidas

### Interface do Usuário

- Campo de entrada para valor inicial
- Exibição do valor do imóvel e entrada total necessária
- Composição detalhada da mensalidade
- Formatação em moeda brasileira (R$)
- Design consistente com o tema da aplicação

## Exemplo de Uso

Para um imóvel de R$ 500.000:

- **Entrada inicial**: R$ 100.000
- **Entrada total necessária**: R$ 100.000 (20%)
- **Entrada restante**: R$ 0
- **Parcela do aluguel**: R$ 3.000 (0,6%)
- **Parcela da entrada**: R$ 0
- **Total mensal**: R$ 3.000

Para o mesmo imóvel com entrada menor:

- **Entrada inicial**: R$ 50.000
- **Entrada total necessária**: R$ 100.000 (20%)
- **Entrada restante**: R$ 50.000
- **Parcela do aluguel**: R$ 3.000 (0,6%)
- **Parcela da entrada**: R$ 1.527,78
- **Total mensal**: R$ 4.527,78

## Integração

A calculadora está integrada à página `ApartmentDetail` e aparece quando o usuário:

- Clica em um card de imóvel na página inicial
- Clica em um card de imóvel na página de detalhes do grupo
- Acessa diretamente a URL de detalhes de um imóvel

## Arquivos Modificados

1. `src/components/FinancingCalculator/FinancingCalculator.tsx` - Componente principal
2. `src/components/FinancingCalculator/index.ts` - Arquivo de exportação
3. `src/pages/ApartmentDetail/ApartmentDetail.tsx` - Integração da calculadora
4. `src/utils/testFinancingCalculator.ts` - Testes da funcionalidade
